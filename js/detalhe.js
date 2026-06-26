/* ============================================================
   TELA DE DETALHE DE HOTEL / RESTAURANTE
   ============================================================ */

(function () {
  const CATEGORY_LABELS = {
    hotel: 'Hotel',
    restaurant: 'Restaurante',
    experience: 'Experiência',
  };

  const CATEGORY_ICONS = {
    hotel: 'fa-hotel',
    restaurant: 'fa-utensils',
    experience: 'fa-route',
  };

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getTipo() {
    const tipo = getParams().get('tipo');
    if (tipo === 'restaurant') return 'restaurant';
    if (tipo === 'experience') return 'experience';
    return 'hotel';
  }

  function getEmpresasFromStorage() {
    try {
      return JSON.parse(localStorage.getItem('turistando_empresas') || '[]');
    } catch (e) {
      return [];
    }
  }

  function getAllHoteis() {
    const empresas = getEmpresasFromStorage().filter(e => e.tipo === 'hotel');
    return [...(HOTEIS || []), ...empresas];
  }

  function getAllRestaurantes() {
    const empresas = getEmpresasFromStorage().filter(e => e.tipo === 'restaurante');
    return [...(RESTAURANTES || []), ...empresas];
  }

  function getAllExperiencias() {
    return typeof EXPERIENCIAS !== 'undefined' ? EXPERIENCIAS : [];
  }

  function getItem() {
    const tipo = getTipo();
    const rawId = getParams().get('id');
    const id = Number(rawId);
    const matchById = (item) => String(item.id) === String(rawId) || item.id === id;
    const collection = tipo === 'restaurant'
      ? getAllRestaurantes()
      : tipo === 'experience'
        ? getAllExperiencias()
        : getAllHoteis();
    let item = collection.find(matchById);

    if (!item) {
      item = [...getAllHoteis(), ...getAllRestaurantes(), ...getAllExperiencias()].find(matchById);
    }

    return item;
  }

  function getCollection(tipo) {
    if (tipo === 'restaurant') return getAllRestaurantes();
    if (tipo === 'experience') return getAllExperiencias();
    return getAllHoteis();
  }

  function getMapFocusId(item, tipo) {
    const localizacao = item?.localizacao || {};
    // Se o item já tem mapaId, usa ele direto
    if (item && item.mapaId) return item.mapaId;
    if (localizacao && localizacao.mapaId) return localizacao.mapaId;
    // Fallback: gera um ID baseado no tipo e nome
    if (item && item.nome) {
      const prefix = tipo === 'hotel' ? 'hotel' : tipo === 'experience' ? 'exp' : 'rest';
      const slug = item.nome.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      return `${prefix}-${item.id || slug}`;
    }
    return '';
  }

  function getTags(item, tipo) {
    const tagsSet = new Set();

    if (tipo === 'hotel') {
      (item.servicos || []).forEach(t => tagsSet.add(t));
      (item.tags || []).forEach(t => tagsSet.add(t));
    } else if (tipo === 'experience') {
      (item.tags || []).forEach(t => tagsSet.add(t));
      if (item.categoria) tagsSet.add(item.categoria);
      if (item.nivelDificuldade) tagsSet.add(item.nivelDificuldade);
      if (item.acessibilidade) {
        if (item.acessibilidade.criancas) tagsSet.add('Família');
        if (item.acessibilidade.cadeiraDeRodas) tagsSet.add('Acessível');
        if (item.acessibilidade.petFriendly) tagsSet.add('Pet Friendly');
      }
    } else {
      if (item.culinaria) {
        tagsSet.add(item.culinaria);
        if (/frutos do mar/i.test(item.culinaria)) tagsSet.add('Frutos do Mar');
        if (/regional/i.test(item.culinaria)) tagsSet.add('Gastronomia');
        if (/café/i.test(item.culinaria)) tagsSet.add('Café Regional');
        if (/pizza/i.test(item.culinaria)) tagsSet.add('Pizza');
        if (/italian/i.test(item.culinaria)) tagsSet.add('Italiana');
        if (/churrasco/i.test(item.culinaria)) tagsSet.add('Churrasco');
        if (/japones/i.test(item.culinaria)) tagsSet.add('Japonesa');
        if (/mexican/i.test(item.culinaria)) tagsSet.add('Mexicana');
      }
      (item.tags || []).forEach(t => tagsSet.add(t));
    }

    return Array.from(tagsSet).filter(Boolean);
  }

  function getSubtitle(item, tipo) {
    if (tipo === 'hotel') {
      return `${item.cidade} · ${item.avaliacao} ⭐ · ${item.preco}/noite`;
    }
    if (tipo === 'experience') {
      return `${item.cidade} · ${item.duracao} · ${item.nivelDificuldade} · ${item.precoFormatado || `R$ ${item.precoMin}`}`;
    }
    return `${item.cidade} · ${item.culinaria} · ${item.preco} · ${item.avaliacao} ⭐`;
  }

  function getFacts(item, tipo) {
    if (tipo === 'hotel') {
      return [
        { label: 'Cidade', value: item.cidade },
        { label: 'Preço', value: `${item.preco}/noite` },
        { label: 'Avaliação', value: `${item.avaliacao} / 5 ⭐` },
        { label: 'Categoria', value: 'Hotel' },
      ];
    }

    if (tipo === 'experience') {
      const localizacao = item.localizacao || {};
      return [
        { label: 'Cidade', value: item.cidade },
        { label: 'Duração', value: item.duracao || '-' },
        { label: 'Preço', value: item.precoFormatado || `R$ ${item.precoMin} - R$ ${item.precoMax}` },
        { label: 'Dificuldade', value: item.nivelDificuldade || '-' },
        { label: 'Localização', value: localizacao.pontoPartida || localizacao.endereco || item.cidade },
      ];
    }

    return [
      { label: 'Cidade', value: item.cidade },
      { label: 'Culinária', value: item.culinaria },
      { label: 'Preço', value: "R$ " + item.preco },
      { label: 'Avaliação', value: `${item.avaliacao} / 5 ⭐` },
    ];
  }

  function renderFacts(container, facts) {
    container.innerHTML = facts.map((fact) => `
      <div class="detail-fact">
        <span>${fact.label}</span>
        <strong>${fact.value}</strong>
      </div>
    `).join('');
  }

  function renderTags(container, tags) {
    container.innerHTML = tags.map((tag) => `
      <span class="detail-tag"><i class="fa-solid fa-circle-check"></i> ${tag}</span>
    `).join('');
  }

  function makeRecommendationCard(tipo, item) {
    const href = `detalhe.html?tipo=${tipo}&id=${item.id}`;
    const subtitle = tipo === 'hotel'
      ? `${item.preco}/noite`
      : tipo === 'experience'
        ? `${item.duracao} · ${item.precoFormatado || `R$ ${item.precoMin}`}`
        : `${item.culinaria} · ${item.preco}`;
    const title = item.nome || item.titulo;

    return `
      <a class="mini-card" href="${href}">
        <img class="mini-card__img" src="${item.imagem || item.banner || ''}" alt="${title}" loading="lazy">
        <div class="mini-card__body">
          <h3>${title}</h3>
          <p>${item.cidade} · ${subtitle}</p>
        </div>
      </a>
    `;
  }

  function makeExperienceCard(item) {
    return `
      <a class="mini-card" href="detalhe.html?tipo=experience&id=${item.id}">
        <img class="mini-card__img" src="${item.banner || item.imagem || ''}" alt="${item.titulo}" loading="lazy">
        <div class="mini-card__body">
          <h3>${item.titulo}</h3>
          <p>${item.cidade} · ${item.duracao || ''} · ${item.precoFormatado || `R$ ${item.precoMin}`}</p>
        </div>
      </a>
    `;
  }

  function renderRecommendations(item, tipo) {
    const container = document.getElementById('detail-recommendations');
    const title = document.getElementById('detail-rec-title');
    if (!container || !title) return;

    if (tipo === 'experience') {
      const sameType = getAllExperiencias().filter((entry) => {
        if (String(entry.id) === String(item.id)) return false;
        const sameCity = entry.cidade === item.cidade;
        const sameCategory = entry.categoria === item.categoria;
        const sharedTag = (entry.tags || []).some(tag => (item.tags || []).includes(tag));
        return sameCity && (sameCategory || sharedTag);
      });

      const suporte = [...getAllHoteis(), ...getAllRestaurantes()].filter((entry) => entry.cidade === item.cidade);

      const sameTypeHtml = sameType.length
        ? sameType.slice(0, 3).map((entry) => makeExperienceCard(entry)).join('')
        : '<div class="detail-empty">Ainda não há experiências parecidas nessa cidade.</div>';

      const suporteHtml = suporte.length
        ? suporte.slice(0, 3).map((entry) => makeRecommendationCard(entry.servicos ? 'hotel' : 'restaurant', entry)).join('')
        : '<div class="detail-empty">Ainda não há sugestões complementares nessa cidade.</div>';

      title.textContent = `Mais experiências em ${item.cidade}`;
      container.innerHTML = `
        <div>
          <h3 style="margin-bottom:12px; color:var(--text);">Experiências relacionadas</h3>
          <div class="recommendations-grid">${sameTypeHtml}</div>
        </div>
        <div style="margin-top:24px;">
          <h3 style="margin-bottom:12px; color:var(--text);">Para combinar com o roteiro</h3>
          <div class="recommendations-grid">${suporteHtml}</div>
        </div>
      `;
      return;
    }

    const sameType = getCollection(tipo).filter((entry) => entry.cidade === item.cidade && entry.id !== item.id);
    const oppositeType = getCollection(tipo === 'hotel' ? 'restaurant' : 'hotel').filter((entry) => entry.cidade === item.cidade);

    const sameTypeHtml = sameType.length
      ? sameType.slice(0, 3).map((entry) => makeRecommendationCard(tipo, entry)).join('')
      : '<div class="detail-empty">Ainda não há mais itens desta categoria nessa cidade.</div>';

    const oppositeTypeHtml = oppositeType.length
      ? oppositeType.slice(0, 3).map((entry) => makeRecommendationCard(tipo === 'hotel' ? 'restaurant' : 'hotel', entry)).join('')
      : '<div class="detail-empty">Ainda não há recomendações complementares nessa cidade.</div>';

    title.textContent = tipo === 'hotel'
      ? `Mais hotéis e restaurantes em ${item.cidade}`
      : `Mais restaurantes e hotéis em ${item.cidade}`;

    container.innerHTML = `
      <div>
        <h3 style="margin-bottom:12px; color:var(--text);">Itens semelhantes</h3>
        <div class="recommendations-grid">${sameTypeHtml}</div>
      </div>
      <div style="margin-top:24px;">
        <h3 style="margin-bottom:12px; color:var(--text);">Para combinar com a visita</h3>
        <div class="recommendations-grid">${oppositeTypeHtml}</div>
      </div>
    `;
  }

  function atualizarFavoritoDetalhe(item, tipo) {
    const btn = document.getElementById('detail-fav-btn');
    const isFav = tipo === 'hotel'
      ? favoritosHoteis.has(item.id)
      : tipo === 'experience'
        ? favoritosExperiencias.has(item.id)
        : favoritosRestaurantes.has(item.id);

    if (btn) {
      btn.innerHTML = isFav
        ? '<i class="fa-solid fa-heart"></i> Favoritado'
        : '<i class="fa-solid fa-heart"></i> Favoritar';
    }
  }

  function atualizarQueroConhecerDetalhe(item, tipo) {
    const btn = document.getElementById('detail-know-btn');
    const isSaved = tipo === 'hotel'
      ? queroConhecerHoteis.has(item.id)
      : tipo === 'experience'
        ? queroConhecerExperiencias.has(item.id)
        : queroConhecerRestaurantes.has(item.id);

    if (btn) {
      btn.classList.toggle('active', isSaved);
      btn.innerHTML = isSaved
        ? `<i class="fa-solid fa-star"></i> ${tipo === 'experience' ? 'Na minha lista' : 'Na minha lista'}`
        : `<i class="fa-solid fa-star"></i> ${tipo === 'experience' ? 'Quero fazer' : 'Quero conhecer'}`;
    }
  }

  function atualizarVisitadoDetalhe(item, tipo) {
    const btn = document.getElementById('detail-visited-btn');
    const isVisited = tipo === 'hotel'
      ? visitadosHoteis.has(item.id)
      : tipo === 'experience'
        ? visitadosExperiencias.has(item.id)
        : visitadosRestaurantes.has(item.id);

    if (btn) {
      btn.classList.toggle('active', isVisited);
      btn.innerHTML = isVisited
        ? `<i class="fa-solid fa-circle-check"></i> ${tipo === 'experience' ? 'Já fiz' : 'Já fui'}`
        : `<i class="fa-solid fa-circle-check"></i> ${tipo === 'experience' ? 'Marcar como feito' : 'Marcar como visitado'}`;
    }
  }

  function toggleFavoritoDetalhe(item, tipo) {
    const set = tipo === 'hotel'
      ? favoritosHoteis
      : tipo === 'experience'
        ? favoritosExperiencias
        : favoritosRestaurantes;
    const favType = tipo === 'hotel' ? 'hotel' : tipo === 'experience' ? 'experience' : 'restaurante';

    if (set.has(item.id)) {
      set.delete(item.id);
    } else {
      if (!salvarFavorito(favType)) return;
      set.add(item.id);
    }

    salvarFavorito(favType);
    atualizarFavoritoDetalhe(item, tipo);
  }

  function toggleQueroConhecerDetalhe(item, tipo) {
    const set = tipo === 'hotel'
      ? queroConhecerHoteis
      : tipo === 'experience'
        ? queroConhecerExperiencias
        : queroConhecerRestaurantes;
    const saveType = tipo === 'hotel' ? 'hotel' : tipo === 'experience' ? 'experience' : 'restaurante';

    if (set.has(item.id)) {
      set.delete(item.id);
    } else {
      if (!salvarQueroConhecer(saveType)) return;
      set.add(item.id);
    }

    salvarQueroConhecer(saveType);
    atualizarQueroConhecerDetalhe(item, tipo);
  }

  function toggleVisitadoDetalhe(item, tipo) {
    const set = tipo === 'hotel'
      ? visitadosHoteis
      : tipo === 'experience'
        ? visitadosExperiencias
        : visitadosRestaurantes;
    const saveType = tipo === 'hotel' ? 'hotel' : tipo === 'experience' ? 'experience' : 'restaurant';

    if (set.has(item.id)) {
      set.delete(item.id);
      salvarVisitado(saveType);
    } else {
      if (!marcarVisitado(saveType, item.id, item.cidade)) return;
    }

    atualizarVisitadoDetalhe(item, tipo);
  }

  function compartilhar(item, tipo) {
    const nome = item.nome || item.titulo;
    const texto = `${nome} em ${item.cidade} · Turistando CE`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: nome, text: texto, url }).catch(() => { });
      return;
    }

    navigator.clipboard?.writeText(url).then(() => {
      alert('Link copiado para a área de transferência.');
    }).catch(() => {
      alert(texto + '\n' + url);
    });
  }

  function renderPage() {
    const item = getItem();
    const tipo = getTipo();
    if (!item) {
      window.location.href = 'index.html';
      return;
    }

    const label = CATEGORY_LABELS[tipo];
    const collectionLabel = tipo === 'hotel'
      ? 'Hotéis'
      : tipo === 'experience'
        ? 'Experiências'
        : 'Restaurantes';
    const mapFocusId = getMapFocusId(item, tipo);

    document.title = `${item.nome || item.titulo} — Turistando CE`;

    const badge = document.getElementById('detail-badge');
    const image = document.getElementById('detail-image');
    const breadcrumb = document.getElementById('detail-breadcrumb');
    const title = document.getElementById('detail-title');
    const subtitle = document.getElementById('detail-subtitle');
    const facts = document.getElementById('detail-facts');
    const about = document.getElementById('detail-about');
    const tags = document.getElementById('detail-tags');
    const favBtn = document.getElementById('detail-fav-btn');
    const knowBtn = document.getElementById('detail-know-btn');
    const visitedBtn = document.getElementById('detail-visited-btn');
    const shareBtn = document.getElementById('detail-share-btn');
    const mapBtn = document.getElementById('detail-map-btn');

    if (badge) badge.textContent = label;
    if (image) {
      image.src = tipo === 'experience'
        ? (item.banner || item.imagem || '')
        : item.imagem;
      image.alt = item.nome || item.titulo;
    }

    if (breadcrumb) {
      const baseLink = tipo === 'experience' ? 'experiencias.html' : `index.html#${tipo === 'hotel' ? 'hoteis' : 'restaurantes'}`;
      breadcrumb.innerHTML = `
        <a href="index.html">Início</a>
        <span>/</span>
        <a href="${baseLink}">${collectionLabel}</a>
        <span>/</span>
        <span>${item.nome || item.titulo}</span>
      `;
    }

    if (title) title.textContent = item.nome || item.titulo;
    if (subtitle) subtitle.textContent = getSubtitle(item, tipo);
    if (about) {
      about.textContent = tipo === 'hotel'
        ? item.descricao
        : tipo === 'experience'
          ? item.descricao || item.descricaoCurta || ''
          : `${item.descricao} É uma boa opção para quem quer conhecer a cena gastronômica de ${item.cidade}.`;
    }

    renderFacts(facts, getFacts(item, tipo));
    renderTags(tags, getTags(item, tipo));
    renderGaleria(item);
    renderCardapio(item);
    renderMiniMapa(item);
    renderRecommendations(item, tipo);
    renderCronograma(item, tipo);
    renderEmpresas(item, tipo);
    renderDicas(item, tipo);
    atualizarFavoritoDetalhe(item, tipo);
    atualizarQueroConhecerDetalhe(item, tipo);
    atualizarVisitadoDetalhe(item, tipo);

    if (favBtn) {
      favBtn.onclick = () => toggleFavoritoDetalhe(item, tipo);
      favBtn.innerHTML = `<i class="fa-solid fa-heart"></i> ${tipo === 'experience' ? 'Favoritar' : 'Favoritar'}`;
    }

    if (knowBtn) {
      knowBtn.onclick = () => toggleQueroConhecerDetalhe(item, tipo);
      knowBtn.innerHTML = `<i class="fa-solid fa-star"></i> ${tipo === 'experience' ? 'Quero fazer' : 'Quero conhecer'}`;
    }

    if (visitedBtn) {
      visitedBtn.onclick = () => toggleVisitadoDetalhe(item, tipo);
      visitedBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${tipo === 'experience' ? 'Marcar como feito' : 'Marcar como visitado'}`;
    }

    if (shareBtn) {
      shareBtn.onclick = () => compartilhar(item, tipo);
    }

    if (mapBtn) {
      mapBtn.href = mapFocusId ? `mapa.html?focus=${encodeURIComponent(mapFocusId)}` : 'mapa.html';
      mapBtn.innerHTML = `<i class="fa-solid fa-map-location-dot"></i> ${tipo === 'experience' ? 'Ver no mapa' : 'Ver no mapa'}`;
    }

    renderSocial(item);

    if (typeof iniciarObserver === 'function') {
      iniciarObserver();
    }
  }

  function renderSocial(item) {
    const container = document.getElementById('detail-social');
    if (!container) return;

    const instagram = item.instagram;
    const site = item.site;
    const whatsapp = item.whatsapp;

    if (!instagram && !site && !whatsapp) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = '';
    if (instagram) {
      const btn = document.createElement('a');
      btn.href = instagram;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'btn-social btn-social--ig';
      btn.innerHTML = '<i class="fa-brands fa-instagram"></i> Instagram';
      container.appendChild(btn);
    }
    if (site) {
      const btn = document.createElement('a');
      btn.href = site;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'btn-social btn-social--site';
      btn.innerHTML = '<i class="fa-solid fa-globe"></i> Site';
      container.appendChild(btn);
    }
    if (whatsapp) {
      const btn = document.createElement('a');
      btn.href = `https://wa.me/${String(whatsapp).replace(/\D/g, '')}`;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'btn-social btn-social--site';
      btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i> WhatsApp';
      container.appendChild(btn);
    }
  }

  function renderGaleria(item) {
    const section = document.getElementById('detail-galeria-section');
    const container = document.getElementById('detail-galeria');
    if (!section || !container) return;

    const fotosBase = item.galeria || [];
    const fotosExtras = (item.imagens || []).map(img => typeof img === 'string' ? img : img.url).filter(Boolean);
    const fotos = [...fotosBase, ...fotosExtras].filter(Boolean);
    if (fotos.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    // Monta o carrossel com navegação
    container.innerHTML = `
      <div class="detail-carrossel">
        <div class="detail-carrossel-track" id="carrossel-track">
          ${fotos.map((url, i) => `
            <div class="detail-carrossel-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
              <img src="${url}" alt="Foto ${i + 1} do estabelecimento" loading="lazy">
            </div>
          `).join('')}
        </div>
        ${fotos.length > 1 ? `
        <button class="carrossel-btn carrossel-prev" onclick="navegarCarrosselDetalhe(-1)" title="Anterior">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="carrossel-btn carrossel-next" onclick="navegarCarrosselDetalhe(1)" title="Próxima">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        <div class="carrossel-dots">
          ${fotos.map((_, i) => `
            <span class="carrossel-dot ${i === 0 ? 'active' : ''}" onclick="irParaSlideDetalhe(${i})"></span>
          `).join('')}
        </div>
        <span class="carrossel-counter">1 / ${fotos.length}</span>
        ` : ''}
      </div>
    `;
  }

  function renderCardapio(item) {
    const section = document.getElementById('detail-cardapio-section');
    const container = document.getElementById('detail-cardapio');
    if (!section || !container) return;

    const itens = item.cardapio || [];
    if (itens.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = itens.map(prato => `
      <div class="cardapio-card">
        ${prato.imagem ? `<div class="cardapio-card__img-wrap"><img src="${prato.imagem}" alt="${prato.nome}" loading="lazy"></div>` : ''}
        <div class="cardapio-card__body">
          <div class="cardapio-card__header">
            <h3>${prato.nome}</h3>
            <span class="cardapio-card__preco">${prato.preco}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderMiniMapa(item) {
    const section = document.getElementById('detail-mapa-section');
    const info = document.getElementById('detail-mapa-info');
    const container = document.getElementById('detail-mapa-container');
    if (!section || !container) return;

    const localizacao = item?.localizacao || {};
    const lat = localizacao.lat ?? item.lat;
    const lng = localizacao.lng ?? item.lng;
    const titulo = localizacao.pontoPartida || localizacao.endereco || item.cidade || '';
    const subtitulo = localizacao.endereco || localizacao.cidade || item.cidade || '';

    if (info) {
      info.innerHTML = `
        <strong>${titulo || 'Localização'}</strong>
        <span>${subtitulo || 'Endereço indisponível'}</span>
      `;
    }

    if (!lat || !lng) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';

    // Limpa container
    container.innerHTML = '';

    // Inicializa mini mapa
    const map = L.map(container, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Marker
    const meta = getTipo() === 'hotel'
      ? { color: '#2d6a4f', icon: 'fa-hotel' }
      : getTipo() === 'experience'
        ? { color: '#0f766e', icon: 'fa-route' }
        : { color: '#40916c', icon: 'fa-utensils' };

    const markerIcon = L.divIcon({
      className: 'map-marker',
      html: `<div class="map-marker__pin" style="background:${meta.color};width:36px;height:36px;font-size:0.85rem;">
        <i class="fa-solid ${meta.icon}"></i>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 34],
    });

    L.marker([lat, lng], { icon: markerIcon }).addTo(map);

    // Força o mapa a se renderizar
    setTimeout(() => map.invalidateSize(), 200);
  }

  function renderCronograma(item, tipo) {
    const section = document.getElementById('detail-roteiro-section');
    const container = document.getElementById('detail-roteiro');
    if (!section || !container) return;

    if (tipo !== 'experience' || !item.cronograma || item.cronograma.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = item.cronograma.map((passo, index) => `
      <div class="timeline-item">
        <div class="timeline-step">${String(index + 1).padStart(2, '0')}</div>
        <div class="timeline-content">
          <span class="timeline-time">${passo.hora || ''}</span>
          <h3>${passo.titulo || passo.title || 'Etapa'}</h3>
          <p>${passo.descricao || passo.texto || ''}</p>
        </div>
      </div>
    `).join('');
  }

  function renderEmpresas(item, tipo) {
    const section = document.getElementById('detail-empresas-section');
    const container = document.getElementById('detail-empresas');
    if (!section || !container) return;

    if (tipo !== 'experience' || !item.empresas || item.empresas.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = item.empresas.map(emp => `
      <div class="detail-company-card">
        <div>
          <h3>${emp.nome}</h3>
          <p>${emp.nota ? `Nota ${emp.nota} ⭐` : ''}${emp.site ? ` · ${emp.site}` : ''}</p>
        </div>
        <div class="detail-company-actions">
          ${emp.whatsapp ? `<a class="btn-secondary" href="https://wa.me/${String(emp.whatsapp).replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ''}
          ${emp.site ? `<a class="btn-secondary" href="${emp.site}" target="_blank" rel="noopener noreferrer">Site</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  function renderDicas(item, tipo) {
    const section = document.getElementById('detail-dicas-section');
    const container = document.getElementById('detail-dicas');
    if (!section || !container) return;

    if (tipo !== 'experience' || !item.dicas || item.dicas.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = item.dicas.map(dica => `
      <span class="detail-tag"><i class="fa-solid fa-circle-check"></i> ${dica}</span>
    `).join('');
  }

  // ============================================================
  // COMENTÁRIOS DOS USUÁRIOS
  // ============================================================

  let notaSelecionada = 0;

  function getComentariosStorage() {
    try {
      return JSON.parse(localStorage.getItem('turistando_comentarios') || '[]');
    } catch (e) {
      return [];
    }
  }

  function salvarComentariosStorage(comentarios) {
    localStorage.setItem('turistando_comentarios', JSON.stringify(comentarios));
  }

  function getComentariosDoItem(tipo, id) {
    const todos = getComentariosStorage();
    return todos.filter(c => c.itemTipo === tipo && c.itemId === id);
  }

  function renderizarComentarios(item, tipo) {
    const container = document.getElementById('comentarios-lista');
    const countEl = document.getElementById('comentarios-count');
    const vazioEl = document.getElementById('comentarios-vazio');
    if (!container) return;

    const comentarios = getComentariosDoItem(tipo, item.id);
    const total = comentarios.length;

    if (countEl) countEl.textContent = total;

    if (total === 0) {
      container.innerHTML = `
        <div class="comentario-vazio" id="comentarios-vazio">
          <i class="fa-regular fa-comment-dots"></i>
          <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = comentarios.map(c => {
      const estrelas = '★'.repeat(c.nota) + '☆'.repeat(5 - c.nota);
      const dataFormatada = new Date(c.data).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      const inicial = c.usuarioNome ? c.usuarioNome.charAt(0).toUpperCase() : '?';
      return `
        <div class="comentario-card">
          <div class="comentario-header">
            <div class="comentario-avatar">
              ${c.foto ? `<img src="${c.foto}" alt="${c.usuarioNome}">` : inicial}
            </div>
            <div class="comentario-info">
              <div class="comentario-nome">${c.usuarioNome}</div>
              <div class="comentario-data">${dataFormatada}</div>
            </div>
          </div>
          <div class="comentario-estrelas">${estrelas}</div>
          <p class="comentario-texto">${c.texto}</p>
        </div>
      `;
    }).join('');
  }

  function renderizarFormularioComentario(item, tipo) {
    const container = document.getElementById('comentarios-form-container');
    if (!container) return;

    if (!currentUser) {
      container.innerHTML = `
        <div class="comentario-form-nao-logado">
          <p><i class="fa-regular fa-comment"></i> Faça <a href="login.html">login</a> ou <a href="cadastro.html">crie uma conta</a> para comentar.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="comentario-form">
        <div class="comentario-stars" id="comentario-stars">
          <span class="star" data-star="5">★</span>
          <span class="star" data-star="4">★</span>
          <span class="star" data-star="3">★</span>
          <span class="star" data-star="2">★</span>
          <span class="star" data-star="1">★</span>
        </div>
        <textarea id="comentario-texto" placeholder="Compartilhe sua experiência..." rows="3"></textarea>
        <button class="btn-plan" onclick="window.enviarComentario('${tipo}', ${item.id})">
          <i class="fa-solid fa-paper-plane"></i> Enviar Comentário
        </button>
      </div>
    `;

    // Inicializar estrelas interativas
    const stars = container.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', function () {
        notaSelecionada = parseInt(this.dataset.star);
        stars.forEach(s => s.classList.remove('selecionada'));
        stars.forEach(s => {
          if (parseInt(s.dataset.star) <= notaSelecionada) {
            s.classList.add('selecionada');
          }
        });
      });

      star.addEventListener('mouseenter', function () {
        const val = parseInt(this.dataset.star);
        stars.forEach(s => {
          if (parseInt(s.dataset.star) <= val) {
            s.style.color = '#f59e0b';
          } else {
            s.style.color = '';
          }
        });
      });

      star.addEventListener('mouseleave', function () {
        stars.forEach(s => {
          if (!s.classList.contains('selecionada')) {
            s.style.color = '';
          }
        });
      });
    });
  }

  window.enviarComentario = function(tipo, itemId) {
    const texto = document.getElementById('comentario-texto');
    if (!texto || !texto.value.trim()) {
      alert('Escreva um comentário antes de enviar.');
      return;
    }

    if (notaSelecionada === 0) {
      alert('Selecione uma avaliação por estrelas (1 a 5).');
      return;
    }

    const comentarios = getComentariosStorage();
    const novoComentario = {
      id: Date.now(),
      itemTipo: tipo,
      itemId: itemId,
      usuarioNome: currentUser.nome,
      usuarioEmail: currentUser.email,
      texto: texto.value.trim(),
      nota: notaSelecionada,
      data: new Date().toISOString(),
      foto: getUserPhoto() || '',
    };

    comentarios.push(novoComentario);
    salvarComentariosStorage(comentarios);

    // Resetar formulário
    notaSelecionada = 0;
    texto.value = '';
    document.querySelectorAll('#comentario-stars .star').forEach(s => s.classList.remove('selecionada'));

    // Re-renderizar
    const item = getItem();
    renderizarComentarios(item, tipo);

    alert('✅ Comentário enviado com sucesso!');
  };

  function renderComentarios(item, tipo) {
    renderizarFormularioComentario(item, tipo);
    renderizarComentarios(item, tipo);
  }

  // Estender renderPage para incluir comentários
  const renderPageOriginal = renderPage;
  renderPage = function() {
    renderPageOriginal();
    const item = getItem();
    const tipo = getTipo();
    if (item) {
      renderComentarios(item, tipo);
    }
  };

  document.addEventListener('DOMContentLoaded', renderPage);
})();
