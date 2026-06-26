(function () {
  function getUser() {
    return currentUser || JSON.parse(localStorage.getItem('turistando_currentUser'));
  }

  function saveUser(user) {
    currentUser = user;
    localStorage.setItem('turistando_currentUser', JSON.stringify(user));

    if (Array.isArray(usuariosDB)) {
      const index = usuariosDB.findIndex((entry) => entry.email === user.email);
      if (index !== -1) {
        usuariosDB[index] = user;
        localStorage.setItem('turistando_users', JSON.stringify(usuariosDB));
      }
    }
  }

  function findById(list, id) {
    return (list || []).find((item) => String(item.id) === String(id));
  }

  function renderEmpty(container, text) {
    if (!container) return;
    container.innerHTML = `<div class="lista-empty">${text}</div>`;
  }

  function cardHtml(tipo, item, description) {
    return `
      <div class="lista-item">
        <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
        <div>
          <h3>${item.nome}</h3>
          <p>${item.cidade} · ${description}</p>
        </div>
        <a href="${getItemDetailLink(tipo, item.id)}">Abrir</a>
      </div>
    `;
  }

  function renderList(containerId, items, tipo, emptyText, descriptionFormatter) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items.length) {
      renderEmpty(container, emptyText);
      return;
    }

    container.innerHTML = items.map((item) => cardHtml(tipo, item, descriptionFormatter(item))).join('');
  }

  function persistProfilePhoto(dataUrl) {
    const user = getUser();
    if (!user) return;
    user.profilePhoto = dataUrl;
    localStorage.setItem('turistando_profilePhoto', dataUrl);
    saveUser(user);
    renderProfile();
  }

  function renderProfile() {
    const user = getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const avatarBtn = document.getElementById('perfil-avatar-btn');
    const nome = document.getElementById('perfil-nome');
    const email = document.getElementById('perfil-email');
    const tipo = document.getElementById('perfil-tipo');
    const visitados = document.getElementById('stat-visitados');
    const favoritos = document.getElementById('stat-favoritos');
    const querok = document.getElementById('stat-querok');
    const cidadesChips = document.getElementById('perfil-cidades-chip');
    const categoriasChips = document.getElementById('perfil-categorias-chip');

    if (nome) nome.textContent = user.nome || 'Meu perfil';
    if (email) email.textContent = user.email || '';
    if (tipo) tipo.textContent = user.tipoViajante || 'Viajante';

    const totalVisitados = (visitadosCidades?.size || 0) + (visitadosHoteis?.size || 0) + (visitadosRestaurantes?.size || 0);
    const totalFavoritos = (favoritosHoteis?.size || 0) + (favoritosRestaurantes?.size || 0);
    const totalQueroConhecer = (queroConhecerHoteis?.size || 0) + (queroConhecerRestaurantes?.size || 0);

    if (visitados) visitados.textContent = String(totalVisitados);
    if (favoritos) favoritos.textContent = String(totalFavoritos);
    if (querok) querok.textContent = String(totalQueroConhecer);

    const photo = user.profilePhoto || localStorage.getItem('turistando_profilePhoto') || '';
    if (avatarBtn) {
      avatarBtn.classList.toggle('perfil-avatar--empty', !photo);
      avatarBtn.innerHTML = photo
        ? `<img class="perfil-avatar__img" src="${photo}" alt="Foto de perfil">`
        : '<i class="fa-solid fa-camera"></i>';
    }

    if (cidadesChips) {
      const cidades = Array.from(new Set([
        ...(user.visitadosCidades || []),
        ...Array.from(visitadosCidades || [])
      ]));

      cidadesChips.innerHTML = cidades.length
        ? cidades.map((cidade) => `<span class="lista-chip">${cidade}</span>`).join('')
        : '<div class="lista-empty">Nenhuma cidade visitada ainda.</div>';
    }

    if (categoriasChips) {
      categoriasChips.innerHTML = `
        <span class="lista-chip">${user.tipoViajante || 'Viajante'}</span>
        <span class="lista-chip">${totalFavoritos} favoritos</span>
        <span class="lista-chip">${totalQueroConhecer} para conhecer</span>
      `;
    }

    if (avatarBtn) {
      avatarBtn.onclick = () => {
        document.getElementById('perfil-photo-input')?.click();
      };
    }
  }

  function setupPhotoUpload() {
    const input = document.getElementById('perfil-photo-input');
    if (!input) return;

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        persistProfilePhoto(String(reader.result || ''));
      };
      reader.readAsDataURL(file);
    });
  }

  function renderVisitedSections() {
    renderList(
      'lista-hoteis-visitados',
      Array.from(visitadosHoteis || []).map((id) => findById(HOTEIS, id)).filter(Boolean),
      'hotel',
      'Nenhum hotel marcado como visitado ainda.',
      (item) => `Hotel · ${item.cidade}`
    );

    renderList(
      'lista-restaurantes-visitados',
      Array.from(visitadosRestaurantes || []).map((id) => findById(RESTAURANTES, id)).filter(Boolean),
      'restaurant',
      'Nenhum restaurante marcado como visitado ainda.',
      (item) => item.culinaria
    );

    const cidades = Array.from(new Set([...(getUser()?.visitadosCidades || []), ...Array.from(visitadosCidades || [])]));
    const cidadesContainer = document.getElementById('lista-cidades-visitadas');
    if (cidadesContainer) {
      cidadesContainer.innerHTML = cidades.length
        ? cidades.map((cidade) => `<span class="lista-chip">${cidade}</span>`).join('')
        : '<div class="lista-empty">Nenhuma cidade visitada ainda.</div>';
    }
  }

  function renderSavedSections() {
    renderList(
      'lista-favoritos-hoteis',
      Array.from(favoritosHoteis || []).map((id) => findById(HOTEIS, id)).filter(Boolean),
      'hotel',
      'Você ainda não favoritou nenhum hotel.',
      (item) => `Favorito · ${item.cidade}`
    );

    renderList(
      'lista-favoritos-restaurantes',
      Array.from(favoritosRestaurantes || []).map((id) => findById(RESTAURANTES, id)).filter(Boolean),
      'restaurant',
      'Você ainda não favoritou nenhum restaurante.',
      (item) => item.culinaria
    );

    renderList(
      'lista-querok-hoteis',
      Array.from(queroConhecerHoteis || []).map((id) => findById(HOTEIS, id)).filter(Boolean),
      'hotel',
      'Sua lista de hotéis para conhecer está vazia.',
      (item) => `Quero conhecer · ${item.cidade}`
    );

    renderList(
      'lista-querok-restaurantes',
      Array.from(queroConhecerRestaurantes || []).map((id) => findById(RESTAURANTES, id)).filter(Boolean),
      'restaurant',
      'Sua lista de restaurantes para conhecer está vazia.',
      (item) => item.culinaria
    );
  }

  function init() {
    const user = getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    renderProfile();
    setupPhotoUpload();
    renderVisitedSections();
    renderSavedSections();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
