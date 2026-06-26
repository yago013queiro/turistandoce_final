/* ============================================================
   TURISTANDO CE — Script Principal
   JavaScript simples, limpo e bem comentado.
   ============================================================ */

// ========================
// INICIALIZAÃ‡ÃƒO
// ========================

// Mesclar empresas do localStorage com os dados estáticos
function mesclarEmpresas() {
  try {
    const empresas = JSON.parse(localStorage.getItem('turistando_empresas') || '[]');
    if (empresas.length > 0) {
      const hoteisExtra = empresas.filter(e => e.tipo === 'hotel');
      const restExtra = empresas.filter(e => e.tipo === 'restaurante');
      // Adiciona empresas que não existem nos arrays originais (verifica pelo id)
      hoteisExtra.forEach(e => { if (!HOTEIS.find(h => h.id === e.id)) HOTEIS.push(e); });
      restExtra.forEach(e => { if (!RESTAURANTES.find(r => r.id === e.id)) RESTAURANTES.push(e); });
    }
  } catch (e) { /* ignora */ }
}

document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao();
  mesclarEmpresas();
  initProfileMenu();

  // Verifica qual página está carregando
  if (window.location.pathname.includes('cidade.html')) {
    carregarPaginaCidade();
  } else if (window.location.pathname.includes('pesquisa.html')) {
    // Na página de pesquisa, só inicializa o básico
    // O filtro é chamado pelo script inline no final do HTML
    // Delegação de eventos para filtros (garante que botões sejam sempre clicáveis)
    const advType = document.getElementById('adv-filter-type');
    if (advType) {
      advType.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (btn) toggleAdvFilter(btn, 'type');
      });
    }
    const advTags = document.getElementById('adv-filter-tags');
    if (advTags) {
      advTags.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (btn) toggleAdvFilter(btn, 'tag');
      });
    }
  } else if (window.location.pathname.includes('experiencias.html')) {
    if (typeof inicializarPaginaExperiencias === 'function') {
      inicializarPaginaExperiencias();
    }
  } else if (!window.location.pathname.includes('cadastro.html') && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('cadastro-empresa.html')) {
    renderDestinos();
    renderHoteis();
    renderRestaurantes();
    renderPasseios();
    renderAvaliacoes();
    renderGaleria();
  }

  iniciarObserver();
  carregarDarkMode();
  carregarAcessibilidade();
});

// ========================
// SISTEMA DE CONTAS E FAVORITOS (LOCALSTORAGE)
// ========================

let usuariosDB = JSON.parse(localStorage.getItem('turistando_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('turistando_currentUser')) || null;

// Sets de favoritos
const favoritosHoteis = new Set(currentUser && currentUser.favoritosHoteis ? currentUser.favoritosHoteis : []);
const favoritosRestaurantes = new Set(currentUser && currentUser.favoritosRestaurantes ? currentUser.favoritosRestaurantes : []);
const favoritosExperiencias = new Set(currentUser && currentUser.favoritosExperiencias ? currentUser.favoritosExperiencias : []);
const queroConhecerHoteis = new Set(currentUser && currentUser.queroConhecerHoteis ? currentUser.queroConhecerHoteis : []);
const queroConhecerRestaurantes = new Set(currentUser && currentUser.queroConhecerRestaurantes ? currentUser.queroConhecerRestaurantes : []);
const queroConhecerExperiencias = new Set(currentUser && currentUser.queroConhecerExperiencias ? currentUser.queroConhecerExperiencias : []);
const visitadosCidades = new Set(currentUser && currentUser.visitadosCidades ? currentUser.visitadosCidades : []);
const visitadosHoteis = new Set(currentUser && currentUser.visitadosHoteis ? currentUser.visitadosHoteis : []);
const visitadosRestaurantes = new Set(currentUser && currentUser.visitadosRestaurantes ? currentUser.visitadosRestaurantes : []);
const visitadosExperiencias = new Set(currentUser && currentUser.visitadosExperiencias ? currentUser.visitadosExperiencias : []);

function cadastrarUsuario(nome, email, telefone, senha, tipoViajante) {
  if (usuariosDB.find(u => u.email === email)) {
    alert("Este e-mail já está cadastrado.");
    return false;
  }
  const novoUser = {
    nome,
    email,
    telefone,
    senha,
    tipoViajante,
    favoritosHoteis: [],
    favoritosRestaurantes: [],
    favoritosExperiencias: [],
    queroConhecerHoteis: [],
    queroConhecerRestaurantes: [],
    queroConhecerExperiencias: [],
    visitadosCidades: [],
    visitadosHoteis: [],
    visitadosRestaurantes: [],
    visitadosExperiencias: [],
    profilePhoto: '',
  };
  usuariosDB.push(novoUser);
  localStorage.setItem('turistando_users', JSON.stringify(usuariosDB));

  // Auto-login
  localStorage.setItem('turistando_currentUser', JSON.stringify(novoUser));
  currentUser = novoUser;
  return true;
}

function loginUsuario(email, senha) {
  const user = usuariosDB.find(u => u.email === email && u.senha === senha);
  if (user) {
    localStorage.setItem('turistando_currentUser', JSON.stringify(user));
    currentUser = user;
    return true;
  }
  alert("E-mail ou senha incorretos.");
  return false;
}

function logoutUsuario() {
  localStorage.removeItem('turistando_currentUser');
  window.location.href = 'index.html';
}

function getUserPhoto() {
  return currentUser?.profilePhoto || localStorage.getItem('turistando_profilePhoto') || '';
}

function verificarAutenticacao() {
  const container = document.getElementById('user-auth-container');
  const containerMobile = document.getElementById('user-auth-mobile');
  const profileName = document.getElementById('profile-name');
  const profileAvatar = document.getElementById('profile-avatar');

  if (currentUser) {
    // Atualizar header padrão (landing page)
    const htmlAuth = `
      <div class="user-menu">
        <a href="minha-lista.html" class="user-name-link">
          <i class="fa-solid fa-user-circle"></i>
          <span>${currentUser.nome}</span>
        </a>
        <button onclick="logoutUsuario()" class="btn-logout" title="Sair">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    `;
    if (container) container.innerHTML = htmlAuth;

    // Atualizar mobile
    if (containerMobile) {
      containerMobile.innerHTML = `
        <div style="padding:12px 32px; border-top:1px solid var(--border); margin-top:auto;">
          <a href="minha-lista.html" style="display:flex; align-items:center; gap:10px; font-weight:600; color:var(--primary); padding:8px 0;">
            <i class="fa-solid fa-user-circle" style="font-size:1.3rem;"></i> Olá, ${currentUser.nome}
          </a>
          <a href="#" onclick="logoutUsuario()" style="display:flex; align-items:center; gap:10px; color:#ef4444; padding:8px 0; font-weight:500;">
            <i class="fa-solid fa-right-from-bracket"></i> Sair da conta
          </a>
        </div>
      `;
    }

    // Atualizar profile menu (páginas internas com header--internal)
    if (profileName) {
      profileName.textContent = currentUser.nome;
    }
    if (profileAvatar) {
      const photo = getUserPhoto();
      profileAvatar.innerHTML = photo
        ? `<img src="${photo}" alt="Perfil">`
        : `<i class="fa-solid fa-user"></i>`;
    }
  } else {
    // Usuário não logado - resetar profile menu
    if (profileName) {
      profileName.textContent = 'Entrar';
    }
    if (profileAvatar) {
      profileAvatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }
  }
}

function salvarFavorito(tipo) {
  if (!currentUser) {
    alert("Entre ou crie uma conta para salvar seus favoritos!");
    return false;
  }

  if (tipo === 'hotel') {
    currentUser.favoritosHoteis = Array.from(favoritosHoteis);
  } else if (tipo === 'experience') {
    currentUser.favoritosExperiencias = Array.from(favoritosExperiencias);
  } else {
    currentUser.favoritosRestaurantes = Array.from(favoritosRestaurantes);
  }

  localStorage.setItem('turistando_currentUser', JSON.stringify(currentUser));
  const index = usuariosDB.findIndex(u => u.email === currentUser.email);
  if (index !== -1) {
    usuariosDB[index] = currentUser;
    localStorage.setItem('turistando_users', JSON.stringify(usuariosDB));
  }
  return true;
}

function salvarQueroConhecer(tipo) {
  if (!currentUser) {
    alert("Entre ou crie uma conta para salvar sua lista de quero conhecer!");
    return false;
  }

  if (tipo === 'hotel') {
    currentUser.queroConhecerHoteis = Array.from(queroConhecerHoteis);
  } else if (tipo === 'experience') {
    currentUser.queroConhecerExperiencias = Array.from(queroConhecerExperiencias);
  } else {
    currentUser.queroConhecerRestaurantes = Array.from(queroConhecerRestaurantes);
  }

  localStorage.setItem('turistando_currentUser', JSON.stringify(currentUser));
  const index = usuariosDB.findIndex(u => u.email === currentUser.email);
  if (index !== -1) {
    usuariosDB[index] = currentUser;
    localStorage.setItem('turistando_users', JSON.stringify(usuariosDB));
  }
  return true;
}

function salvarVisitado(tipo) {
  if (!currentUser) {
    alert("Entre ou crie uma conta para salvar seus locais visitados!");
    return false;
  }

  currentUser.visitadosCidades = Array.from(visitadosCidades);
  currentUser.visitadosHoteis = Array.from(visitadosHoteis);
  currentUser.visitadosRestaurantes = Array.from(visitadosRestaurantes);
  currentUser.visitadosExperiencias = Array.from(visitadosExperiencias);

  localStorage.setItem('turistando_currentUser', JSON.stringify(currentUser));
  const index = usuariosDB.findIndex(u => u.email === currentUser.email);
  if (index !== -1) {
    usuariosDB[index] = currentUser;
    localStorage.setItem('turistando_users', JSON.stringify(usuariosDB));
  }
  return true;
}

function getItemDetailLink(tipo, id) {
  return `detalhe.html?tipo=${encodeURIComponent(tipo)}&id=${encodeURIComponent(id)}`;
}

function marcarVisitado(tipo, id, cidade) {
  if (tipo === 'hotel') {
    visitadosHoteis.add(id);
  } else if (tipo === 'restaurant' || tipo === 'restaurante') {
    visitadosRestaurantes.add(id);
  } else if (tipo === 'experience') {
    visitadosExperiencias.add(id);
  }
  if (cidade) visitadosCidades.add(cidade);
  salvarVisitado(tipo);
}

// ========================
// MENU MOBILE
// ========================

function toggleMenu() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('nav-overlay');

  nav.classList.toggle('open');
  hamburger.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById('nav');
    if (nav.classList.contains('open')) toggleMenu();
  });
});

