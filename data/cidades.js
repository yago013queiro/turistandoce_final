/* ==============================
   DADOS — Cidades do Ceará
   ============================== */

const CIDADES = [
  {
    id: 1,
    nome: "Jericoacoara",
    regiao: "Litoral Oeste",
    imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Anderps_067.JPG/960px-Anderps_067.JPG",
    descricao: "Vila encantadora com dunas, lagoas cristalinas e um pôr do sol inesquecível na Duna do Pôr do Sol.",
    tags: ["Praia", "Dunas", "Lagoas", "Pôr do Sol", "Natureza"],
    galeria: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/86/83/5c/img-20150825-132219527.jpg?w=1000&h=-1&s=1",
      "https://www.viagenscinematograficas.com.br/wp-content/uploads/2018/11/Jericoacoara-Pedra-Furada-990x557.jpg",
      "https://www.aeroportoguarulhos.net/wp-content/uploads/2016/10/ceara5-lagoa-jeri-e1477596395788.jpg",
      "https://www.viagenscinematograficas.com.br/wp-content/uploads/2018/09/Jericoacoara-Ceara-O-que-fazer-11.jpg",
      "https://www.viagenscinematograficas.com.br/wp-content/uploads/2018/09/Jericoacoara-Ceara-O-que-fazer-12.jpg",
      "https://blog.tourfacil.com.br/wp-content/uploads/2025/07/As-ruas-da-Vila-de-Jericoacoara-no-Ceara-sao-de-areia.jpg",
      "https://jericoacoaraceara.com.br/wp-content/uploads/2025/03/jeri73.png",
    ]
  },
  {
    id: 2,
    nome: "Canoa Quebrada",
    regiao: "Litoral Leste",
    imagem: "https://revistaoeste.com/oestegeral/wp-content/uploads/2025/09/canoa-quebrada-1-1-750x375.jpg",
    descricao: "Falésias coloridas, águas mornas e a famosa lua e estrela esculpidas na rocha.",
    tags: ["Praia", "Falésias", "Boemia", "Cultural"],
    galeria: [
      "https://www.viagenscinematograficas.com.br/wp-content/uploads/2022/12/Canoa-Quebrada-O-que-Fazer-Ceara-8.jpg",
      "https://brasiltropical.com.br/wp-content/uploads/2017/05/canoa_quebrada_dsc_0754-1024x680.jpg",
      "https://i0.wp.com/blog.bonitour.com.br/wp-content/uploads/2023/07/2.-Praia-Canoa-Quebrada-Estado-do-Ceara-Creditos_-Phaelnogueira-Getty-Images-Pro-1024x545.jpg?resize=1024%2C545",
    ]
  },
  {
    id: 3,
    nome: "Fortaleza",
    regiao: "Capital",
    imagem: "https://gastronomiasocial.org.br/wp-content/uploads/elementor/thumbs/fortaleza-ceara-edit-1-qmnnh4jnpheds8ur2fwz73edy1pvrfojsg9019zkvk.jpg",
    descricao: "Capital vibrante com praias urbanas, vida noturna agitada e rica cultura nordestina.",
    tags: ["Praia", "Urbano", "Gastronomia", "Vida Noturna", "Cultural", "Histórico"],
    galeria: [
      "https://3ad77b72.delivery.rocketcdn.me/wp-content/uploads/2013/01/Fortaleza-a-capital-do-Ceara-800x450.webp",
      "https://www.cvc.com.br/dicas-de-viagem/wp-content/uploads/2019/02/FOrtaleza-praias-topo_1100655731.jpg",
      "https://images.trvl-media.com/place/1242/78ac264e-5b2d-4850-a0ee-57a25ca7ef86.jpg",
      "https://images.trvl-media.com/place/6183207/bfc74025-76c8-4563-8907-5b64d4b5285c.jpg",
      "https://images.trvl-media.com/place/6186475/8b526405-04df-455b-82c9-256de481fe05.jpg",
      "https://images.trvl-media.com/place/1242/52d03154-ed7c-4b7a-98fa-0d54b05a37eb.jpg",
      "https://images.trvl-media.com/place/1242/ecb78542-7b96-4fe3-8dea-11a03b6cf680.jpg",
      "https://www.viagensecaminhos.com/wp-content/uploads/2013/03/o-que-fazer-em-fortaleza-jardim-japones.jpg",
    ]
  },
  {
    id: 4,
    nome: "Guaramiranga",
    regiao: "Serra",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJvYJJ423S2JKRsnbWY6P7tygqsU4S17XsXiJiU9e_kQ&s=10",
    descricao: "Refúgio na serra com clima ameno, cachoeiras, trilhas ecológicas e o famoso Festival de Jazz.",
    tags: ["Serra", "Trilhas", "Cachoeiras", "Jazz", "Refúgio"],
    galeria: [
      "https://gastronomiasocial.org.br/wp-content/uploads/elementor/thumbs/Guaramiranga-2-qr5s0gzas9gtk0lb0yf5s7vp2txc091dyuqpv1vd68.webp",
      "https://guaramiranga.com.br/wp-content/uploads/2025/11/20251021_2105531-1024x576.jpg",
      "https://guaramiranga.com.br/wp-content/uploads/2025/11/casa-guaramiranga-verdelandia-004-14-fotos.jpg",
      "https://guaramiranga.com.br/wp-content/uploads/2025/05/20250507_0852341-1024x683.jpg",
    ]
  },
  {
    id: 5,
    nome: "Cumbuco",
    regiao: "Litoral Oeste",
    imagem: "https://viagemeturismo.abril.com.br/wp-content/uploads/2016/12/foto-abre-01-copy-0u.jpg",
    descricao: "Paraíso do kitesurf com ventos constantes, dunas e lagoas de água doce.",
    tags: ["Praia", "Kitesurf", "Dunas", "Esportes", "Aventura"],
    galeria: [
      "https://viagemeturismo.abril.com.br/wp-content/uploads/2016/12/foto-abre-01-copy-0u.jpg",
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/O_que_Fazer_na_Praia_do_Cumbuco-1199x630.jpg.webp",
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/1-Turismo-de-Natureza_Praia_do_Cumbuco.jpg.webp",
      "https://turismodenatureza.com.br/wp-content/uploads/2024/07/7-Alchymist-Lagoa-Encantada.webp",
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2024/07/9-Beach-club-cumbuco-1024x1024.jpg.webp"

    ]
  },
  {
    id: 6,
    nome: "Beberibe",
    regiao: "Litoral Leste",
    imagem: "https://www.viagensecaminhos.com/wp-content/uploads/2013/02/praia-morro-branco-ceara-696x392.jpg",
    descricao: "Labirinto de falésias multicoloridas e praias tranquilas perfeitas para relaxar.",
    tags: ["Praia", "Falésias", "Relaxamento", "Natureza"],
    galeria: [
      "https://www.segueviagem.com.br/wp-content/uploads/2021/05/Praia-de-Morro-Branco-Beberibe-Ceara-Credito-editorial-Ticiana-Giehl_shutterstock_1745720165-768x512.jpg",
      "https://www.segueviagem.com.br/wp-content/uploads/2021/05/Praia-das-Fontes-Beberibe-Ceara-shutterstock_5049064.jpg",
      "https://diariodonordeste.verdesmares.com.br/image/contentid/policy:7.4514412:1618492539/mirante.webp?f=default&$p$f=aaf29bc",
      "https://diariodonordeste.verdesmares.com.br/image/contentid/policy:7.4514415:1618492916/casa-da-novela-final-feliz.webp?f=default&$p$f=6f1f1a7"
    ]
  },
  {
    id: 7,
    nome: "Chapada do Araripe",
    regiao: "Cariri",
    imagem: "https://viagem.cnnbrasil.com.br/wp-content/uploads/sites/5/2022/07/1024px-Chapada_do_Araripe_Pernambuco.jpg?w=849&h=477&crop=0",
    descricao: "Reserva natural com sítios paleontológicos, trilhas e nascentes de água cristalina.",
    tags: ["Natureza", "Trilhas", "Paleontologia", "Aventura"],
    galeria: [
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2023/03/o-que-fazer-na-chapada-do-araripe-1102x630.jpg.webp",
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2023/03/1-Geossitio-Colina-do-Horto-1024x533.jpg.webp",
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2023/03/3-cachoeira_de_missao_velha_ce.jpg.webp",
      "https://turismodenatureza.com.br/wp-content/webp-express/webp-images/uploads/2023/03/6-Geopark-Araripe-1024x682.jpg.webp"
    ]
  },
  {
    id: 8,
    nome: "Lagoinha",
    regiao: "Litoral Oeste",
    imagem: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/5a/1a/07/cartao-postal.jpg?w=1200&h=1200&s=1",
    descricao: "Praia paradisíaca com coqueirais, águas calmas e visual deslumbrante ao entardecer.",
    tags: ["Praia", "Coqueiros", "Relaxamento", "Pôr do Sol"],
    galeria: [
      "https://www.viagensecaminhos.com/wp-content/uploads/2013/03/lagoinha-ce-696x470.jpg",
      "https://deferiasnoceara.com.br/wp-content/uploads/2021/08/De-Ferias-no-Ceara-Lagoinha-1.jpg",
      "https://www.odiariodeumaviajante.com.br/wp-content/uploads/2021/10/Lagoinha-CE-1024x576.jpeg",
      "https://viagemeturismo.abril.com.br/wp-content/uploads/2016/12/22-e1485876206802.jpg"
    ]
  }
];
