/* ==============================
   DADOS — Mapa Interativo do Ceará
   Apenas praias e passeios ficam aqui.
   Hotéis e restaurantes são gerados
   automaticamente pelo mapa.js
   a partir de data/hoteis.js e data/restaurantes.js.
   ============================== */

window.MAPA_PONTOS = [
  // ===== PRAIAS =====
  {
    id: 'praia-iracema',
    name: 'Praia de Iracema',
    city: 'Fortaleza',
    category: 'beach',
    lat: -3.7237,
    lng: -38.5147,
    description: 'Um dos cartões-postais de Fortaleza, com calçadão, pôr do sol e vida cultural intensa.',
    image: 'https://scontent-for2-2.xx.fbcdn.net/v/t1.6435-9/42503827_277702652841157_1534898299432075264_n.jpg?stp=dst-jpg_tt6&cstp=mx1080x618&ctp=s1080x618&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH1nE1DaZDTPGH8V-XW4box2KBNkydteB_YoE2TJ214H8Qdc-TCuPldCGgkiR9HAB7WPcL76ia6r6TXzEXjyIpw&_nc_ohc=54ydiqWHKOgQ7kNvwGDVPXr&_nc_oc=Adrf3feuPo0mK8WhyvyrrukMYexKfdNWpfK3SanjFjtF-bvKWADjUWZ2BnY0J6MLePg&_nc_zt=23&_nc_ht=scontent-for2-2.xx&_nc_gid=HzyXGPGC_YgLqmAv1c87TQ&_nc_ss=7b2a8&oh=00_Af_UldirN6cDcWwv2NNXo6Hhdpxq7Q2QGDZNDh5ElaTx6Q&oe=6A5E8FBD',
  },
  {
    id: 'praia-futuro',
    name: 'Praia do Futuro',
    city: 'Fortaleza',
    category: 'beach',
    lat: -3.7500,
    lng: -38.4500,
    description: 'Faixa de praia famosa pelas barracas estruturadas, banho de mar e gastronomia à beira-mar.',
    image: 'https://saboresdacidade.com/wp-content/uploads/2024/02/terradosol.jpeg',
  },
  {
    id: 'jericoacoara',
    name: 'Jericoacoara',
    city: 'Jijoca de Jericoacoara',
    category: 'beach',
    lat: -2.7975,
    lng: -40.5137,
    description: 'Vila lendária entre dunas e mar, famosa pela Duna do Pôr do Sol e pelas lagoas cristalinas.',
    image: 'https://www.aeroportoguarulhos.net/wp-content/uploads/2016/10/ceara4-jeri-e1477596353406.jpg',
  },
  {
    id: 'canoa-quebrada',
    name: 'Canoa Quebrada',
    city: 'Aracati',
    category: 'beach',
    lat: -4.5150,
    lng: -37.6614,
    description: 'Destino clássico com falésias coloridas, mar calmo e clima boêmio.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/CE_-_Canoa_Quebrada_-_Fal%C3%A9sia.jpg/960px-CE_-_Canoa_Quebrada_-_Fal%C3%A9sia.jpg',
  },
  {
    id: 'lagoinha',
    name: 'Lagoinha',
    city: 'Paraipaba',
    category: 'beach',
    lat: -2.9667,
    lng: -39.5000,
    description: 'Praia cercada por coqueiros, dunas e mirantes naturais para fotos inesquecíveis.',
    image: 'https://www.viagensecaminhos.com/wp-content/uploads/2013/03/lagoinha-ce-696x470.jpg',
  },
  {
    id: 'cumbuco',
    name: 'Cumbuco',
    city: 'Caucaia',
    category: 'beach',
    lat: -3.6000,
    lng: -38.7333,
    description: 'Paraíso do kitesurf com lagoas, dunas e passeios de buggy.',
    image: 'https://cumbuco-brazil.com/wp-content/uploads/2019/04/slide3.jpg',
  },

  // ===== PASSEIOS =====
  {
    id: 'chapada-araripe',
    name: 'Chapada do Araripe',
    city: 'Crato',
    category: 'tour',
    lat: -7.4000,
    lng: -39.4000,
    description: 'Área de natureza exuberante com trilhas, sítios arqueológicos e paisagens do Cariri.',
    image: 'https://viagem.cnnbrasil.com.br/wp-content/uploads/sites/5/2022/07/1024px-Chapada_do_Araripe_Pernambuco.jpg?w=849&h=477&crop=0',
  },
  {
    id: 'serra-baturite',
    name: 'Serra de Baturité',
    city: 'Baturité',
    category: 'tour',
    lat: -4.3333,
    lng: -38.8833,
    description: 'Clima serrano, mata atlântica preservada e cidades charmosas no interior cearense.',
    image: 'https://mpce.mp.br/wp-content/uploads/2024/05/WhatsApp-Image-2024-05-02-at-17.32.33-1024x605.jpeg',
  },
];