// ========================
// MODO ESCURO
// ========================

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('turistando-dark', isDark);

  // Trocar ícone
  const icon = document.querySelector('#btn-dark i');
  icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function carregarDarkMode() {
  if (localStorage.getItem('turistando-dark') === 'true') {
    document.body.classList.add('dark');
    const icon = document.querySelector('#btn-dark i');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
}

// ========================
// ACESSIBILIDADE - PAINEL
// ========================

function atualizarBarraAcessibilidade(aberta) {
  const barra = document.querySelector('.acessibilidade-bar');
  const botao = document.getElementById('btn-acessibilidade');

  if (!barra || !botao) return;

  barra.classList.toggle('open', aberta);
  barra.classList.toggle('hidden', !aberta);
  barra.setAttribute('aria-hidden', String(!aberta));
  botao.setAttribute('aria-expanded', String(aberta));
  botao.title = aberta ? 'Ocultar acessibilidade' : 'Mostrar acessibilidade';
  localStorage.setItem('turistando-acessibilidade', String(aberta));
}

function carregarAcessibilidade() {
  const aberta = localStorage.getItem('turistando-acessibilidade') === 'true';
  atualizarBarraAcessibilidade(aberta);
}

function toggleAcessibilidade() {
  const barra = document.querySelector('.acessibilidade-bar');
  const aberta = barra ? !barra.classList.contains('open') : true;
  atualizarBarraAcessibilidade(aberta);
}

// ========================
// BOTÃƒO VOLTAR AO TOPO
// ========================

window.addEventListener('scroll', () => {
  const btn = document.getElementById('btn-top');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
});

// ========================
// RENDERIZAR DESTINOS
// ========================

// Estado para controle de "Ver mais"
const secaoEstado = {
  destinos: { limite: 8, total: 0 },
  hoteis: { limite: 8, total: 0 },
  restaurantes: { limite: 8, total: 0 },
  passeios: { limite: 8, total: 0 },
};

function renderDestinos(lista) {
  const grid = document.getElementById('grid-destinos');
  if (!grid) return;

  const dados = lista || CIDADES;
  secaoEstado.destinos.total = dados.length;
  const cidades = dados.slice(0, secaoEstado.destinos.limite);

  grid.innerHTML = cidades.map(c => {
    const galeria = c.galeria || [];
    const todasFotos = [c.imagem, ...galeria.filter(f => f !== c.imagem)].slice(0, 5);
    const temGaleria = todasFotos.length > 1;
    return `
    <a href="cidade.html?id=${c.id}" class="card fade-in" style="display:block">
      <div class="card-img-wrap">
        <img class="card-img" src="${c.imagem}" alt="${c.nome}" loading="lazy">
        ${temGaleria ? `
        <div class="card-gallery-dots">
          ${todasFotos.map((f, i) => `
            <span class="gallery-dot ${i === 0 ? 'active' : ''}" data-foto="${f}" data-index="${i}"></span>
          `).join('')}
        </div>
        <div class="card-gallery-nav">
          <button class="gallery-btn gallery-prev" onclick="event.preventDefault(); event.stopPropagation(); navegarGaleria(this, -1)" title="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="gallery-btn gallery-next" onclick="event.preventDefault(); event.stopPropagation(); navegarGaleria(this, 1)" title="Próxima"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <span class="gallery-counter">1/${todasFotos.length}</span>
        ` : ''}
      </div>
      <div class="card-body">
        <span class="badge">${c.regiao}</span>
        <h3>${c.nome}</h3>
        <p>${c.descricao}</p>
      </div>
    </a>
  `}).join('');

  iniciarObserver();
}

// ========================
// RENDERIZAR HOTÉIS
// ========================

function renderHoteis(lista) {
  const grid = document.getElementById('grid-hoteis');
  if (!grid) return;

  const dados = lista || HOTEIS;
  secaoEstado.hoteis.total = dados.length;
  const hoteis = dados.slice(0, secaoEstado.hoteis.limite);

  grid.innerHTML = hoteis.map(h => {
    const fav = favoritosHoteis.has(h.id);
    const galeria = h.galeria || [];
    const todasFotos = [h.imagem, ...galeria.filter(f => f !== h.imagem)].slice(0, 5);
    const temGaleria = todasFotos.length > 1;
    return `
    <div class="card hotel-card card-clickable fade-in" data-servicos='${JSON.stringify(h.servicos)}' onclick="abrirDetalhe('hotel', ${h.id})" role="link" tabindex="0">
      <div class="card-img-wrap">
        <img class="card-img" src="${h.imagem}" alt="${h.nome}" loading="lazy">
        ${temGaleria ? `
        <div class="card-gallery-dots">
          ${todasFotos.map((f, i) => `
            <span class="gallery-dot ${i === 0 ? 'active' : ''}" data-foto="${f}" data-index="${i}"></span>
          `).join('')}
        </div>
        <div class="card-gallery-nav">
          <button class="gallery-btn gallery-prev" onclick="event.preventDefault(); event.stopPropagation(); navegarGaleria(this, -1)" title="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="gallery-btn gallery-next" onclick="event.preventDefault(); event.stopPropagation(); navegarGaleria(this, 1)" title="Próxima"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <span class="gallery-counter">1/${todasFotos.length}</span>
        ` : ''}
      </div>
      <div class="card-body">
        <div class="hotel-meta">
          <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${h.cidade}</span>
          <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${h.avaliacao}</span>
        </div>
        <h3>${h.nome}</h3>
        <p>${h.descricao}</p>
        <div class="hotel-services">
          ${h.servicos.map(s => `<span class="service-tag">${s}</span>`).join('')}
        </div>
        <div class="hotel-footer">
          <span class="hotel-price">R$ ${h.preco}<small>/noite</small></span>
          <button class="btn-fav ${fav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavoritoHotel(${h.id}, this)" title="Favoritar">
            <i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `}).join('');

  iniciarObserver();
}

function toggleFavoritoHotel(id, btn) {
  if (favoritosHoteis.has(id)) {
    favoritosHoteis.delete(id);
    btn.classList.remove('active');
    btn.querySelector('i').className = 'fa-regular fa-heart';
  } else {
    if (salvarFavorito('hotel')) {
      favoritosHoteis.add(id);
      btn.classList.add('active');
      btn.querySelector('i').className = 'fa-solid fa-heart';
    } else {
      return; // Nao autenticado
    }
  }
  salvarFavorito('hotel');
}

// ========================
// RENDERIZAR RESTAURANTES
// ========================

function renderRestaurantes(lista) {
  const grid = document.getElementById('grid-restaurantes');
  if (!grid) return;

  const dados = lista || RESTAURANTES;
  secaoEstado.restaurantes.total = dados.length;
  const restaurantes = dados.slice(0, secaoEstado.restaurantes.limite);

  grid.innerHTML = restaurantes.map(r => {
    const fav = favoritosRestaurantes.has(r.id);
    const galeria = r.galeria || [];
    const todasFotos = [r.imagem, ...galeria.filter(f => f !== r.imagem)].slice(0, 5);
    const temGaleria = todasFotos.length > 1;
    return `
    <div class="card card-clickable fade-in" onclick="abrirDetalhe('restaurant', ${r.id})" role="link" tabindex="0">
      <div class="card-img-wrap">
        <img class="card-img" src="${r.imagem}" alt="${r.nome}" loading="lazy">
        ${temGaleria ? `
        <div class="card-gallery-dots">
          ${todasFotos.map((f, i) => `
            <span class="gallery-dot ${i === 0 ? 'active' : ''}" data-foto="${f}" data-index="${i}"></span>
          `).join('')}
        </div>
        <div class="card-gallery-nav">
          <button class="gallery-btn gallery-prev" onclick="event.stopPropagation(); navegarGaleria(this, -1)" title="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="gallery-btn gallery-next" onclick="event.stopPropagation(); navegarGaleria(this, 1)" title="Próxima"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <span class="gallery-counter">1/${todasFotos.length}</span>
        ` : ''}
      </div>
      <div class="card-body">
        <span class="rest-cuisine">${r.culinaria}</span>
        <h3>${r.nome}</h3>
        <p>${r.descricao || ''}</p>
        ${r.tags && r.tags.length > 0 ? `
        <div class="tag-list" style="margin: 8px 0;">
          ${r.tags.slice(0, 3).map(tag => `<span class="detail-tag" style="font-size: 0.75rem;"><i class="fa-solid fa-circle-check"></i> ${tag}</span>`).join('')}
        </div>
        ` : ''}
        <div class="hotel-meta">
          <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${r.cidade}</span>
          <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${r.avaliacao}</span>
        </div>
        <div class="rest-footer">
          <span class="rest-price">R$  ${r.preco}</span>
          <div style="display: flex; gap: 8px;">
            ${r.cardapio && r.cardapio.length > 0 ? `
            <button class="btn-cardapio" onclick="event.stopPropagation(); mostrarCardapio(${r.id})" title="Ver Cardápio">
              <i class="fa-solid fa-book-open"></i>
            </button>
            ` : ''}
            <button class="btn-fav ${fav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavoritoRestaurante(${r.id}, this)" title="Favoritar">
              <i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `}).join('');

  iniciarObserver();
}

function toggleFavoritoRestaurante(id, btn) {
  if (favoritosRestaurantes.has(id)) {
    favoritosRestaurantes.delete(id);
    btn.classList.remove('active');
    btn.querySelector('i').className = 'fa-regular fa-heart';
  } else {
    if (salvarFavorito('restaurante')) {
      favoritosRestaurantes.add(id);
      btn.classList.add('active');
      btn.querySelector('i').className = 'fa-solid fa-heart';
    } else {
      return;
    }
  }
  salvarFavorito('restaurante');
}

// ========================
// NAVEGAÇÃO DE GALERIA NOS CARDS
// ========================

function navegarGaleria(btn, direcao) {
  const imgWrap = btn.closest('.card-img-wrap');
  if (!imgWrap) return;
  const img = imgWrap.querySelector('.card-img');
  const dots = imgWrap.querySelectorAll('.gallery-dot');
  const counter = imgWrap.querySelector('.gallery-counter');
  if (!dots.length) return;

  // Encontra o dot ativo atual
  let activeIndex = -1;
  dots.forEach((d, i) => { if (d.classList.contains('active')) activeIndex = i; });

  // Calcula nova posição
  let newIndex = activeIndex + direcao;
  if (newIndex < 0) newIndex = dots.length - 1;
  if (newIndex >= dots.length) newIndex = 0;

  // Atualiza dot
  dots.forEach(d => d.classList.remove('active'));
  dots[newIndex].classList.add('active');

  // Atualiza imagem
  const fotoUrl = dots[newIndex].getAttribute('data-foto');
  if (fotoUrl && img) {
    img.style.opacity = '0.5';
    img.src = fotoUrl;
    setTimeout(() => { img.style.opacity = '1'; }, 150);
  }

  // Atualiza contador
  if (counter) counter.textContent = `${newIndex + 1}/${dots.length}`;
}

function getDetalheUrl(tipo, id) {
  return `detalhe.html?tipo=${encodeURIComponent(tipo)}&id=${encodeURIComponent(id)}`;
}

function abrirDetalhe(tipo, id) {
  window.location.href = getDetalheUrl(tipo, id);
}

// ========================
// RENDERIZAR PASSEIOS
// ========================

function renderPasseios(lista) {
  const grid = document.getElementById('grid-passeios');
  if (!grid) return;

  const dados = lista || PASSEIOS;
  secaoEstado.passeios.total = dados.length;
  const passeios = dados.slice(0, secaoEstado.passeios.limite);

  grid.innerHTML = passeios.map(p => `
    <div class="card fade-in">
      <div class="card-img-wrap">
        <img class="card-img" src="${p.imagem}" alt="${p.nome}" loading="lazy">
      </div>
      <div class="card-body">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <div class="passeio-info">
          <span><i class="fa-regular fa-clock"></i> ${p.duracao}</span>
          <span><i class="fa-solid fa-location-dot"></i> ${p.cidade}</span>
        </div>
        <span class="passeio-price">R$ ${p.valor}</span>
      </div>
    </div>
  `).join('');

  iniciarObserver();
}

// ========================
// RENDERIZAR AVALIAÃ‡Ã•ES
// ========================

function renderAvaliacoes() {
  const grid = document.getElementById('grid-avaliacoes');
  if (!grid) return;

  grid.innerHTML = AVALIACOES.map(a => `
    <div class="avaliacao-card fade-in">
      <img class="avaliacao-foto" src="${a.foto}" alt="${a.nome}" loading="lazy">
      <h4 class="avaliacao-nome">${a.nome}</h4>
      <div class="avaliacao-estrelas">${'â˜…'.repeat(a.estrelas)}${'â˜†'.repeat(5 - a.estrelas)}</div>
      <p class="avaliacao-texto">"${a.comentario}"</p>
    </div>
  `).join('');
}

// ========================
// RENDERIZAR GALERIA
// ========================

function renderGaleria() {
  const grid = document.getElementById('grid-galeria');
  if (!grid) return;

  grid.innerHTML = GALERIA.map(g => `
    <div class="galeria-item fade-in" data-legenda="${g.legenda}">
      <img src="${g.imagem}" alt="${g.legenda}" loading="lazy">
    </div>
  `).join('');
}

// ========================
// PESQUISA GLOBAL (NOVA)
// ========================

function realizarBuscaGlobal() {
  const inputBusca = document.getElementById('busca-global');
  if (!inputBusca) return;

  const termo = inputBusca.value.toLowerCase().trim();
  const mainContent = document.getElementById('main-content');
  const resultadosBusca = document.getElementById('resultados-busca');
  const resultadosContainer = document.getElementById('resultados-container');

  if (!termo) {
    if (mainContent) mainContent.style.display = 'block';
    if (resultadosBusca) resultadosBusca.style.display = 'none';
    return;
  }

  if (mainContent) mainContent.style.display = 'none';
  if (resultadosBusca) resultadosBusca.style.display = 'block';

  const cidadesFiltradas = CIDADES.filter(c =>
    c.nome.toLowerCase().includes(termo) ||
    c.regiao.toLowerCase().includes(termo) ||
    c.descricao.toLowerCase().includes(termo)
  );

  const hoteisFiltrados = HOTEIS.filter(h =>
    h.nome.toLowerCase().includes(termo) ||
    h.cidade.toLowerCase().includes(termo) ||
    h.descricao.toLowerCase().includes(termo) ||
    h.servicos.some(s => s.toLowerCase().includes(termo))
  );

  const restaurantesFiltrados = RESTAURANTES.filter(r =>
    r.nome.toLowerCase().includes(termo) ||
    r.cidade.toLowerCase().includes(termo) ||
    r.culinaria.toLowerCase().includes(termo) ||
    (r.descricao || '').toLowerCase().includes(termo)
  );

  const experienciasFiltradas = typeof EXPERIENCIAS !== 'undefined'
    ? EXPERIENCIAS.filter(e =>
      e.titulo.toLowerCase().includes(termo) ||
      e.cidade.toLowerCase().includes(termo) ||
      (e.categoria || '').toLowerCase().includes(termo) ||
      (e.empresaPrincipal || '').toLowerCase().includes(termo) ||
      (e.tags || []).some(tag => tag.toLowerCase().includes(termo))
    )
    : [];

  let html = '';

  if (cidadesFiltradas.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-location-dot"></i> Destinos Encontrados</h2>`;
    html += `<div class="grid grid-3">`;
    html += cidadesFiltradas.map(c => `
      <a href="cidade.html?id=${c.id}" class="card fade-in visible" style="display:block">
        <div class="card-img-wrap">
          <img class="card-img" src="${c.imagem}" alt="${c.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="badge">${c.regiao}</span>
          <h3>${c.nome}</h3>
          <p>${c.descricao}</p>
        </div>
      </a>
    `).join('');
    html += `</div>`;
  }

  if (hoteisFiltrados.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-bed"></i> Hotéis Relacionados</h2>`;
    html += `<div class="grid grid-3">`;
    html += hoteisFiltrados.map(h => {
      const fav = favoritosHoteis.has(h.id);
      return `
      <div class="card hotel-card card-clickable fade-in visible" onclick="abrirDetalhe('hotel', ${h.id})" role="link" tabindex="0">
        <div class="card-img-wrap">
          <img class="card-img" src="${h.imagem}" alt="${h.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <div class="hotel-meta">
            <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${h.cidade}</span>
            <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${h.avaliacao}</span>
          </div>
          <h3>${h.nome}</h3>
          <p>${h.descricao}</p>
          <div class="hotel-services">
            ${h.servicos.map(s => `<span class="service-tag">${s}</span>`).join('')}
          </div>
          <div class="hotel-footer">
            <span class="hotel-price">R$ ${h.preco}<small>/noite</small></span>
            <button class="btn-fav ${fav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavoritoHotel(${h.id}, this)" title="Favoritar">
              <i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `}).join('');
    html += `</div>`;
  }

  if (restaurantesFiltrados.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-utensils"></i> Restaurantes Relacionados</h2>`;
    html += `<div class="grid grid-3">`;
    html += restaurantesFiltrados.map(r => {
      const fav = favoritosRestaurantes.has(r.id);
      return `
      <div class="card card-clickable fade-in visible" onclick="abrirDetalhe('restaurant', ${r.id})" role="link" tabindex="0">
        <div class="card-img-wrap">
          <img class="card-img" src="${r.imagem}" alt="${r.nome}" loading="lazy">
        </div>
      <div class="card-body">
        <span class="rest-cuisine">${r.culinaria}</span>
        <h3>${r.nome}</h3>
        <p>${r.descricao || ''}</p>
        <div class="hotel-meta">
          <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${r.cidade}</span>
          <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${r.avaliacao}</span>
        </div>
        <div class="rest-footer">
          <span class="rest-price">${r.preco}</span>
          <button class="btn-fav ${fav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavoritoRestaurante(${r.id}, this)" title="Favoritar">
            <i class="fa-${fav ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
      </div>
      </div>
    `}).join('');
    html += `</div>`;
  }

  if (experienciasFiltradas.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-route"></i> Experiências Encontradas</h2>`;
    html += `<div class="grid grid-3">`;
    html += experienciasFiltradas.map(e => `
          <a href="detalhe.html?tipo=experience&id=${e.id}" class="card card-clickable fade-in visible experience-card" style="display:block">
        <div class="card-img-wrap">
          <img class="card-img" src="${e.banner || e.imagem || ''}" alt="${e.titulo}" loading="lazy">
          <span class="experience-badge">${e.categoria}</span>
        </div>
        <div class="card-body">
          <div class="hotel-meta">
            <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${e.cidade}</span>
            <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${e.avaliacao}</span>
          </div>
          <h3>${e.titulo}</h3>
          <p>${e.descricaoCurta || e.descricao || ''}</p>
          <div class="hotel-footer" style="margin-top:12px;">
            <span class="hotel-price">${e.precoFormatado || `R$ ${e.precoMin}`}</span>
          </div>
        </div>
      </a>
    `).join('');
    html += `</div>`;
  }

  if (html === '') {
    html = `
      <div class="empty-state fade-in visible">
        <i class="fa-solid fa-face-frown-open"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Não encontramos nada correspondente a "<b>${termo}</b>".</p>
        <p>Tente utilizar outros termos de pesquisa ou veja nossas sugestões.</p>
      </div>
    `;
  }

  if (resultadosContainer) resultadosContainer.innerHTML = html;
}

function preencherBusca(termo) {
  const input = document.getElementById('busca-global');
  if (input) {
    input.value = termo;
    realizarBuscaGlobal();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ========================
// ROTEIRO INTELIGENTE
// ========================

function gerarRoteiro() {
  const dias = parseInt(document.getElementById('roteiro-dias').value) || 0;
  const orcamento = parseInt(document.getElementById('roteiro-orcamento').value) || 0;
  const resultado = document.getElementById('roteiro-resultado');

  if (dias < 1 || dias > 7) {
    alert('Informe de 1 a 7 dias.');
    return;
  }

  if (orcamento < 100) {
    alert('Informe um orçamento mínimo de R$ 100.');
    return;
  }

  // Montar roteiro simples combinando dados existentes
  const orcamentoDiario = Math.floor(orcamento / dias);
  let html = '';

  for (let i = 0; i < dias; i++) {
    const cidade = CIDADES[i % CIDADES.length];
    const hotel = HOTEIS[i % HOTEIS.length];
    const restaurante = RESTAURANTES[i % RESTAURANTES.length];
    const passeio = PASSEIOS[i % PASSEIOS.length];

    html += `
      <div class="roteiro-dia">
        <h4>📍 Dia ${i + 1} — ${cidade.nome}</h4>
        <p>
          <strong>Manhã:</strong> ${passeio.nome} (${passeio.duracao})<br>
          <strong>Almoço:</strong> ${restaurante.nome} — ${restaurante.culinaria}<br>
          <strong>Tarde:</strong> Explorar ${cidade.nome}<br>
          <strong>Hospedagem:</strong> ${hotel.nome} — R$ ${hotel.preco}/noite<br>
          <strong>Orçamento do dia:</strong> ~R$ ${orcamentoDiario}
        </p>
      </div>
    `;
  }

  html += `
    <div class="roteiro-dia" style="text-align:center; margin-top:20px;">
      <h4>💰 Resumo</h4>
      <p><strong>${dias} dias</strong> de viagem • Orçamento total: <strong>R$ ${orcamento}</strong> • ~R$ ${orcamentoDiario}/dia</p>
    </div>
  `;

  resultado.innerHTML = html;

  // Re-observar animações
  iniciarObserver();
}

// ========================
// ACESSIBILIDADE — FONTE
// ========================

let tamanhoFonte = 16;

function alterarFonte(direcao) {
  tamanhoFonte = Math.max(12, Math.min(24, tamanhoFonte + direcao * 2));
  document.documentElement.style.fontSize = tamanhoFonte + 'px';
}

// ========================
// ACESSIBILIDADE — LEITURA POR VOZ
// ========================

function lerPagina() {
  // Parar leitura anterior se existir
  window.speechSynthesis.cancel();

  const texto = document.querySelector('main, .hero-content, .section-title')?.textContent
    || 'Bem-vindo ao Turistando CE. Descubra os melhores destinos do Ceará.';

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.9;

  window.speechSynthesis.speak(fala);
}

function pararLeitura() {
  window.speechSynthesis.cancel();
}

// ========================
// ANIMAÃ‡Ã•ES (INTERSECTION OBSERVER)
// ========================

function iniciarObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    observer.observe(el);
  });
}

