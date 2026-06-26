/* ============================================================
   MAPA INTERATIVO DO CEARÁ
   Leaflet + OpenStreetMap com filtros flutuantes.
   Gera automaticamente hotéis e restaurantes
   que tenham lat/lng — cadastre 1 vez só!
   ============================================================ */

(function () {
  const MAP_CENTER = [-4.2700, -38.4900];
  const INITIAL_ZOOM = 8;
  const MIN_ZOOM = 7;
  const MAX_ZOOM = 16;

  const CATEGORY_META = {
    all: { label: 'Todos', color: '#1a4a3a', icon: 'fa-location-dot' },
    beach: { label: 'Praias', color: '#1a4a3a', icon: 'fa-umbrella-beach' },
    hotel: { label: 'Hotéis', color: '#2d6a4f', icon: 'fa-hotel' },
    restaurant: { label: 'Restaurantes', color: '#40916c', icon: 'fa-utensils' },
    tour: { label: 'Passeios', color: '#52b788', icon: 'fa-route' },
    event: { label: 'Eventos', color: '#74c69d', icon: 'fa-calendar-days' },
  };

  const state = {
    map: null,
    activeCategory: 'all',
    markers: new Map(),
    groups: new Map(),
    allPoints: [],
  };

  // ---------- GERA PONTOS A PARTIR DOS DADOS ----------
  function obterDados() {
    let hoteis = [];
    let restaurantes = [];
    try {
      if (typeof HOTEIS !== 'undefined' && HOTEIS) hoteis = HOTEIS;
    } catch (e) { }
    try {
      if (typeof RESTAURANTES !== 'undefined' && RESTAURANTES) restaurantes = RESTAURANTES;
    } catch (e) { }
    if (!hoteis.length && window.HOTEIS) hoteis = window.HOTEIS;
    if (!restaurantes.length && window.RESTAURANTES) restaurantes = window.RESTAURANTES;
    return { hoteis, restaurantes };
  }

  function gerarPontos() {
    const pontos = [...(window.MAPA_PONTOS || [])];
    const { hoteis: todosHoteisBase, restaurantes: todosRestaurantesBase } = obterDados();

    const todosHoteis = [...todosHoteisBase];
    try {
      const empresas = JSON.parse(localStorage.getItem('turistando_empresas') || '[]');
      empresas.filter(e => e.tipo === 'hotel').forEach(e => {
        if (!todosHoteis.find(h => h.id === e.id)) todosHoteis.push(e);
      });
    } catch (e) { }

    todosHoteis.forEach(h => {
      if (h.lat && h.lng && h.nome) {
        const jaExiste = pontos.some(p => p.id === h.mapaId || p.id === `hotel-${h.id}`);
        if (!jaExiste) {
          pontos.push({
            id: h.mapaId || `hotel-${h.id}`,
            name: h.nome,
            city: h.cidade,
            category: 'hotel',
            lat: h.lat,
            lng: h.lng,
            description: h.descricao,
            image: h.imagem,
          });
        }
      }
    });

    const todosRestaurantes = [...todosRestaurantesBase];
    try {
      const empresas = JSON.parse(localStorage.getItem('turistando_empresas') || '[]');
      empresas.filter(e => e.tipo === 'restaurante').forEach(e => {
        if (!todosRestaurantes.find(r => r.id === e.id)) todosRestaurantes.push(e);
      });
    } catch (e) { }

    todosRestaurantes.forEach(r => {
      if (r.lat && r.lng && r.nome) {
        const jaExiste = pontos.some(p => p.id === r.mapaId || p.id === `rest-${r.id}`);
        if (!jaExiste) {
          pontos.push({
            id: r.mapaId || `rest-${r.id}`,
            name: r.nome,
            city: r.cidade,
            category: 'restaurant',
            lat: r.lat,
            lng: r.lng,
            description: r.descricao,
            image: r.imagem,
          });
        }
      }
    });

    return pontos;
  }

  function getPopupHtml(point) {
    return `
      <div class="map-popup">
        <h3>${point.name}</h3>
        <p class="map-popup-meta">${point.city} · ${CATEGORY_META[point.category]?.label || point.category}</p>
        <p class="map-popup-desc">${point.description || ''}</p>
      </div>
    `;
  }

  function createMarkerIcon(point) {
    const meta = CATEGORY_META[point.category] || CATEGORY_META.all;
    return L.divIcon({
      className: 'map-marker',
      html: `
        <div class="map-marker__pin" style="background:${meta.color}">
          <i class="fa-solid ${meta.icon}"></i>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 38],
      popupAnchor: [0, -34],
    });
  }

  function ensureMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl || state.map) return;

    if (typeof L === 'undefined') {
      showMapError('O mapa não pôde ser inicializado porque o Leaflet não carregou.');
      return;
    }

    if (L.Icon && L.Icon.Default && L.Icon.Default.prototype._getIconUrl) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }

    state.map = L.map('map', {
      center: MAP_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: MAX_ZOOM,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(state.map);

    state.map.attributionControl.setPrefix('');

    state.allPoints = gerarPontos();

    buildMarkers();
    setActiveCategory('all');

    requestAnimationFrame(() => state.map.invalidateSize());
    setTimeout(() => state.map && state.map.invalidateSize(), 120);
  }

  function showMapError(message) {
    const error = document.getElementById('map-error');
    if (!error) return;
    const text = error.querySelector('p');
    if (text) {
      text.textContent = message;
    }
    error.hidden = false;
  }

  function buildMarkers() {
    const points = state.allPoints;
    const clusterByCategory = new Map();

    Object.keys(CATEGORY_META).forEach((key) => {
      if (key !== 'all') {
        const group = L.layerGroup().addTo(state.map);
        clusterByCategory.set(key, group);
      }
    });

    points.forEach((point) => {
      const group = clusterByCategory.get(point.category);
      if (!group) return;

      const marker = L.marker([point.lat, point.lng], {
        icon: createMarkerIcon(point),
      }).bindPopup(getPopupHtml(point), {
        closeButton: true,
        autoPanPadding: [28, 28],
        maxWidth: 320,
      });

      // Ao clicar no marcador, abre popup e ajusta categoria
      marker.on('click', () => {
        const categoryBtn = document.querySelector(`.map-filter-btn[data-category="${point.category}"]`);
        if (categoryBtn && state.activeCategory !== point.category) {
          setActiveCategory(point.category);
        }
      });

      marker.addTo(group);
      state.markers.set(point.id, marker);
      state.groups.set(point.category, group);
    });
  }

  function setActiveCategory(category) {
    state.activeCategory = category;

    document.querySelectorAll('.map-filter-btn').forEach((button) => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    state.groups.forEach((group, groupCategory) => {
      if (category === 'all' || category === groupCategory) {
        if (!state.map.hasLayer(group)) {
          group.addTo(state.map);
        }
      } else if (state.map.hasLayer(group)) {
        state.map.removeLayer(group);
      }
    });
  }

  function bindFilters() {
    document.querySelectorAll('.map-filter-btn').forEach((button) => {
      button.addEventListener('click', () => {
        setActiveCategory(button.dataset.category);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureMap();
    bindFilters();

    if (state.map) {
      const params = new URLSearchParams(window.location.search);
      const focusId = params.get('focus') || params.get('point');
      const focusPoint = focusId ? state.allPoints.find((item) => item.id === focusId) : null;

      if (focusPoint) {
        setActiveCategory(focusPoint.category);
        state.map.setView([focusPoint.lat, focusPoint.lng], 13);
        const marker = state.markers.get(focusPoint.id);
        if (marker) marker.openPopup();
      } else {
        state.map.setView(MAP_CENTER, INITIAL_ZOOM);
      }
    }
  });

  window.MAPA_PAGE = {
    setActiveCategory,
  };
})();