// ========================
// PÃGINA DA CIDADE
// ========================

let cidadeAtual = null;

function carregarPaginaCidade() {
  const params = new URLSearchParams(window.location.search);
  const cidadeId = parseInt(params.get('id'));

  cidadeAtual = CIDADES.find(c => c.id === cidadeId);

  if (!cidadeAtual) {
    window.location.href = 'index.html';
    return;
  }

  // Preencher Hero da cidade
  document.getElementById('cidade-nome').textContent = cidadeAtual.nome;
  document.getElementById('cidade-descricao').textContent = cidadeAtual.descricao;
  document.getElementById('cidade-hero-bg').style.backgroundImage = `url('${cidadeAtual.imagem}')`;

  // Filtrar dados da cidade
  const hoteisCidade = HOTEIS.filter(h => h.cidade === cidadeAtual.nome);
  const restaurantesCidade = RESTAURANTES.filter(r => r.cidade === cidadeAtual.nome);
  const experienciasCidade = typeof EXPERIENCIAS !== 'undefined'
    ? EXPERIENCIAS.filter(e => e.cidade === cidadeAtual.nome)
    : [];

  document.getElementById('stat-hoteis').textContent = hoteisCidade.length;
  document.getElementById('stat-restaurantes').textContent = restaurantesCidade.length;
  const statExperiencias = document.getElementById('stat-experiencias');
  if (statExperiencias) statExperiencias.textContent = experienciasCidade.length;
  document.getElementById('stat-avaliacoes').textContent = AVALIACOES.length; // Fictício

  renderHoteis(hoteisCidade);
  renderRestaurantes(restaurantesCidade);

  const gridExperiencias = document.getElementById('grid-experiencias-cidade');
  if (gridExperiencias && typeof window.renderExperienciasCards === 'function') {
    window.renderExperienciasCards(gridExperiencias, experienciasCidade.slice(0, 6), {
      contexto: 'cidade',
      cidade: cidadeAtual.nome
    });
  }
}

let cidadeAdvTipoAtivo = 'todos';
let cidadeAdvTagsAtivas = new Set();

function toggleCidadeAdvFilter(btn, categoria) {
  if (categoria === 'type') {
    document.querySelectorAll('#cidade-adv-type .filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    cidadeAdvTipoAtivo = btn.dataset.type;
  } else if (categoria === 'tag') {
    const tag = btn.dataset.tag;
    if (cidadeAdvTagsAtivas.has(tag)) {
      cidadeAdvTagsAtivas.delete(tag);
      btn.classList.remove('active');
    } else {
      cidadeAdvTagsAtivas.add(tag);
      btn.classList.add('active');
    }
  }
  filtrarCidadeAvancada();
}

function atualizarLabelPrecoCidade(val) {
  const lbl = document.getElementById('cidade-preco-label');
  if (lbl) {
    lbl.textContent = val == 2000 ? 'Qualquer preço' : `Até R$ ${val}`;
  }
}

function filtrarCidadeAvancada() {
  if (!cidadeAtual) return;

  const termoEl = document.getElementById('cidade-adv-text');
  const termoText = termoEl ? termoEl.value.toLowerCase().trim() : '';

  const precoInput = document.getElementById('cidade-adv-preco');
  const precoMax = precoInput ? parseInt(precoInput.value) : 2000;

  const ordemInput = document.getElementById('cidade-adv-ordem');
  const ordem = ordemInput ? ordemInput.value : 'relevancia';

  let hoteisRes = [];
  let restaurantesRes = [];
  let experienciasRes = [];

  // Filtro Hoteis
  if (cidadeAdvTipoAtivo === 'todos' || cidadeAdvTipoAtivo === 'hoteis') {
    hoteisRes = HOTEIS.filter(h => {
      if (h.cidade !== cidadeAtual.nome) return false;
      const matchTexto = h.nome.toLowerCase().includes(termoText) || h.descricao.toLowerCase().includes(termoText);
      const matchTags = cidadeAdvTagsAtivas.size === 0 || Array.from(cidadeAdvTagsAtivas).every(t => h.servicos.includes(t) || h.descricao.toLowerCase().includes(t.toLowerCase()));
      const matchPreco = precoMax == 2000 || h.precoMin <= precoMax;
      return matchTexto && matchTags && matchPreco;
    });
  }

  // Filtro Restaurantes
  if (cidadeAdvTipoAtivo === 'todos' || cidadeAdvTipoAtivo === 'restaurantes') {
    restaurantesRes = RESTAURANTES.filter(r => {
      if (r.cidade !== cidadeAtual.nome) return false;
      const matchTexto = r.nome.toLowerCase().includes(termoText) || r.culinaria.toLowerCase().includes(termoText) || (r.descricao || '').toLowerCase().includes(termoText);
      const matchTags = cidadeAdvTagsAtivas.size === 0 || Array.from(cidadeAdvTagsAtivas).every(t => r.culinaria.toLowerCase().includes(t.toLowerCase()) || r.nome.toLowerCase().includes(t.toLowerCase()));
      return matchTexto && matchTags;
    });
  }

  if (typeof EXPERIENCIAS !== 'undefined') {
    experienciasRes = EXPERIENCIAS.filter(e => {
      if (e.cidade !== cidadeAtual.nome) return false;
      const matchTexto = e.titulo.toLowerCase().includes(termoText) || e.descricao.toLowerCase().includes(termoText) || (e.empresaPrincipal || '').toLowerCase().includes(termoText);
      const matchTags = cidadeAdvTagsAtivas.size === 0 || Array.from(cidadeAdvTagsAtivas).every(t =>
        (e.tags || []).some(tag => tag.toLowerCase().includes(t.toLowerCase())) ||
        (e.categoria || '').toLowerCase().includes(t.toLowerCase()) ||
        (e.descricao || '').toLowerCase().includes(t.toLowerCase())
      );
      return matchTexto && matchTags;
    });
  }

  // Ordenação
  const sortFunc = (a, b) => {
    if (ordem === 'preco-menor') {
      const pA = a.precoMin || a.valor || 0;
      const pB = b.precoMin || b.valor || 0;
      return pA - pB;
    }
    if (ordem === 'preco-maior') {
      const pA = a.precoMin || a.valor || 0;
      const pB = b.precoMin || b.valor || 0;
      return pB - pA;
    }
    if (ordem === 'avaliacao-melhor') {
      const avA = a.avaliacao || 0;
      const avB = b.avaliacao || 0;
      return avB - avA;
    }
    return 0;
  };

  hoteisRes.sort(sortFunc);
  restaurantesRes.sort((a, b) => (ordem === 'avaliacao-melhor' ? (b.avaliacao || 0) - (a.avaliacao || 0) : 0));

  renderHoteis(hoteisRes);
  renderRestaurantes(restaurantesRes);

  const gridExperiencias = document.getElementById('grid-experiencias-cidade');
  if (gridExperiencias && typeof window.renderExperienciasCards === 'function') {
    window.renderExperienciasCards(gridExperiencias, experienciasRes);
  }

  const secHoteis = document.getElementById('hoteis');
  if (secHoteis) {
    secHoteis.style.display = hoteisRes.length > 0 ? 'block' : 'none';
  }

  const secRestaurantes = document.getElementById('restaurantes');
  if (secRestaurantes) {
    secRestaurantes.style.display = restaurantesRes.length > 0 ? 'block' : 'none';
  }

  const emptyState = document.getElementById('empty-state-cidade');
  if (emptyState) {
    if (hoteisRes.length === 0 && restaurantesRes.length === 0 && experienciasRes.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }
  }
}

// ========================
// PESQUISA AVANÃ‡ADA (DETALHADA)
// ========================

let advTipoAtivo = 'todos';
let advTagsAtivas = new Set();

function toggleAdvFilter(btn, categoria) {
  if (categoria === 'type') {
    // Single select para Tipo
    document.querySelectorAll('#adv-filter-type .filter-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    advTipoAtivo = btn.dataset.type;
  } else if (categoria === 'tag') {
    // Multi select para Tags
    const tag = btn.dataset.tag;
    if (advTagsAtivas.has(tag)) {
      advTagsAtivas.delete(tag);
      btn.classList.remove('active');
    } else {
      advTagsAtivas.add(tag);
      btn.classList.add('active');
    }
  }
  filtrarPesquisaAvancada();
}

function atualizarLabelPreco(val) {
  const lbl = document.getElementById('adv-preco-label');
  if (lbl) {
    lbl.textContent = val == 2000 ? 'Qualquer preço' : `Até R$ ${val}`;
  }
}

function filtrarPorTipoResumo(btn) {
  const tipo = btn.dataset.type;
  if (!tipo) return;

  // Atualizar classe active nos botões de resumo
  document.querySelectorAll('#adv-results-summary .summary-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Atualizar filtro de tipo principal
  advTipoAtivo = tipo;

  // Atualizar chips de filtro de tipo para refletir a seleção
  document.querySelectorAll('#adv-filter-type .filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.type === tipo);
  });

  // Reaplicar filtro
  filtrarPesquisaAvancada();
}

function filtrarPesquisaAvancada() {
  const container = document.getElementById('adv-resultados-container');
  if (!container) return; // Não estamos na página de pesquisa avançada

  const termoEl = document.getElementById('adv-search-text');
  const termoText = termoEl ? termoEl.value.toLowerCase().trim() : '';

  const selectCidade = document.getElementById('adv-filter-cidade');
  const cidadeSelecionada = selectCidade ? selectCidade.value : 'todas';

  const precoInput = document.getElementById('adv-filter-preco');
  const precoMax = precoInput ? parseInt(precoInput.value) : 2000;

  const ordemInput = document.getElementById('adv-filter-ordem');
  const ordem = ordemInput ? ordemInput.value : 'relevancia';

  let cidadesRes = [];
  let hoteisRes = [];
  let restaurantesRes = [];
  let passeiosRes = [];
  let experienciasRes = [];

  // Filtro Cidades (influenciado por tags)
  if (advTipoAtivo === 'todos' || advTipoAtivo === 'cidades') {
    cidadesRes = CIDADES.filter(c => {
      const matchTexto = c.nome.toLowerCase().includes(termoText) || c.descricao.toLowerCase().includes(termoText);
      const matchCidade = cidadeSelecionada === 'todas' || c.nome === cidadeSelecionada;
      // Tags influenciam: cidade aparece se tiver hotéis/restaurantes com as tags
      let matchTags = true;
      if (advTagsAtivas.size > 0) {
        const hoteisNaCidade = HOTEIS.filter(h => h.cidade === c.nome);
        const restsNaCidade = RESTAURANTES.filter(r => r.cidade === c.nome);
        matchTags = Array.from(advTagsAtivas).some(tag => {
          const tagLower = tag.toLowerCase();
          return hoteisNaCidade.some(h =>
            (h.servicos || []).some(s => s.toLowerCase().includes(tagLower)) ||
            (h.tags || []).some(t => t.toLowerCase().includes(tagLower)) ||
            h.descricao.toLowerCase().includes(tagLower)
          ) || restsNaCidade.some(r =>
            r.culinaria.toLowerCase().includes(tagLower) ||
            (r.tags || []).some(t => t.toLowerCase().includes(tagLower)) ||
            r.descricao.toLowerCase().includes(tagLower)
          );
        });
      }
      return matchTexto && matchCidade && matchTags;
    });
  }

  // Filtro Hotéis
  if (advTipoAtivo === 'todos' || advTipoAtivo === 'hoteis') {
    hoteisRes = HOTEIS.filter(h => {
      const matchTexto = h.nome.toLowerCase().includes(termoText) || h.descricao.toLowerCase().includes(termoText);
      const matchCidade = cidadeSelecionada === 'todas' || h.cidade === cidadeSelecionada;
      const matchTags = advTagsAtivas.size === 0 || Array.from(advTagsAtivas).every(t => h.servicos.includes(t) || h.descricao.toLowerCase().includes(t.toLowerCase()));
      const matchPreco = precoMax == 2000 || h.precoMin <= precoMax;
      return matchTexto && matchCidade && matchTags && matchPreco;
    });
  }

  // Filtro Restaurantes
  if (advTipoAtivo === 'todos' || advTipoAtivo === 'restaurantes') {
    restaurantesRes = RESTAURANTES.filter(r => {
      const matchTexto = r.nome.toLowerCase().includes(termoText) || r.culinaria.toLowerCase().includes(termoText);
      const matchCidade = cidadeSelecionada === 'todas' || r.cidade === cidadeSelecionada;
      const matchTags = advTagsAtivas.size === 0 || Array.from(advTagsAtivas).every(t => r.culinaria.toLowerCase().includes(t.toLowerCase()) || r.nome.toLowerCase().includes(t.toLowerCase()));
      return matchTexto && matchCidade && matchTags;
    });
  }

  // Filtro Passeios
  if (advTipoAtivo === 'todos' || advTipoAtivo === 'passeios') {
    passeiosRes = PASSEIOS.filter(p => {
      const matchTexto = p.nome.toLowerCase().includes(termoText) || p.descricao.toLowerCase().includes(termoText);
      const matchCidade = cidadeSelecionada === 'todas' || p.cidade === cidadeSelecionada;
      const matchTags = advTagsAtivas.size === 0 || Array.from(advTagsAtivas).every(t => p.descricao.toLowerCase().includes(t.toLowerCase()) || p.nome.toLowerCase().includes(t.toLowerCase()));
      const matchPreco = precoMax == 2000 || p.valor <= precoMax;
      return matchTexto && matchCidade && matchTags && matchPreco;
    });
  }

  // Filtro Experiências
  if (advTipoAtivo === 'todos' || advTipoAtivo === 'experiencias') {
    experienciasRes = typeof EXPERIENCIAS !== 'undefined'
      ? EXPERIENCIAS.filter(e => {
        const matchTexto =
          e.titulo.toLowerCase().includes(termoText) ||
          e.cidade.toLowerCase().includes(termoText) ||
          (e.categoria || '').toLowerCase().includes(termoText) ||
          (e.empresaPrincipal || '').toLowerCase().includes(termoText) ||
          (e.tags || []).some(tag => tag.toLowerCase().includes(termoText));
        const matchCidade = cidadeSelecionada === 'todas' || e.cidade === cidadeSelecionada;
        const matchTags = advTagsAtivas.size === 0 || Array.from(advTagsAtivas).every(t =>
          (e.tags || []).some(tag => tag.toLowerCase().includes(t.toLowerCase())) ||
          (e.categoria || '').toLowerCase().includes(t.toLowerCase()) ||
          (e.descricao || '').toLowerCase().includes(t.toLowerCase())
        );
        const matchPreco = precoMax == 2000 || (e.precoMin || 0) <= precoMax;
        return matchTexto && matchCidade && matchTags && matchPreco;
      })
      : [];
  }

  // Ordenação (Aplicada a Hoteis e Passeios que tem preço numérico e avaliação)
  const sortFunc = (a, b) => {
    if (ordem === 'preco-menor') {
      const pA = a.precoMin || a.valor || 0;
      const pB = b.precoMin || b.valor || 0;
      return pA - pB;
    }
    if (ordem === 'preco-maior') {
      const pA = a.precoMin || a.valor || 0;
      const pB = b.precoMin || b.valor || 0;
      return pB - pA;
    }
    if (ordem === 'avaliacao-melhor') {
      const avA = a.avaliacao || 0;
      const avB = b.avaliacao || 0;
      return avB - avA;
    }
    return 0; // Relevância padrão
  };

  hoteisRes.sort(sortFunc);
  passeiosRes.sort(sortFunc);
  experienciasRes.sort(sortFunc);
  restaurantesRes.sort((a, b) => (ordem === 'avaliacao-melhor' ? (b.avaliacao || 0) - (a.avaliacao || 0) : 0));

  // Renderizar
  let html = '';
  const total = cidadesRes.length + hoteisRes.length + restaurantesRes.length + passeiosRes.length + experienciasRes.length;

  if (cidadesRes.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-location-dot"></i> Destinos</h2>`;
    html += `<div class="grid grid-3">`;
    html += cidadesRes.map(c => `
      <a href="cidade.html?id=${c.id}" class="card fade-in visible" style="display:block">
        <div class="card-img-wrap">
          <img class="card-img" src="${c.imagem}" alt="${c.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="badge">${c.regiao}</span>
          <h3>${c.nome}</h3>
          <p>${c.descricao}</p>
        </div>
      </a>
    `).join('');
    html += `</div>`;
  }

  if (hoteisRes.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-bed"></i> Hotéis</h2>`;
    html += `<div class="grid grid-3">`;
    html += hoteisRes.map(h => {
      const fav = favoritosHoteis.has(h.id);
      return `
      <div class="card hotel-card card-clickable fade-in visible" onclick="abrirDetalhe('hotel', ${h.id})" role="link" tabindex="0">
        <div class="card-img-wrap">
          <img class="card-img" src="${h.imagem}" alt="${h.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <div class="hotel-meta">
            <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${h.cidade}</span>
            <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${h.avaliacao}</span>
          </div>
          <h3>${h.nome}</h3>
          <p>${h.descricao}</p>
          <div class="hotel-footer" style="margin-top:12px;">
            <span class="hotel-price">R$ ${h.preco}<small>/noite</small></span>
          </div>
        </div>
      </div>
    `}).join('');
    html += `</div>`;
  }

  if (restaurantesRes.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-utensils"></i> Restaurantes</h2>`;
    html += `<div class="grid grid-3">`;
    html += restaurantesRes.map(r => `
      <div class="card card-clickable fade-in visible" onclick="abrirDetalhe('restaurant', ${r.id})" role="link" tabindex="0">
        <div class="card-img-wrap">
          <img class="card-img" src="${r.imagem}" alt="${r.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <span class="rest-cuisine">${r.culinaria}</span>
          <h3>${r.nome}</h3>
          <div class="hotel-meta">
            <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${r.cidade}</span>
            <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${r.avaliacao}</span>
          </div>
        </div>
      </div>
    `).join('');
    html += `</div>`;
  }

  if (passeiosRes.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-map"></i> Passeios</h2>`;
    html += `<div class="grid grid-3">`;
    html += passeiosRes.map(p => `
      <div class="card fade-in visible">
        <div class="card-img-wrap">
          <img class="card-img" src="${p.imagem}" alt="${p.nome}" loading="lazy">
        </div>
        <div class="card-body">
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <div class="hotel-footer" style="margin-top:12px;">
            <span class="passeio-price" style="font-weight:700;">R$ ${p.valor}</span>
          </div>
        </div>
      </div>
    `).join('');
    html += `</div>`;
  }

  if (experienciasRes.length > 0) {
    html += `<h2 class="category-title"><i class="fa-solid fa-route"></i> Experiências</h2>`;
    html += `<div class="grid grid-3">`;
    html += experienciasRes.map(e => `
      <a href="detalhe.html?tipo=experience&id=${e.id}" class="card card-clickable fade-in visible experience-card" style="display:block">
        <div class="card-img-wrap">
          <img class="card-img" src="${e.banner || e.imagem || ''}" alt="${e.titulo}" loading="lazy">
          <span class="experience-badge">${e.categoria}</span>
        </div>
        <div class="card-body">
          <div class="hotel-meta">
            <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${e.cidade}</span>
            <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${e.avaliacao}</span>
          </div>
          <h3>${e.titulo}</h3>
          <p>${e.descricaoCurta || e.descricao || ''}</p>
          <div class="hotel-footer" style="margin-top:12px;">
            <span class="hotel-price">${e.precoFormatado || `R$ ${e.precoMin}`}</span>
          </div>
        </div>
      </a>
    `).join('');
    html += `</div>`;
  }

  if (total === 0) {
    html = `
      <div class="empty-state fade-in visible">
        <i class="fa-solid fa-face-frown-open"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Não encontramos nada com esses filtros. Tente remover algumas tags ou aumentar o preço.</p>
      </div>
    `;
  }

  container.innerHTML = html;

  // Atualizar Chips de Resumo
  const summary = document.getElementById('adv-results-summary');
  if (summary) {
    summary.innerHTML = `
      <span class="summary-chip total">Todos (${total})</span>
      <span class="summary-chip">Cidades (${cidadesRes.length})</span>
      <span class="summary-chip">Hotéis (${hoteisRes.length})</span>
      <span class="summary-chip">Restaurantes (${restaurantesRes.length})</span>
      <span class="summary-chip">Passeios (${passeiosRes.length})</span>
      <span class="summary-chip">Experiências (${experienciasRes.length})</span>
    `;
  }

  const meta = document.getElementById('adv-results-meta');
  if (meta) {
    meta.textContent = `${total} resultados encontrados`;
  }
}

// ========================
// MENU DE PERFIL (NAVBAR)
// ========================

function initProfileMenu() {
  const trigger = document.getElementById('profile-trigger');
  const menu = document.getElementById('profile-menu');
  const dropdown = document.getElementById('profile-dropdown');
  const avatar = document.getElementById('profile-avatar');
  const nameEl = document.getElementById('profile-name');

  if (!trigger || !menu || !dropdown) return;

  // Atualizar estado inicial
  updateProfileUI();

  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(menu.classList.contains('open')));
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });
}

// ========================
// CARROSSEL DE FOTOS NA PÁGINA DE DETALHE
// ========================

let slideAtual = 0;
let totalSlides = 0;

function navegarCarrosselDetalhe(direcao) {
  const track = document.getElementById('carrossel-track');
  if (!track) return;

  const slides = track.querySelectorAll('.detail-carrossel-slide');
  totalSlides = slides.length;
  if (totalSlides === 0) return;

  slideAtual = (slideAtual + direcao + totalSlides) % totalSlides;
  atualizarCarrossel(track, slides);
}

function irParaSlideDetalhe(index) {
  const track = document.getElementById('carrossel-track');
  if (!track) return;

  const slides = track.querySelectorAll('.detail-carrossel-slide');
  totalSlides = slides.length;
  if (totalSlides === 0) return;

  slideAtual = index;
  atualizarCarrossel(track, slides);
}

function atualizarCarrossel(track, slides) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === slideAtual);
  });

  const dots = track.closest('.detail-carrossel')?.querySelectorAll('.carrossel-dot');
  dots?.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideAtual);
  });

  const counter = track.closest('.detail-carrossel')?.querySelector('.carrossel-counter');
  if (counter) {
    counter.textContent = `${slideAtual + 1} / ${totalSlides}`;
  }
}

// ========================
// MODAL DE CARDÁPIO
// ========================

function mostrarCardapio(id) {
  const restaurante = RESTAURANTES.find(r => r.id === id);
  if (!restaurante || !restaurante.cardapio || restaurante.cardapio.length === 0) return;

  const modal = document.createElement('div');
  modal.className = 'modal-cardapio';
  modal.innerHTML = `
    <div class="modal-cardapio-content">
      <div class="modal-cardapio-header">
        <h3>${restaurante.nome} - Cardápio</h3>
        <button class="modal-close" onclick="fecharCardapio()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-cardapio-body">
        ${restaurante.cardapio.map(item => `
          <div class="cardapio-item">
            ${item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" loading="lazy">` : ''}
            <div class="cardapio-item-info">
              <h4>${item.nome}</h4>
              <span class="cardapio-item-preco">${item.preco}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  setTimeout(() => modal.classList.add('open'), 10);
}

function fecharCardapio() {
  const modal = document.querySelector('.modal-cardapio');
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Fechar modal ao clicar fora
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-cardapio')) {
    fecharCardapio();
  }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    fecharCardapio();
  }
});

// ========================
// VER MAIS - EXPANDIR SEÇÕES
// ========================

function verMais(secao) {
  secaoEstado[secao].limite = Infinity;
  switch (secao) {
    case 'destinos': renderDestinos(); break;
    case 'hoteis': renderHoteis(); break;
    case 'restaurantes': renderRestaurantes(); break;
    case 'passeios': renderPasseios(); break;
  }
  // Esconder botão após expandir
  const btn = document.querySelector(`.btn-ver-mais[data-secao="${secao}"]`);
  if (btn) btn.style.display = 'none';
  iniciarObserver();
}

// ========================
// FILTRO POR SEÇÃO (BUSCA EM TEMPO REAL)
// ========================

function filtrarSecao(secao, termo) {
  const t = termo.toLowerCase().trim();
  let dados;

  switch (secao) {
    case 'destinos':
      dados = t ? CIDADES.filter(c =>
        c.nome.toLowerCase().includes(t) ||
        c.regiao.toLowerCase().includes(t) ||
        c.descricao.toLowerCase().includes(t)
      ) : CIDADES;
      secaoEstado.destinos.limite = 8;
      renderDestinos(dados);
      break;
    case 'hoteis':
      dados = t ? HOTEIS.filter(h =>
        h.nome.toLowerCase().includes(t) ||
        h.cidade.toLowerCase().includes(t) ||
        h.descricao.toLowerCase().includes(t) ||
        (h.servicos || []).some(s => s.toLowerCase().includes(t))
      ) : HOTEIS;
      secaoEstado.hoteis.limite = 8;
      renderHoteis(dados);
      break;
    case 'restaurantes':
      dados = t ? RESTAURANTES.filter(r =>
        r.nome.toLowerCase().includes(t) ||
        r.cidade.toLowerCase().includes(t) ||
        r.culinaria.toLowerCase().includes(t) ||
        (r.descricao || '').toLowerCase().includes(t)
      ) : RESTAURANTES;
      secaoEstado.restaurantes.limite = 8;
      renderRestaurantes(dados);
      break;
    case 'passeios':
      dados = t ? PASSEIOS.filter(p =>
        p.nome.toLowerCase().includes(t) ||
        p.cidade.toLowerCase().includes(t) ||
        p.descricao.toLowerCase().includes(t)
      ) : PASSEIOS;
      secaoEstado.passeios.limite = 8;
      renderPasseios(dados);
      break;
  }

  // Atualizar botão ver mais
  const btn = document.querySelector(`.btn-ver-mais[data-secao="${secao}"]`);
  if (btn) {
    const total = secaoEstado[secao].total;
    if (total > 8 && !t) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  }

  iniciarObserver();
}

function updateProfileUI() {
  const avatar = document.getElementById('profile-avatar');
  const nameEl = document.getElementById('profile-name');
  const dropdown = document.getElementById('profile-dropdown');

  if (!avatar || !nameEl || !dropdown) return;

  if (currentUser) {
    // Usuário logado
    const photo = getUserPhoto();
    avatar.innerHTML = photo
      ? `<img src="${photo}" alt="Perfil">`
      : `<i class="fa-solid fa-user"></i>`;
    nameEl.textContent = currentUser.nome;

    dropdown.innerHTML = `
      <div class="profile-dropdown-header">
        <strong>${currentUser.nome}</strong>
        <p>${currentUser.email}</p>
      </div>
      <div class="profile-dropdown-actions">
        <a href="minha-lista.html">
          <i class="fa-solid fa-user"></i> Meu perfil
        </a>
        <a href="minha-lista.html#favoritos">
          <i class="fa-solid fa-heart"></i> Favoritos
        </a>
        <a href="minha-lista.html#quero-conhecer">
          <i class="fa-solid fa-star"></i> Quero conhecer
        </a>
        <button onclick="logoutUsuario()" class="logout-btn">
          <i class="fa-solid fa-right-from-bracket"></i> Sair da conta
        </button>
      </div>
    `;
  } else {
    // Usuário não logado
    avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
    nameEl.textContent = 'Entrar';

    dropdown.innerHTML = `
      <div class="profile-dropdown-header">
        <strong>Bem-vindo!</strong>
        <p>Entre ou crie uma conta</p>
      </div>
      <div class="profile-dropdown-actions">
        <a href="login.html">
          <i class="fa-solid fa-right-to-bracket"></i> Fazer login
        </a>
        <a href="cadastro.html">
          <i class="fa-solid fa-user-plus"></i> Criar conta
        </a>
      </div>
    `;
  }
}

// ========================
// CADASTRO MODERNO
// ========================

(() => {
  if (!window.location.pathname.includes('cadastro.html')) return;

  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  ready(() => {
    const el = {
      modeButtons: document.querySelectorAll('.wizard-mode__btn'),
      userForm: document.getElementById('wizard-user-form'),
      companyForm: document.getElementById('wizard-company-form'),
      stepper: document.getElementById('wizard-stepper'),
      progressFill: document.getElementById('wizard-progress-fill'),
      alert: document.getElementById('wizard-alert'),
      wizardTitle: document.getElementById('wizard-title'),
      wizardSubtitle: document.getElementById('wizard-subtitle'),
      previewTitle: document.getElementById('preview-title'),
      previewSubtitle: document.getElementById('preview-subtitle'),
      previewFlowStatus: document.getElementById('preview-flow-status'),
      previewNextStep: document.getElementById('preview-next-step'),
      userPreviewCard: document.getElementById('user-preview-card'),
      companyPreviewCard: document.getElementById('company-preview-card'),
      userPreviewAvatar: document.getElementById('user-preview-avatar'),
      userPreviewFullname: document.getElementById('user-preview-fullname'),
      userPreviewLocation: document.getElementById('user-preview-location'),
      userPreviewTags: document.getElementById('user-preview-tags'),
      userPreviewName: document.getElementById('user-preview-name'),
      userPhotoPreview: document.getElementById('user-photo-preview'),
      userReviewSummary: document.getElementById('user-review-summary'),
      companyCategories: document.getElementById('company-categories'),
      companyTags: document.getElementById('company-tags'),
      companyServices: document.getElementById('company-services'),
      companyPreviewImage: document.getElementById('company-preview-image'),
      companyPreviewCategory: document.getElementById('company-preview-category'),
      companyPreviewName: document.getElementById('company-preview-name'),
      companyPreviewCity: document.getElementById('company-preview-city'),
      companyPreviewTags: document.getElementById('company-preview-tags'),
      companyPreviewPrice: document.getElementById('company-preview-price'),
      companyPreviewDesc: document.getElementById('company-preview-desc'),
      companyPreviewPhone: document.getElementById('company-preview-phone'),
      companyPreviewHours: document.getElementById('company-preview-hours'),
      companyJsonPreview: document.getElementById('company-json-preview'),
      companyMapPreview: document.getElementById('company-map-preview'),
      companyMapPreviewCopy: document.getElementById('company-map-preview-copy'),
      successModal: document.getElementById('success-modal'),
      successText: document.getElementById('success-text'),
      successClose: document.getElementById('success-close'),
      toastRoot: document.getElementById('toast-root'),
      companyMenuModePanel: document.getElementById('restaurant-menu-mode-panel'),
      companyMenuPhotos: document.getElementById('restaurant-menu-photos'),
      companyMenuManual: document.getElementById('restaurant-menu-manual'),
      companyMenuCategories: document.getElementById('company-menu-categories'),
      companyMenuItems: document.getElementById('company-menu-items'),
      companyMenuAddCategory: document.getElementById('company-menu-add-category'),
      companyCopyJson: document.getElementById('company-copy-json'),
      companyGalleryList: document.getElementById('company-gallery-list'),
      companyMenuGallery: document.getElementById('company-menu-gallery'),
    };

    const CITY_OPTIONS = Array.from(new Set((window.CIDADES || []).map((cidade) => cidade.nome))).sort((a, b) =>
      a.localeCompare(b, 'pt-BR')
    );

    const STATES = ['CE'];

    const USER_INTERESTS = ['Praia', 'Ecoturismo', 'Gastronomia', 'Aventura', 'História', 'Religioso', 'Natureza'];
    const USER_FAVORITES = CITY_OPTIONS.slice(0, 8);
    const COMPANY_TAGS = ['Praia', 'Família', 'Casal', 'Pet Friendly', 'Luxo', 'Aventura', 'Piscina', 'Wi-Fi', 'Romântico', 'Acessível'];
    const COMPANY_CATEGORIES = [
      { slug: 'hotel', label: 'Hotel', icon: 'fa-bed', type: 'hotel' },
      { slug: 'pousada', label: 'Pousada', icon: 'fa-house', type: 'hotel' },
      { slug: 'restaurante', label: 'Restaurante', icon: 'fa-utensils', type: 'restaurante' },
      { slug: 'bar', label: 'Bar', icon: 'fa-martini-glass', type: 'restaurante' },
      { slug: 'cafeteria', label: 'Cafeteria', icon: 'fa-mug-hot', type: 'restaurante' },
      { slug: 'praia', label: 'Praia', icon: 'fa-water', type: 'atrativo' },
      { slug: 'parque', label: 'Parque', icon: 'fa-tree', type: 'atrativo' },
      { slug: 'passeio', label: 'Passeio', icon: 'fa-route', type: 'atrativo' },
      { slug: 'agencia', label: 'Agência', icon: 'fa-compass', type: 'atrativo' },
      { slug: 'museu', label: 'Museu', icon: 'fa-landmark', type: 'atrativo' },
      { slug: 'atrativo', label: 'Atrativo Turístico', icon: 'fa-location-dot', type: 'atrativo' },
      { slug: 'evento', label: 'Evento', icon: 'fa-ticket', type: 'atrativo' },
      { slug: 'outro', label: 'Outro', icon: 'fa-ellipsis', type: 'atrativo' },
    ];

    const SERVICE_MAP = {
      hotel: ['Wi-Fi', 'Piscina', 'Estacionamento', 'Academia', 'Café da manhã', 'Ar-condicionado', 'Pet Friendly', 'Acessibilidade', 'Restaurante', 'Spa', 'Recepção 24h'],
      pousada: ['Wi-Fi', 'Piscina', 'Estacionamento', 'Café da manhã', 'Ar-condicionado', 'Pet Friendly', 'Acessibilidade', 'Recepção 24h'],
      restaurante: ['Delivery', 'Retirada', 'Ar-condicionado', 'Área Kids', 'Música ao vivo', 'Estacionamento', 'Wi-Fi', 'Aceita cartões', 'Reserva'],
      bar: ['Música ao vivo', 'Wi-Fi', 'Estacionamento', 'Reserva', 'Aceita cartões', 'Pet Friendly'],
      cafeteria: ['Wi-Fi', 'Ar-condicionado', 'Aceita cartões', 'Área externa', 'Pet Friendly', 'Acessibilidade'],
      praia: ['Banheiros', 'Estacionamento', 'Barracas', 'Acessibilidade', 'Salva-vidas', 'Quiosques'],
      parque: ['Banheiros', 'Estacionamento', 'Acessibilidade', 'Trilhas', 'Guia', 'Área verde'],
      passeio: ['Guiado', 'Aventura', 'Traslado', 'Ingressos', 'Acessibilidade', 'Grupo'],
      agencia: ['Pacotes', 'Guiado', 'Traslado', 'Suporte', 'Reserva', 'Parcelamento'],
      museu: ['Guia', 'Acessibilidade', 'Exposição', 'Loja', 'Café', 'Agendamento'],
      atrativo: ['Acessibilidade', 'Guia', 'Estacionamento', 'Banheiros', 'Fotos', 'Ingressos'],
      evento: ['Ingressos', 'Palco', 'Food truck', 'Área kids', 'Acessibilidade', 'Estacionamento'],
      outro: ['Wi-Fi', 'Estacionamento', 'Acessibilidade', 'Reserva', 'Aceita cartões', 'Pet Friendly'],
    };

    const MENU_DEFAULT_CATEGORIES = ['Entradas', 'Pratos principais', 'Sobremesas', 'Bebidas'];

    const state = {
      mode: 'usuario',
      userStep: 0,
      companyStep: 0,
      userPhoto: '',
      companyMainImage: '',
      companyGallery: [],
      companyMenuPhotos: [],
      companyMenuMode: 'photos',
      companyMenuCategories: [...MENU_DEFAULT_CATEGORIES],
      companyMenuItems: [],
      userInterests: new Set(),
      userFavorites: new Set(),
      companyTags: new Set(),
      companyServices: new Set(),
      companyCategory: '',
      companyCategoryLabel: '',
      companyCategoryType: '',
    };

    function toast(message, type = 'info') {
      const node = document.createElement('div');
      node.className = `toast toast--${type}`;
      node.textContent = message;
      el.toastRoot.appendChild(node);
      requestAnimationFrame(() => node.classList.add('visible'));
      setTimeout(() => {
        node.classList.remove('visible');
        setTimeout(() => node.remove(), 220);
      }, 2600);
    }

    function setAlert(message = '', type = '') {
      if (!el.alert) return;
      el.alert.textContent = message;
      el.alert.className = `wizard-alert ${type ? `wizard-alert--${type}` : ''}`.trim();
    }

    function setStateOnlyCeara(select) {
      if (!select) return;
      select.innerHTML = '<option value="CE">CE</option>';
      select.value = 'CE';
      select.disabled = true;
    }

    function fillCities(select) {
      if (!select) return;
      select.innerHTML = '<option value="">Selecione</option>' + CITY_OPTIONS.map((cidade) => `<option value="${cidade}">${cidade}</option>`).join('');
    }

    function renderChips(container, options, selectedSet) {
      if (!container) return;
      container.innerHTML = options.map((item) => {
        const value = typeof item === 'string' ? item : item.label;
        const active = selectedSet.has(value);
        const icon = item.icon ? `<i class="fa-solid ${item.icon}"></i>` : '';
        return `
          <button type="button" class="chip-toggle ${active ? 'active' : ''}" data-value="${value}">
            ${icon}
            <span>${value}</span>
          </button>
        `;
      }).join('');
    }

    function getCompanySteps() {
      const steps = [
        { key: 'category', label: 'Categoria' },
        { key: 'basic', label: 'Básicas' },
        { key: 'location', label: 'Localização' },
        { key: 'contact', label: 'Contato' },
        { key: 'media', label: 'Fotos' },
        { key: 'services', label: 'Serviços' },
      ];

      if (state.companyCategory === 'restaurante') {
        steps.push({ key: 'menu', label: 'Cardápio' });
      }

      steps.push({ key: 'review', label: 'Revisão' });
      return steps;
    }

    function getUserSteps() {
      return [
        { key: 'basic', label: 'Básicas' },
        { key: 'location', label: 'Localização' },
        { key: 'interests', label: 'Interesses' },
        { key: 'security', label: 'Segurança' },
        { key: 'review', label: 'Revisão' },
      ];
    }

    function currentSteps() {
      return state.mode === 'usuario' ? getUserSteps() : getCompanySteps();
    }

    function currentIndex() {
      return state.mode === 'usuario' ? state.userStep : state.companyStep;
    }

    function setCurrentIndex(index) {
      if (state.mode === 'usuario') {
        state.userStep = index;
      } else {
        state.companyStep = index;
      }
      renderWizard();
    }

    function setMode(mode) {
      state.mode = mode;
      document.querySelectorAll('.wizard-mode__btn').forEach((btn) => {
        const active = btn.dataset.mode === mode;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      el.userForm.classList.toggle('active', mode === 'usuario');
      el.companyForm.classList.toggle('active', mode === 'empresa');
      el.previewTitle.textContent = mode === 'usuario' ? 'Como seu perfil vai aparecer' : 'Como sua empresa vai aparecer';
      el.previewSubtitle.textContent = mode === 'usuario'
        ? 'Complete os campos e veja a prévia do seu perfil em tempo real.'
        : 'A prévia do card é atualizada enquanto você monta sua página.';
      el.previewFlowStatus.textContent = mode === 'usuario' ? 'Usuário' : 'Empresa';
      document.getElementById('user-preview-card').classList.toggle('hidden', mode !== 'usuario');
      document.getElementById('company-preview-card').classList.toggle('hidden', mode !== 'empresa');
      renderWizard();
      renderPreview();
    }

    function renderWizard() {
      const steps = currentSteps();
      const index = Math.min(currentIndex(), steps.length - 1);
      const form = state.mode === 'usuario' ? el.userForm : el.companyForm;
      const stepNodes = form.querySelectorAll('.wizard-step');
      stepNodes.forEach((node) => node.classList.remove('active'));

      const activeStep = steps[index];
      const activeNode = form.querySelector(`.wizard-step[data-step-key="${activeStep.key}"]`);
      if (activeNode) activeNode.classList.add('active');

      el.stepper.innerHTML = steps.map((step, i) => `
        <li class="${i < index ? 'done' : ''} ${i === index ? 'active' : ''}">
          <span>${i + 1}</span>
          <strong>${step.label}</strong>
        </li>
      `).join('');

      const fill = steps.length <= 1 ? 100 : (index / (steps.length - 1)) * 100;
      el.progressFill.style.width = `${fill}%`;

      const backBtn = form.querySelector('.wizard-back');
      const nextBtn = form.querySelector('.wizard-next');
      const submitBtn = form.querySelector('.wizard-submit');
      if (backBtn) backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
      if (nextBtn) nextBtn.classList.toggle('hidden', index >= steps.length - 1);
      if (submitBtn) submitBtn.classList.toggle('hidden', index < steps.length - 1);

      el.previewNextStep.textContent = steps[index + 1] ? steps[index + 1].label : 'Pronto para enviar';
      updateFooterTexts();
    }

    function updateFooterTexts() {
      if (state.mode === 'usuario') {
        el.wizardTitle.textContent = 'Criar conta';
        el.wizardSubtitle.textContent = 'Vamos montar seu perfil com cuidado, passo a passo.';
      } else {
        el.wizardTitle.textContent = 'Cadastrar empresa';
        el.wizardSubtitle.textContent = 'Escolha a categoria e complete apenas o que faz sentido para o seu negócio.';
      }
    }

    function setFieldMessage(id, message) {
      const field = document.querySelector(`[data-for="${id}"]`);
      if (field) field.textContent = message || '';
      const input = document.getElementById(id);
      if (input) {
        const wrapper = input.closest('.field') || input.closest('.wizard-step');
        if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
      }
    }

    function clearStepErrors(form) {
      form.querySelectorAll('[data-for]').forEach((node) => (node.textContent = ''));
      form.querySelectorAll('.has-error').forEach((node) => node.classList.remove('has-error'));
    }

    function showPreviewPulse(node) {
      if (!node) return;
      node.classList.remove('pulse');
      void node.offsetWidth;
      node.classList.add('pulse');
    }

    function photoToImage(src) {
      return src || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop';
    }

    function formatMoney(value) {
      const num = Number(value || 0);
      if (!num) return 'R$ 0';
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(num);
    }

    function formatRange(min, max) {
      const a = Number(min || 0);
      const b = Number(max || 0);
      if (!a && !b) return 'R$ 0';
      if (a && b) return `${formatMoney(a)} — ${formatMoney(b)}`;
      return formatMoney(a || b);
    }

    function userPhotoValue() {
      return state.userPhoto || '';
    }

    function renderUserPhotoPreview() {
      const src = userPhotoValue();
      if (src) {
        el.userPhotoPreview.innerHTML = `<img src="${src}" alt="Foto de perfil">`;
        el.userPreviewAvatar.innerHTML = `<img src="${src}" alt="Foto de perfil">`;
      } else {
        el.userPhotoPreview.innerHTML = '<i class="fa-solid fa-user"></i>';
        el.userPreviewAvatar.innerHTML = '<i class="fa-solid fa-user"></i>';
      }
    }

    function updatePasswordStrength() {
      const value = document.getElementById('user-senha').value;
      const bar = document.getElementById('user-strength-bar');
      const text = document.getElementById('user-strength-text');
      const score = [
        value.length >= 8,
        /[A-ZÁÀÂÃÉÈÍÏÓÔÕÖÚÇ]/.test(value) || /[a-záàâãéèíïóôõöúç]/.test(value),
        /\d/.test(value),
        /[^A-Za-z0-9]/.test(value),
      ].filter(Boolean).length;

      const labels = ['Fraca', 'Básica', 'Boa', 'Forte', 'Muito forte'];
      const widths = ['10%', '30%', '55%', '80%', '100%'];
      const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#22c55e', '#16a34a'];
      const index = Math.min(score, 4);
      bar.style.width = widths[index];
      bar.style.background = colors[index];
      text.textContent = `Força da senha: ${labels[index]}`;
    }

    function renderUserPreview() {
      const fullName = `${document.getElementById('user-nome').value || 'Seu nome'} ${document.getElementById('user-sobrenome').value || 'completo'}`.trim();
      const city = document.getElementById('user-cidade').value || 'Cidade';
      const stateValue = document.getElementById('user-estado').value || 'CE';

      el.userPreviewFullname.textContent = fullName;
      el.userPreviewLocation.textContent = `${city}, ${stateValue}`;
      el.userPreviewName.textContent = fullName;
      renderUserPhotoPreview();

      const interests = Array.from(state.userInterests).slice(0, 4).map((item) => `<span>${item}</span>`).join('');
      const favorites = Array.from(state.userFavorites).slice(0, 2).map((item) => `<span>${item}</span>`).join('');
      el.userPreviewTags.innerHTML = interests || favorites || '<span>Praia</span><span>Gastronomia</span>';

      const summary = [
        ['Nome', fullName],
        ['E-mail', document.getElementById('user-email').value || 'não informado'],
        ['Telefone', document.getElementById('user-telefone').value || 'não informado'],
        ['Cidade', `${city}, ${stateValue}`],
        ['Interesses', Array.from(state.userInterests).join(', ') || 'Nenhum selecionado'],
        ['Favoritos iniciais', Array.from(state.userFavorites).join(', ') || 'Nenhum selecionado'],
      ];

      el.userReviewSummary.innerHTML = summary.map(([label, value]) => `
        <div class="review-summary__item">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `).join('');
    }

    function renderCompanyCategoryCards() {
      el.companyCategories.innerHTML = COMPANY_CATEGORIES.map((cat) => `
        <button type="button" class="category-card ${state.companyCategory === cat.slug ? 'active' : ''}" data-category="${cat.slug}">
          <i class="fa-solid ${cat.icon}"></i>
          <strong>${cat.label}</strong>
        </button>
      `).join('');
    }

    function getCompanyServiceList() {
      return SERVICE_MAP[state.companyCategory] || SERVICE_MAP.outro;
    }

    function renderCompanyServices() {
      const services = getCompanyServiceList();
      el.companyServices.innerHTML = services.map((service) => `
        <button type="button" class="chip-toggle ${state.companyServices.has(service) ? 'active' : ''}" data-service="${service}">
          <span>${service}</span>
        </button>
      `).join('');
      document.getElementById('company-services-title').textContent = state.companyCategory === 'restaurante'
        ? 'Serviços e diferenciais'
        : 'Serviços do estabelecimento';
      document.getElementById('company-services-helper').textContent = state.companyCategory === 'restaurante'
        ? 'Marque o que o cliente realmente encontra no local'
        : 'Escolha os serviços que ajudam sua empresa a se destacar';
    }

    function renderCompanyMenuCategoryChips() {
      if (!el.companyMenuCategories) return;
      el.companyMenuCategories.innerHTML = state.companyMenuCategories.map((cat, index) => `
        <button type="button" class="chip-toggle active" data-menu-category="${index}">
          <span>${cat}</span>
          ${state.companyMenuCategories.length > 1 ? '<i class="fa-solid fa-xmark"></i>' : ''}
        </button>
      `).join('');
    }

    function renderCompanyMenuItems() {
      if (!el.companyMenuItems) return;
      const categories = state.companyMenuCategories.length ? state.companyMenuCategories : MENU_DEFAULT_CATEGORIES;
      const itemsHtml = state.companyMenuItems.map((item, index) => `
        <article class="menu-item-card">
          <div class="menu-item-card__top">
            <strong>Item ${index + 1}</strong>
            <button type="button" class="icon-btn" data-remove-menu-item="${index}" title="Remover item">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div class="wizard-grid wizard-grid--2">
            <div class="field">
              <label>Categoria</label>
              <select data-menu-field="categoria" data-index="${index}">
                ${categories.map((cat) => `<option value="${cat}" ${item.categoria === cat ? 'selected' : ''}>${cat}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label>Preço</label>
              <input type="text" data-menu-field="preco" data-index="${index}" value="${item.preco || ''}" placeholder="R$ 35,90">
            </div>
          </div>
          <div class="field">
            <label>Nome</label>
            <input type="text" data-menu-field="nome" data-index="${index}" value="${item.nome || ''}" placeholder="Nome do prato">
          </div>
          <div class="field">
            <label>Descrição</label>
            <textarea rows="3" data-menu-field="descricao" data-index="${index}" placeholder="Ingredientes, destaque ou observações">${item.descricao || ''}</textarea>
          </div>
          <div class="wizard-grid wizard-grid--2">
            <div class="field">
              <label>Imagem <span class="field-optional">(opcional)</span></label>
              <input type="url" data-menu-field="imagem" data-index="${index}" value="${item.imagem || ''}" placeholder="https://exemplo.com/item.jpg">
            </div>
            <label class="terms-box terms-box--inline">
              <input type="checkbox" data-menu-field="disponivel" data-index="${index}" ${item.disponivel !== false ? 'checked' : ''}>
              <span>Disponível</span>
            </label>
          </div>
        </article>
      `).join('');

      el.companyMenuItems.innerHTML = `
        ${itemsHtml || '<div class="empty-inline">Nenhum item ainda. Use “Adicionar item” para começar.</div>'}
        <button type="button" class="btn-secondary btn-secondary--full" id="company-menu-add-item">Adicionar item</button>
      `;
    }

    function renderGallery(list, target) {
      if (!target) return;
      target.innerHTML = list.map((src, index) => `
        <article class="media-thumb">
          <img src="${src}" alt="Foto ${index + 1}">
          <div class="media-thumb__actions">
            <button type="button" class="icon-btn" data-main-image="${index}" title="Imagem principal">
              <i class="fa-solid fa-star"></i>
            </button>
            <button type="button" class="icon-btn" data-move-left="${index}" title="Mover para a esquerda">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <button type="button" class="icon-btn" data-move-right="${index}" title="Mover para a direita">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button type="button" class="icon-btn" data-remove-image="${index}" title="Remover">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </article>
      `).join('') || '<div class="empty-inline">Sem imagens ainda.</div>';
    }

    function renderCompanyPreview() {
      const city = document.getElementById('company-cidade').value || 'Cidade';
      const stateValue = document.getElementById('company-estado').value || 'CE';
      const name = document.getElementById('company-nome').value || 'Nome do estabelecimento';
      const desc = document.getElementById('company-descricao').value || 'Sua descrição aparecerá aqui com um recorte elegante e convidativo.';
      const phone = document.getElementById('company-telefone').value || 'Telefone';
      const hours = document.getElementById('company-horario').value || 'Horário';
      const price = formatRange(document.getElementById('company-preco-min').value, document.getElementById('company-preco-max').value);
      const tags = Array.from(state.companyTags).slice(0, 4);
      const serviceTags = Array.from(state.companyServices).slice(0, 4);
      const previewTags = tags.length ? tags : serviceTags;

      el.companyPreviewImage.src = photoToImage(state.companyMainImage || state.companyGallery[0] || '');
      el.companyPreviewCategory.textContent = state.companyCategoryLabel || 'Categoria';
      el.companyPreviewName.textContent = name;
      el.companyPreviewCity.textContent = `${city}, ${stateValue}`;
      el.companyPreviewPrice.textContent = price;
      el.companyPreviewDesc.textContent = desc;
      el.companyPreviewPhone.textContent = phone;
      el.companyPreviewHours.textContent = hours;
      el.companyPreviewTags.innerHTML = previewTags.length
        ? previewTags.map((tag) => `<span>${tag}</span>`).join('')
        : '<span>Tags</span><span>Serviços</span>';

      const lat = document.getElementById('company-lat').value.trim();
      const lng = document.getElementById('company-lng').value.trim();
      const mapaId = document.getElementById('company-mapa-id').value.trim();
      if (lat && lng) {
        el.companyMapPreviewCopy.textContent = `Coordenadas prontas: ${lat}, ${lng}`;
      } else if (mapaId) {
        el.companyMapPreviewCopy.textContent = `Mapa vinculado ao ID: ${mapaId}`;
      } else {
        el.companyMapPreviewCopy.textContent = 'Sem coordenadas ainda';
      }

      const previewData = buildCompanyPayload(true);
      if (el.companyJsonPreview) {
        el.companyJsonPreview.textContent = JSON.stringify(previewData, null, 2);
      }
    }

    function renderCompanyMenuVisibility() {
      const isRestaurant = state.companyCategory === 'restaurante';
      document.querySelectorAll('.menu-switch__btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.menuMode === state.companyMenuMode);
      });
      el.companyMenuModePanel.classList.toggle('hidden', !isRestaurant);
      el.companyMenuPhotos.classList.toggle('hidden', !isRestaurant || state.companyMenuMode !== 'photos');
      el.companyMenuManual.classList.toggle('hidden', !isRestaurant || state.companyMenuMode !== 'manual');
    }

    function renderPreview() {
      renderUserPhotoPreview();
      renderUserPreview();
      renderCompanyPreview();
      renderCompanyCategoryCards();
      renderCompanyServices();
      renderCompanyMenuCategoryChips();
      renderCompanyMenuItems();
      renderGallery(state.companyGallery, el.companyGalleryList);
      renderGallery(state.companyMenuPhotos, el.companyMenuGallery);
      renderCompanyMenuVisibility();
      showPreviewPulse(state.mode === 'usuario' ? el.userPreviewCard : el.companyPreviewCard);
      renderWizard();
    }

    function buildUserPayload() {
      const nome = document.getElementById('user-nome').value.trim();
      const sobrenome = document.getElementById('user-sobrenome').value.trim();
      const email = document.getElementById('user-email').value.trim().toLowerCase();
      const telefone = document.getElementById('user-telefone').value.trim();
      const senha = document.getElementById('user-senha').value;
      return {
        nome: `${nome} ${sobrenome}`.trim(),
        sobrenome,
        email,
        senha,
        telefone,
        cidade: document.getElementById('user-cidade').value,
        estado: document.getElementById('user-estado').value || 'CE',
        nascimento: document.getElementById('user-nascimento').value || '',
        fotoPerfil: state.userPhoto || '',
        profilePhoto: state.userPhoto || '',
        interesses: Array.from(state.userInterests),
        favoritosIniciais: Array.from(state.userFavorites),
        termosAceitos: document.getElementById('user-termos').checked,
        tipoViajante: Array.from(state.userInterests)[0] || '',
        favoritosHoteis: [],
        favoritosRestaurantes: [],
        favoritosExperiencias: [],
        queroConhecerHoteis: [],
        queroConhecerRestaurantes: [],
        queroConhecerExperiencias: [],
        visitadosCidades: [],
        visitadosHoteis: [],
        visitadosRestaurantes: [],
        visitadosExperiencias: [],
      };
    }

    function buildCompanyPayload(exactOnly = false) {
      const min = document.getElementById('company-preco-min').value;
      const max = document.getElementById('company-preco-max').value;
      const payload = {
        nome: document.getElementById('company-nome').value.trim(),
        cidade: document.getElementById('company-cidade').value,
        mapaId: document.getElementById('company-mapa-id').value.trim(),
        lat: Number(document.getElementById('company-lat').value) || 0,
        lng: Number(document.getElementById('company-lng').value) || 0,
        site: document.getElementById('company-site').value.trim(),
        instagram: document.getElementById('company-instagram').value.trim(),
        imagem: state.companyMainImage || state.companyGallery[0] || state.companyMenuPhotos[0] || '',
        descricao: document.getElementById('company-descricao').value.trim(),
        tags: Array.from(state.companyTags),
        precoMin: Number(min) || 0,
        precoMax: Number(max) || 0,
        preco: formatRange(min, max),
        avaliacao: 0,
        servicos: Array.from(state.companyServices),
        galeria: [...state.companyGallery],
        cardapio: [],
        telefone: document.getElementById('company-telefone').value.trim(),
        horario: document.getElementById('company-horario').value.trim(),
        categoria: state.companyCategoryLabel || '',
      };

      if (state.companyCategory === 'restaurante') {
        if (state.companyMenuMode === 'photos') {
          payload.cardapio = state.companyMenuPhotos.map((src, index) => ({
            categoria: 'Cardápio',
            nome: `Foto ${index + 1}`,
            descricao: '',
            preco: '',
            imagem: src,
          }));
        } else {
          payload.cardapio = state.companyMenuItems
            .filter((item) => item.nome.trim())
            .map((item) => ({
              categoria: item.categoria || MENU_DEFAULT_CATEGORIES[0],
              nome: item.nome.trim(),
              descricao: item.descricao.trim(),
              preco: item.preco.trim(),
              imagem: item.imagem.trim(),
            }));
        }
      }

      return exactOnly ? payload : {
        ...payload,
        tipo: state.companyCategoryType || 'atrativo',
        id: Date.now(),
        criadoPor: 'empresa',
      };
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateUserStep(step) {
      const nome = document.getElementById('user-nome').value.trim();
      const sobrenome = document.getElementById('user-sobrenome').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const telefone = document.getElementById('user-telefone').value.trim();
      const cidade = document.getElementById('user-cidade').value;
      const estado = document.getElementById('user-estado').value;
      const senha = document.getElementById('user-senha').value;
      const confirmar = document.getElementById('user-confirmar').value;

      clearStepErrors(el.userForm);
      if (step === 0) {
        if (!nome) return setFieldMessage('user-nome', 'Informe seu nome'), false;
        if (!sobrenome) return setFieldMessage('user-sobrenome', 'Informe seu sobrenome'), false;
        if (!email || !validateEmail(email)) return setFieldMessage('user-email', 'Informe um e-mail válido'), false;
        if (!telefone) return setFieldMessage('user-telefone', 'Informe um telefone'), false;
      }
      if (step === 1) {
        if (!cidade) return setFieldMessage('user-cidade', 'Selecione sua cidade'), false;
        if (!estado) return setFieldMessage('user-estado', 'Selecione o estado'), false;
      }
      if (step === 2) {
        if (!state.userInterests.size) {
          setAlert('Escolha pelo menos um interesse turístico.', 'error');
          return false;
        }
      }
      if (step === 3) {
        if (senha.length < 8) return setFieldMessage('user-senha', 'Use pelo menos 8 caracteres'), false;
        if (senha !== confirmar) return setFieldMessage('user-confirmar', 'As senhas não coincidem'), false;
        if (!document.getElementById('user-termos').checked) return setFieldMessage('user-termos', 'Aceite os termos para continuar'), false;
      }
      return true;
    }

    function validateCompanyStep(step) {
      const category = state.companyCategory;
      const nome = document.getElementById('company-nome').value.trim();
      const desc = document.getElementById('company-descricao').value.trim();
      const cidade = document.getElementById('company-cidade').value;
      const estado = document.getElementById('company-estado').value;
      const endereco = document.getElementById('company-endereco').value.trim();
      const cep = document.getElementById('company-cep').value.trim();
      const telefone = document.getElementById('company-telefone').value.trim();
      const horario = document.getElementById('company-horario').value.trim();

      clearStepErrors(el.companyForm);
      if (step === 0 && !category) return setFieldMessage('company-categoria', 'Escolha uma categoria'), false;
      if (step === 1) {
        if (!nome) return setFieldMessage('company-nome', 'Informe o nome'), false;
        if (!desc) return setFieldMessage('company-descricao', 'Conte um pouco sobre o negócio'), false;
      }
      if (step === 2) {
        if (!cidade) return setFieldMessage('company-cidade', 'Selecione a cidade'), false;
        if (!estado) return setFieldMessage('company-estado', 'Selecione o estado'), false;
        if (!endereco) return setFieldMessage('company-endereco', 'Informe o endereço'), false;
        if (!cep) return setFieldMessage('company-cep', 'Informe o CEP'), false;
      }
      if (step === 3) {
        if (!telefone) return setFieldMessage('company-telefone', 'Informe um telefone'), false;
        if (!horario) return setFieldMessage('company-horario', 'Informe o horário de funcionamento'), false;
      }
      if (step === 4) {
        if (!state.companyMainImage && !state.companyGallery.length && !state.companyMenuPhotos.length) {
          setAlert('Adicione pelo menos uma imagem para a empresa.', 'error');
          return false;
        }
      }
      if (step === 5) {
        if (!state.companyServices.size) {
          setAlert('Selecione pelo menos um serviço.', 'error');
          return false;
        }
      }
      if (state.companyCategory === 'restaurante' && getCompanySteps().findIndex((item) => item.key === 'menu') === step) {
        if (state.companyMenuMode === 'photos' && !state.companyMenuPhotos.length) {
          setAlert('Adicione ao menos uma foto do cardápio.', 'error');
          return false;
        }
        if (state.companyMenuMode === 'manual' && !state.companyMenuItems.some((item) => item.nome.trim())) {
          setAlert('Adicione ao menos um item ao cardápio.', 'error');
          return false;
        }
      }
      return true;
    }

    function nextStep() {
      const steps = currentSteps();
      const index = currentIndex();
      const valid = state.mode === 'usuario' ? validateUserStep(index) : validateCompanyStep(index);
      if (!valid) {
        renderPreview();
        return;
      }
      if (index < steps.length - 1) {
        setCurrentIndex(index + 1);
        setAlert('');
      }
    }

    function prevStep() {
      const index = currentIndex();
      if (index > 0) setCurrentIndex(index - 1);
      setAlert('');
    }

    function readFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsDataURL(file);
      });
    }

    async function filesToDataUrls(files) {
      const list = Array.from(files || []);
      const output = [];
      for (const file of list) {
        output.push(await readFile(file));
      }
      return output;
    }

    async function handleImageInput(files, target) {
      const images = await filesToDataUrls(files);
      if (target === 'user') {
        state.userPhoto = images[0] || state.userPhoto;
      } else if (target === 'main') {
        state.companyMainImage = images[0] || state.companyMainImage;
      } else if (target === 'gallery') {
        state.companyGallery.push(...images);
      } else if (target === 'menu-photos') {
        state.companyMenuPhotos.push(...images);
      }
      renderPreview();
    }

    function bindSourceSwitches() {
      document.querySelectorAll('.source-switch').forEach((switcher) => {
        const target = switcher.dataset.target;
        switcher.querySelectorAll('.source-switch__btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            switcher.querySelectorAll('.source-switch__btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const source = btn.dataset.source;
            switcher.parentElement.querySelectorAll('.source-panel').forEach((panel) => {
              panel.classList.toggle('active', panel.dataset.sourcePanel === source);
            });
          });
        });
      });
    }

    function bindEvents() {
      document.querySelectorAll('.wizard-mode__btn').forEach((btn) => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
      });

      document.querySelectorAll('.wizard-next').forEach((btn) => btn.addEventListener('click', nextStep));
      document.querySelectorAll('.wizard-back').forEach((btn) => btn.addEventListener('click', prevStep));

      document.getElementById('user-photo-file').addEventListener('change', (e) => handleImageInput(e.target.files, 'user'));
      document.getElementById('user-photo-link').addEventListener('input', (e) => {
        state.userPhoto = e.target.value.trim();
        renderPreview();
      });

      document.getElementById('company-main-file').addEventListener('change', (e) => handleImageInput(e.target.files, 'main'));
      document.getElementById('company-main-link').addEventListener('input', (e) => {
        state.companyMainImage = e.target.value.trim();
        renderPreview();
      });

      document.getElementById('company-gallery-file').addEventListener('change', (e) => handleImageInput(e.target.files, 'gallery'));
      document.getElementById('company-gallery-add-link').addEventListener('click', async () => {
        const input = document.getElementById('company-gallery-link');
        const value = input.value.trim();
        if (!value) return;
        state.companyGallery.push(value);
        input.value = '';
        renderPreview();
      });

      document.getElementById('company-menu-file').addEventListener('change', (e) => handleImageInput(e.target.files, 'menu-photos'));
      document.getElementById('company-menu-add-link').addEventListener('click', async () => {
        const input = document.getElementById('company-menu-link');
        const value = input.value.trim();
        if (!value) return;
        state.companyMenuPhotos.push(value);
        input.value = '';
        renderPreview();
      });

      document.getElementById('company-menu-add-category').addEventListener('click', () => {
        const value = window.prompt('Nova categoria do cardápio');
        if (!value) return;
        state.companyMenuCategories.push(value.trim());
        renderPreview();
      });

      document.querySelectorAll('.menu-switch__btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.companyMenuMode = btn.dataset.menuMode || 'photos';
          document.querySelectorAll('.menu-switch__btn').forEach((item) => item.classList.toggle('active', item === btn));
          renderPreview();
        });
      });

      el.companyCopyJson.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(JSON.stringify(buildCompanyPayload(true), null, 2));
          toast('JSON copiado para a área de transferência.', 'success');
        } catch {
          toast('Não foi possível copiar o JSON agora.', 'error');
        }
      });

      el.successClose.addEventListener('click', () => {
        hideSuccess();
      });

      el.successModal.addEventListener('click', (e) => {
        if (e.target === el.successModal) hideSuccess();
      });

      document.addEventListener('input', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.id === 'user-senha') updatePasswordStrength();
        if (['user-nome', 'user-sobrenome', 'user-email', 'user-telefone', 'user-cidade', 'user-estado', 'user-nascimento', 'user-senha', 'user-confirmar', 'user-termos'].includes(target.id)) {
          renderPreview();
        }
        if (['company-nome', 'company-descricao', 'company-cidade', 'company-estado', 'company-endereco', 'company-cep', 'company-lat', 'company-lng', 'company-mapa-id', 'company-site', 'company-instagram', 'company-telefone', 'company-horario', 'company-preco-min', 'company-preco-max'].includes(target.id)) {
          renderPreview();
        }
      });

      document.addEventListener('change', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.id === 'user-cidade' || target.id === 'company-cidade') renderPreview();
        if (target.id === 'company-estado') renderPreview();
      });

      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-value], [data-service], [data-category], [data-main-image], [data-move-left], [data-move-right], [data-remove-image], [data-menu-category], [data-remove-menu-item], [data-menu-field], #company-menu-add-item');
        if (!target) return;

        if (target.dataset.value) {
          if (state.mode === 'usuario') {
            const value = target.dataset.value;
            if (currentSteps()[currentIndex()].key === 'interests') {
              if (state.userInterests.has(value)) state.userInterests.delete(value);
              else state.userInterests.add(value);
            } else {
              if (state.userFavorites.has(value)) state.userFavorites.delete(value);
              else state.userFavorites.add(value);
            }
            renderPreview();
          } else if (state.mode === 'empresa' && currentSteps()[currentIndex()].key === 'basic') {
            const value = target.dataset.value;
            if (state.companyTags.has(value)) state.companyTags.delete(value);
            else state.companyTags.add(value);
            renderPreview();
          }
          return;
        }

        if (target.dataset.service) {
          const value = target.dataset.service;
          if (state.companyServices.has(value)) state.companyServices.delete(value);
          else state.companyServices.add(value);
          renderPreview();
          return;
        }

        if (target.dataset.category) {
          const cat = COMPANY_CATEGORIES.find((item) => item.slug === target.dataset.category);
          state.companyCategory = cat.slug;
          state.companyCategoryLabel = cat.label;
          state.companyCategoryType = cat.type;
          state.companyStep = 0;
          state.companyServices.clear();
          if (cat.slug !== 'restaurante') {
            state.companyMenuMode = 'photos';
          }
          renderPreview();
          return;
        }

        if (target.id === 'company-menu-add-item') {
          state.companyMenuItems.push({
            categoria: state.companyMenuCategories[0] || MENU_DEFAULT_CATEGORIES[0],
            nome: '',
            descricao: '',
            preco: '',
            imagem: '',
            disponivel: true,
          });
          renderPreview();
          return;
        }

        if (target.dataset.mainImage !== undefined) {
          const index = Number(target.dataset.mainImage);
          state.companyMainImage = state.companyGallery[index] || state.companyMainImage;
          renderPreview();
          return;
        }

        if (target.dataset.moveLeft !== undefined) {
          const index = Number(target.dataset.moveLeft);
          if (index > 0) {
            const list = state.companyGallery;
            [list[index - 1], list[index]] = [list[index], list[index - 1]];
            renderPreview();
          }
          return;
        }

        if (target.dataset.moveRight !== undefined) {
          const index = Number(target.dataset.moveRight);
          const list = state.companyGallery;
          if (index < list.length - 1) {
            [list[index + 1], list[index]] = [list[index], list[index + 1]];
            renderPreview();
          }
          return;
        }

        if (target.dataset.removeImage !== undefined) {
          const index = Number(target.dataset.removeImage);
          const removed = state.companyGallery.splice(index, 1);
          if (removed[0] && removed[0] === state.companyMainImage) state.companyMainImage = state.companyGallery[0] || '';
          renderPreview();
          return;
        }

        if (target.dataset.menuCategory !== undefined) {
          const index = Number(target.dataset.menuCategory);
          if (state.companyMenuCategories.length <= 1) return;
          state.companyMenuCategories.splice(index, 1);
          state.companyMenuItems = state.companyMenuItems.map((item) => ({
            ...item,
            categoria: state.companyMenuCategories.includes(item.categoria) ? item.categoria : (state.companyMenuCategories[0] || MENU_DEFAULT_CATEGORIES[0]),
          }));
          renderPreview();
          return;
        }

        if (target.dataset.removeMenuItem !== undefined) {
          const index = Number(target.dataset.removeMenuItem);
          state.companyMenuItems.splice(index, 1);
          renderPreview();
          return;
        }
      });

      document.addEventListener('input', (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.matches('[data-menu-field]')) {
          const index = Number(target.dataset.index);
          const field = target.dataset.menuField;
          if (!state.companyMenuItems[index]) return;
          if (target.type === 'checkbox') {
            state.companyMenuItems[index][field] = target.checked;
          } else {
            state.companyMenuItems[index][field] = target.value;
          }
          renderPreview();
        }
      });
    }

    function showSuccess(message) {
      el.successText.textContent = message;
      el.successModal.classList.add('open');
      el.successModal.setAttribute('aria-hidden', 'false');
    }

    function hideSuccess() {
      el.successModal.classList.remove('open');
      el.successModal.setAttribute('aria-hidden', 'true');
    }

    function saveUser(user) {
      if (usuariosDB.some((item) => item.email === user.email)) {
        toast('Este e-mail já está cadastrado.', 'error');
        return false;
      }
      usuariosDB.push(user);
      localStorage.setItem('turistando_users', JSON.stringify(usuariosDB));
      localStorage.setItem('turistando_currentUser', JSON.stringify(user));
      currentUser = user;
      return true;
    }

    function saveCompany(company) {
      const empresas = JSON.parse(localStorage.getItem('turistando_empresas') || '[]');
      empresas.push(company);
      localStorage.setItem('turistando_empresas', JSON.stringify(empresas));
      return true;
    }

    function onUserSubmit(e) {
      e.preventDefault();
      const step = currentIndex();
      if (!validateUserStep(step)) return;
      if (step < getUserSteps().length - 1) return;
      const data = buildUserPayload();
      if (saveUser(data)) {
        showSuccess('Sua conta foi criada com sucesso. Você já pode explorar o Turistando.');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1300);
      }
    }

    function onCompanySubmit(e) {
      e.preventDefault();
      const step = currentIndex();
      if (!validateCompanyStep(step)) return;
      if (step < getCompanySteps().length - 1) return;
      const data = buildCompanyPayload();
      if (saveCompany(data)) {
        showSuccess('Sua empresa foi cadastrada com sucesso. Ela já foi salva no Turistando.');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1300);
      }
    }

    function init() {
      fillCities(document.getElementById('user-cidade'));
      fillCities(document.getElementById('company-cidade'));
      setStateOnlyCeara(document.getElementById('user-estado'));
      setStateOnlyCeara(document.getElementById('company-estado'));

      renderChips(document.getElementById('user-interests'), USER_INTERESTS, state.userInterests);
      renderChips(document.getElementById('user-favorites'), USER_FAVORITES, state.userFavorites);
      renderChips(el.companyTags, COMPANY_TAGS, state.companyTags);
      renderCompanyCategoryCards();
      renderCompanyServices();
      renderCompanyMenuCategoryChips();
      renderCompanyMenuItems();
      renderGallery(state.companyGallery, el.companyGalleryList);
      renderGallery(state.companyMenuPhotos, el.companyMenuGallery);
      bindSourceSwitches();
      bindEvents();

      el.userForm.addEventListener('submit', onUserSubmit);
      el.companyForm.addEventListener('submit', onCompanySubmit);

      document.querySelectorAll('#user-cidade, #user-estado, #company-cidade, #company-estado').forEach((select) => {
        select.addEventListener('change', renderPreview);
      });

      document.getElementById('company-cidade').addEventListener('change', renderPreview);
      document.getElementById('company-estado').addEventListener('change', renderPreview);

      document.getElementById('user-nome').addEventListener('input', renderPreview);
      document.getElementById('user-sobrenome').addEventListener('input', renderPreview);
      document.getElementById('user-email').addEventListener('input', renderPreview);
      document.getElementById('user-telefone').addEventListener('input', renderPreview);

      ['company-nome', 'company-descricao', 'company-telefone', 'company-horario', 'company-site', 'company-instagram', 'company-preco-min', 'company-preco-max', 'company-endereco', 'company-cep', 'company-mapa-id', 'company-lat', 'company-lng'].forEach((id) => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', renderPreview);
      });

      document.getElementById('user-senha').addEventListener('input', () => {
        updatePasswordStrength();
        renderPreview();
      });
      document.getElementById('user-confirmar').addEventListener('input', renderPreview);
      document.getElementById('user-termos').addEventListener('change', renderPreview);

      document.querySelectorAll('.wizard-step input, .wizard-step select, .wizard-step textarea').forEach((input) => {
        input.addEventListener('focus', () => setAlert(''));
      });

      updatePasswordStrength();
      setMode('usuario');
      renderPreview();
    }

    init();
  });
})();
