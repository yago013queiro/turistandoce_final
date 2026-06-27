/* ============================================================
   TURISTANDO CE — MÓDULO EXPERIÊNCIAS
   Catálogo, filtros e renderização de experiências.
   ============================================================ */

(function () {
  let paginaExperienciasInicializada = false;
// Criação de experiencias
  const EXPERIENCIAS = [
    {
      id: 1,
      slug: 'buggy-dunas-jeri',
      cidade: 'Jericoacoara',
      titulo: 'Buggy pelas Dunas de Jericoacoara',
      categoria: 'Aventura',
      subcategoria: 'Passeio guiado',
      descricaoCurta: 'Uma rota clássica com emoção, paradas fotográficas e lagoas cristalinas.',
      descricao: 'Experiência completa pelas dunas de Jeri com motorista credenciado, trilha leve e paradas em pontos icônicos da região para banho, fotos e contemplação do pôr do sol.',
      precoMin: 180,
      precoMax: 260,
      precoFormatado: 'R$ 180 - R$ 260',
      duracao: '3h',
      nivelDificuldade: 'Fácil',
      avaliacao: 4.9,
      totalAvaliacoes: 182,
      empresaPrincipal: 'Jeri Tours',
      empresas: [
        {
          nome: 'Jeri Tours',
          whatsapp: '85999990001',
          site: 'https://example.com/jeri-tours',
          nota: 4.9
        }
      ],
      banner: 'https://media-cdn.tripadvisor.com/media/photo-s/13/90/0e/49/buggy-da-jeri-ferias.jpg',
      imagens: [
        { url: 'https://deferiasnoceara.com.br/wp-content/uploads/2021/10/De-Ferias-no-Ceara-Passeio-de-Buggy-Leste-Jericoacoara-3.jpg', alt: 'Fotografia de buggy na praia' },
        { url: 'https://www.maladeaventuras.com/wp-content/uploads/2014/09/DSC_0309-001.jpg', alt: 'Paisagem de praia no Ceará' },
        { url: 'https://i0.wp.com/blog.bonitour.com.br/wp-content/uploads/2023/03/Passeio-de-buggy-pelas-dunas-de-Jericoacoara.jpg', alt: 'Passeio ao ar livre' }
      ],
      imagem: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/10/2e/d9/jericoacoara.jpg?w=1400&h=-1&s=1',
      localizacao: {
        cidade: 'Jericoacoara',
        pontoPartida: 'Praça Central',
        endereco: 'Jericoacoara, Jijoca de Jericoacoara - CE',
        lat: -2.7956,
        lng: -40.5167,
        mapaId: 'exp-jeri-buggy'
      },
      cronograma: [
        { hora: '08:00', titulo: 'Saída', descricao: 'Encontro com a equipe e briefing rápido.' },
        { hora: '09:00', titulo: 'Primeira parada', descricao: 'Dunas e mirantes para fotos.' },
        { hora: '10:30', titulo: 'Lagoa', descricao: 'Tempo livre para banho e descanso.' },
        { hora: '11:30', titulo: 'Retorno', descricao: 'Volta com parada opcional para lanche.' }
      ],
      inclusos: ['Guia local', 'Motorista credenciado', 'Água mineral'],
      naoInclusos: ['Alimentação', 'Taxas extras'],
      dicas: ['Leve protetor solar', 'Use roupa leve', 'Prefira tênis ou sandália firme'],
      tags: ['Aventura', 'Natureza', 'Família', 'Dunas'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: true,
        petFriendly: false
      },
      idadeMinima: 6,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Cancelamento grátis até 24h antes',
      destaque: true,
      status: 'ativo'
    },
    {
      id: 2,
      slug: 'kitesurf-cumbuco',
      cidade: 'Cumbuco',
      titulo: 'Kitesurf Experience no Cumbuco',
      categoria: 'Esporte',
      subcategoria: 'Aula + prática',
      descricaoCurta: 'Aula para iniciantes com vento constante, instrutor e equipamento.',
      descricao: 'Experiência ideal para quem quer conhecer o kitesurf com segurança, acompanhamento e estrutura de apoio na praia do Cumbuco.',
      precoMin: 220,
      precoMax: 340,
      precoFormatado: 'R$ 220 - R$ 340',
      duracao: '4h',
      nivelDificuldade: 'Médio',
      avaliacao: 4.8,
      totalAvaliacoes: 143,
      empresaPrincipal: 'Cumbuco Kite School',
      empresas: [
        {
          nome: 'Cumbuco Kite School',
          whatsapp: '85999990002',
          site: 'https://example.com/cumbuco-kite',
          nota: 4.8
        }
      ],
      banner: 'https://theindianface.com/cdn/shop/articles/Kitesurf--historia-y-evolucion.jpg?v=1616068363',
      imagens: [
        { url: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=1200&h=800&fit=crop', alt: 'Kitesurf no Cumbuco' },
        { url: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1200&h=800&fit=crop', alt: 'Esporte na praia' }
      ],
      imagem: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=1200&h=800&fit=crop',
      localizacao: {
        cidade: 'Cumbuco',
        pontoPartida: 'Beira-mar',
        endereco: 'Praia do Cumbuco - CE',
        lat: -3.6150,
        lng: -38.7350,
        mapaId: 'exp-cumbuco-kite'
      },
      cronograma: [
        { hora: '09:00', titulo: 'Recepção', descricao: 'Chegada e entrega do equipamento.' },
        { hora: '09:30', titulo: 'Aula técnica', descricao: 'Vento, controle da pipa e segurança.' },
        { hora: '11:00', titulo: 'Prática na água', descricao: 'Primeiros movimentos com supervisão.' }
      ],
      inclusos: ['Prancha', 'Pipa', 'Colete', 'Instrutor'],
      naoInclusos: ['Fotos profissionais', 'Alimentação'],
      dicas: ['Cheque a previsão do vento', 'Leve roupa de banho', 'Evite levar objetos de valor'],
      tags: ['Aventura', 'Praia', 'Esporte', 'Acessível'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: false,
        petFriendly: false
      },
      idadeMinima: 12,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Remarcação gratuita em caso de vento muito forte',
      destaque: true,
      status: 'ativo'
    },
    {
      id: 3,
      slug: 'bike-tour-beira-mar',
      cidade: 'Fortaleza',
      titulo: 'Bike Tour pela Beira-Mar',
      categoria: 'Urbano',
      subcategoria: 'Passeio guiado',
      descricaoCurta: 'Percurso leve pela orla com paradas para fotos e história local.',
      descricao: 'Passeio de bicicleta pela Beira-Mar com guia, pontos gastronômicos e leitura da paisagem urbana de Fortaleza de forma descontraída.',
      precoMin: 95,
      precoMax: 150,
      precoFormatado: 'R$ 95 - R$ 150',
      duracao: '2h30',
      nivelDificuldade: 'Fácil',
      avaliacao: 4.7,
      totalAvaliacoes: 88,
      empresaPrincipal: 'Fortaleza Bike Tour',
      empresas: [
        {
          nome: 'Fortaleza Bike Tour',
          whatsapp: '85999990003',
          site: 'https://example.com/fortaleza-bike',
          nota: 4.7
        }
      ],
      banner: 'https://www.fortaleza.ce.gov.br/images/images2/AMC/estao_jangurussu.jpeg',
      imagem: 'https://www.fortaleza.ce.gov.br/images/images2/AMC/estao_jangurussu.jpeg',
      localizacao: {
        cidade: 'Fortaleza',
        pontoPartida: 'Avenida Beira Mar',
        endereco: 'Beira Mar, Fortaleza - CE',
        lat: -3.7179,
        lng: -38.4968,
        mapaId: 'exp-fortaleza-bike'
      },
      cronograma: [
        { hora: '07:00', titulo: 'Encontro', descricao: 'Ajuste da bike e apresentação do trajeto.' },
        { hora: '07:20', titulo: 'Pedalada inicial', descricao: 'Caminho leve pela orla.' },
        { hora: '08:10', titulo: 'Paradas', descricao: 'Fotos e curiosidades culturais.' },
        { hora: '09:30', titulo: 'Encerramento', descricao: 'Retorno ao ponto de partida.' }
      ],
      inclusos: ['Bicicleta', 'Capacete', 'Guia'],
      naoInclusos: ['Hidratação extra', 'Seguro adicional'],
      dicas: ['Leve água', 'Use protetor solar', 'Prefira roupas leves'],
      tags: ['Urbano', 'Família', 'Cultura', 'Acessível'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: true,
        petFriendly: false
      },
      idadeMinima: 8,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Cancelamento gratuito até 12h antes',
      destaque: false,
      status: 'ativo'
    },
    {
      id: 4,
      slug: 'trilha-cachoeiras-guaramiranga',
      cidade: 'Guaramiranga',
      titulo: 'Trilha das Cachoeiras de Guaramiranga',
      categoria: 'Natureza',
      subcategoria: 'Ecoturismo',
      descricaoCurta: 'Trilha leve com paisagens serranas, água fresca e pausa para café regional.',
      descricao: 'Experiência pensada para quem quer viver a serra com calma: trilha guiada, cachoeiras, paradas fotográficas e final com café regional.',
      precoMin: 120,
      precoMax: 190,
      precoFormatado: 'R$ 120 - R$ 190',
      duracao: '5h',
      nivelDificuldade: 'Médio',
      avaliacao: 4.9,
      totalAvaliacoes: 97,
      empresaPrincipal: 'Serra Viva',
      empresas: [
        {
          nome: 'Serra Viva',
          whatsapp: '85999990004',
          site: 'https://example.com/serra-viva',
          nota: 4.9
        }
      ],
      banner: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/b4/27/c0/parque-das-cachoeiras.jpg?w=1200&h=-1&s=1',
      imagens: [
      ],
      imagem: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/b4/27/c0/parque-das-cachoeiras.jpg?w=1200&h=-1&s=1',
      localizacao: {
        cidade: 'Guaramiranga',
        pontoPartida: 'Centro',
        endereco: 'Guaramiranga - CE',
        lat: -4.2620,
        lng: -38.9320,
        mapaId: 'exp-guaramiranga-trilha'
      },
      cronograma: [
        { hora: '08:00', titulo: 'Saída do centro', descricao: 'Briefing e preparação do grupo.' },
        { hora: '09:00', titulo: 'Trilha principal', descricao: 'Caminhada em meio à mata e mirantes.' },
        { hora: '11:00', titulo: 'Cachoeira', descricao: 'Parada para banho e fotos.' },
        { hora: '12:30', titulo: 'Café regional', descricao: 'Encerramento com sabores da serra.' }
      ],
      inclusos: ['Guia', 'Café regional', 'Seguro'],
      naoInclusos: ['Almoço', 'Transporte'],
      dicas: ['Leve tênis fechado', 'Traga capa de chuva na serra', 'Use repelente'],
      tags: ['Natureza', 'Serra', 'Família', 'Aventura'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: true,
        petFriendly: true
      },
      idadeMinima: 10,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Reagendamento gratuito em caso de chuva forte',
      destaque: true,
      status: 'ativo'
    },
    {
      id: 5,
      slug: 'buggy-falesias-canoa',
      cidade: 'Canoa Quebrada',
      titulo: 'Buggy nas Falésias de Canoa Quebrada',
      categoria: 'Aventura',
      subcategoria: 'Passeio panorâmico',
      descricaoCurta: 'Falésias coloridas, praia e parada na famosa lua e estrela.',
      descricao: 'Passeio panorâmico com emoção, paisagens incríveis e tempo livre para curtir a praia e as falésias de Canoa Quebrada.',
      precoMin: 160,
      precoMax: 230,
      precoFormatado: 'R$ 160 - R$ 230',
      duracao: '3h',
      nivelDificuldade: 'Fácil',
      avaliacao: 4.8,
      totalAvaliacoes: 104,
      empresaPrincipal: 'Canoa Adventure',
      empresas: [
        {
          nome: 'Canoa Adventure',
          whatsapp: '85999990005',
          site: 'https://example.com/canoa-adventure',
          nota: 4.8
        }
      ],
      banner: 'https://imagedelivery.net/EafvxYlk8cSUsWEWsetEdQ/b60e212a-28bf-4b62-e8ae-cbc38e115600/w=900',
      imagem: 'https://imagedelivery.net/EafvxYlk8cSUsWEWsetEdQ/b60e212a-28bf-4b62-e8ae-cbc38e115600/w=900',
      localizacao: {
        cidade: 'Canoa Quebrada',
        pontoPartida: 'Rua Dragão do Mar',
        endereco: 'Canoa Quebrada, Aracati - CE',
        lat: -4.5240,
        lng: -37.7020,
        mapaId: 'exp-canoa-buggy'
      },
      cronograma: [
        { hora: '08:30', titulo: 'Saída', descricao: 'Encontro com a equipe e orientações.' },
        { hora: '09:20', titulo: 'Falésias', descricao: 'Paradas para fotos e contemplação.' },
        { hora: '10:30', titulo: 'Praia', descricao: 'Tempo livre para banho e descanso.' }
      ],
      inclusos: ['Buggy', 'Motorista', 'Paradas fotográficas'],
      naoInclusos: ['Bebidas', 'Almoço'],
      dicas: ['Leve óculos escuros', 'Proteja o celular da areia', 'Confirme o horário do pôr do sol'],
      tags: ['Aventura', 'Praia', 'Casal', 'Família'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: true,
        petFriendly: false
      },
      idadeMinima: 5,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Cancelamento gratuito até 24h antes',
      destaque: false,
      status: 'ativo'
    },
    {
      id: 6,
      slug: 'morro-branco-rpqs',
      cidade: 'Beberibe',
      titulo: 'Experiência Morro Branco + Praia das Fontes',
      categoria: 'Natureza',
      subcategoria: 'Dia inteiro',
      descricaoCurta: 'Um clássico do litoral leste com falésias, labirinto e água cristalina.',
      descricao: 'Dia inteiro de passeio passando pelas formações de Morro Branco, falésias, labirinto das falésias e Praia das Fontes, com guia e paradas para banho.',
      precoMin: 210,
      precoMax: 320,
      precoFormatado: 'R$ 210 - R$ 320',
      duracao: '6h',
      nivelDificuldade: 'Fácil',
      avaliacao: 4.8,
      totalAvaliacoes: 76,
      empresaPrincipal: 'Beberibe Experience',
      empresas: [
        {
          nome: 'Beberibe Experience',
          whatsapp: '85999990006',
          site: 'https://example.com/beberibe-experience',
          nota: 4.8
        }
      ],
      banner: 'https://www.escolhaviajar.com/wp-content/uploads/2021/08/morro-branco-piscina-dos-portugueses-1024x675.jpg',
      imagem: 'https://www.escolhaviajar.com/wp-content/uploads/2021/08/morro-branco-piscina-dos-portugueses-1024x675.jpg',
      localizacao: {
        cidade: 'Beberibe',
        pontoPartida: 'Centro',
        endereco: 'Beberibe - CE',
        lat: -4.1839,
        lng: -38.0792,
        mapaId: 'exp-beberibe-morro-branco'
      },
      cronograma: [
        { hora: '08:00', titulo: 'Saída', descricao: 'Partida com guia local.' },
        { hora: '09:30', titulo: 'Morro Branco', descricao: 'Falésias e labirinto natural.' },
        { hora: '11:30', titulo: 'Praia das Fontes', descricao: 'Banho e pausa para almoço.' }
      ],
      inclusos: ['Guia', 'Transporte', 'Seguro básico'],
      naoInclusos: ['Refeições', 'Souvenirs'],
      dicas: ['Leve dinheiro em espécie', 'Use chapéu', 'Tenha uma muda de roupa'],
      tags: ['Natureza', 'Praia', 'Família', 'Relaxamento'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: true,
        petFriendly: false
      },
      idadeMinima: 4,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Remarcação gratuita mediante aviso prévio',
      destaque: false,
      status: 'ativo'
    },
    {
      id: 7,
      slug: 'gastronomico-fortaleza',
      cidade: 'Fortaleza',
      titulo: 'Tour Gastronômico de Fortaleza',
      categoria: 'Gastronomia',
      subcategoria: 'Degustação guiada',
      descricaoCurta: 'Roteiro com sabores locais, história e paradas estratégicas.',
      descricao: 'Experiência para comer bem e conhecer histórias da cidade através dos sabores: tapioca, frutos do mar, sobremesas regionais e pontos tradicionais.',
      precoMin: 170,
      precoMax: 280,
      precoFormatado: 'R$ 170 - R$ 280',
      duracao: '4h',
      nivelDificuldade: 'Fácil',
      avaliacao: 4.9,
      totalAvaliacoes: 132,
      empresaPrincipal: 'Sabor de Fortaleza',
      empresas: [
        {
          nome: 'Sabor de Fortaleza',
          whatsapp: '85999990007',
          site: 'https://example.com/sabor-fortaleza',
          nota: 4.9
        }
      ],
      banner: 'https://gironacidade.com.br/wp-content/uploads/2022/10/WhatsApp-Image-2022-10-24-at-15.07.56.jpeg',
      imagem: 'https://gironacidade.com.br/wp-content/uploads/2022/10/WhatsApp-Image-2022-10-24-at-15.07.56.jpeg',
      localizacao: {
        cidade: 'Fortaleza',
        pontoPartida: 'Centro',
        endereco: 'Fortaleza - CE',
        lat: -3.7179,
        lng: -38.4968,
        mapaId: 'exp-fortaleza-gastronomico'
      },
      cronograma: [
        { hora: '15:00', titulo: 'Encontro', descricao: 'Começamos com contexto histórico e cultural.' },
        { hora: '16:00', titulo: 'Degustações', descricao: 'Paradas com pratos e bebidas regionais.' },
        { hora: '18:00', titulo: 'Encerramento', descricao: 'Finalização com sobremesa típica.' }
      ],
      inclusos: ['Degustações', 'Guia local', 'Água'],
      naoInclusos: ['Bebidas alcoólicas', 'Compras extras'],
      dicas: ['Vá com fome', 'Pergunte sobre ingredientes locais', 'Reserve com antecedência'],
      tags: ['Gastronomia', 'Urbano', 'Casal', 'Família'],
      acessibilidade: {
        cadeiraDeRodas: true,
        criancas: true,
        petFriendly: false
      },
      idadeMinima: 6,
      melhorHorario: 'Tarde',
      politicaCancelamento: 'Cancelamento gratuito até 12h antes',
      destaque: true,
      status: 'ativo'
    },
    {
      id: 8,
      slug: 'lagoinha-boat-experience',
      cidade: 'Lagoinha',
      titulo: 'Passeio de Barco em Lagoinha',
      categoria: 'Relaxamento',
      subcategoria: 'Passeio náutico',
      descricaoCurta: 'Caminho tranquilo entre coqueiros, mar calmo e visual de cartão-postal.',
      descricao: 'Experiência leve para curtir a praia de Lagoinha por outro ângulo: barco, paradas para fotos e tempo livre para banho em águas calmas.',
      precoMin: 140,
      precoMax: 220,
      precoFormatado: 'R$ 140 - R$ 220',
      duracao: '2h30',
      nivelDificuldade: 'Fácil',
      avaliacao: 4.7,
      totalAvaliacoes: 61,
      empresaPrincipal: 'Lagoinha Náutica',
      empresas: [
        {
          nome: 'Lagoinha Náutica',
          whatsapp: '85999990008',
          site: 'https://example.com/lagoinha-nautica',
          nota: 4.7
        }
      ],
      banner: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/d6/81/c9/praia-do-bonetinho.jpg?w=1200&h=900&s=1',
      imagem: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/d6/81/c9/praia-do-bonetinho.jpg?w=1200&h=900&s=1',
      localizacao: {
        cidade: 'Lagoinha',
        pontoPartida: 'Orla',
        endereco: 'Lagoinha - CE',
        lat: -3.0082,
        lng: -39.2415,
        mapaId: 'exp-lagoinha-barco'
      },
      cronograma: [
        { hora: '09:00', titulo: 'Embarque', descricao: 'Chegada e orientação de segurança.' },
        { hora: '09:30', titulo: 'Passeio', descricao: 'Navegação pela costa e paradas para fotos.' },
        { hora: '10:45', titulo: 'Banho de mar', descricao: 'Tempo livre em águas calmas.' }
      ],
      inclusos: ['Barco', 'Coletes', 'Guia'],
      naoInclusos: ['Alimentação', 'Transfer'],
      dicas: ['Leve toalha', 'Proteja o celular', 'Cheque a maré'],
      tags: ['Praia', 'Relaxamento', 'Família', 'Natureza'],
      acessibilidade: {
        cadeiraDeRodas: false,
        criancas: true,
        petFriendly: false
      },
      idadeMinima: 3,
      melhorHorario: 'Manhã',
      politicaCancelamento: 'Remarcação gratuita em caso de mau tempo',
      destaque: false,
      status: 'ativo'
    }
  ];

  // pesquisa

  function normalizarTexto(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function getImagemPrincipal(exp) {
    return exp.banner || exp.imagem || '';
  }

  function formatarPreco(exp) {
    if (exp.precoFormatado) return exp.precoFormatado;
    if (typeof exp.precoMin === 'number' && typeof exp.precoMax === 'number') {
      return `R$ ${exp.precoMin} - R$ ${exp.precoMax}`;
    }
    if (typeof exp.precoMin === 'number') return `A partir de R$ ${exp.precoMin}`;
    return 'Consulte valores';
  }

  function parseDuracao(duracao) {
    if (!duracao) return 0;
    const texto = String(duracao).toLowerCase();
    const horas = texto.match(/(\d+)\s*h(?:\s*(\d+))?/);
    if (horas) return (parseInt(horas[1], 10) * 60) + (parseInt(horas[2] || '0', 10));
    const minutos = texto.match(/(\d+)\s*min/);
    if (minutos) return parseInt(minutos[1], 10);
    return 0;
  }

  function getFiltrosAtivos() {
    const termo = document.getElementById('busca-experiencias')?.value || '';
    const cidade = document.getElementById('filtro-experiencia-cidade')?.value || 'todas';
    const categoria = document.getElementById('filtro-experiencia-categoria')?.value || 'todas';
    const precoMax = Number(document.getElementById('filtro-experiencia-preco')?.value || 1000);
    const duracao = document.getElementById('filtro-experiencia-duracao')?.value || 'todas';
    const avaliacao = Number(document.getElementById('filtro-experiencia-avaliacao')?.value || 0);
    const ordem = document.getElementById('filtro-experiencia-ordem')?.value || 'relevancia';

    return { termo, cidade, categoria, precoMax, duracao, avaliacao, ordem };
  }

  function filtrarDados(filtros) {
    const termo = normalizarTexto(filtros.termo);
    const tagsAtivas = Array.from(document.querySelectorAll('#tags-experiencias .filter-chip.active'))
      .map(btn => btn.dataset.tag);

    let resultados = EXPERIENCIAS.filter((exp) => {
      const matchTexto = !termo || [
        exp.titulo,
        exp.cidade,
        exp.categoria,
        exp.empresaPrincipal,
        ...(exp.tags || [])
      ].some(campo => normalizarTexto(campo).includes(termo));

      const matchCidade = filtros.cidade === 'todas' || exp.cidade === filtros.cidade;
      const matchCategoria = filtros.categoria === 'todas' || exp.categoria === filtros.categoria;
      const matchPreco = (exp.precoMin || 0) <= filtros.precoMax;
      const matchDuracao = filtros.duracao === 'todas' || getDurationBucket(exp.duracao) === filtros.duracao;
      const matchAvaliacao = (exp.avaliacao || 0) >= filtros.avaliacao;
      const matchTags = tagsAtivas.length === 0 || tagsAtivas.every(tag =>
        (exp.tags || []).some(item => normalizarTexto(item).includes(normalizarTexto(tag))) ||
        normalizarTexto(exp.categoria).includes(normalizarTexto(tag)) ||
        normalizarTexto(exp.descricao || '').includes(normalizarTexto(tag))
      );

      return matchTexto && matchCidade && matchCategoria && matchPreco && matchDuracao && matchAvaliacao && matchTags;
    });

    resultados.sort((a, b) => {
      switch (filtros.ordem) {
        case 'preco-menor':
          return (a.precoMin || 0) - (b.precoMin || 0);
        case 'preco-maior':
          return (b.precoMin || 0) - (a.precoMin || 0);
        case 'avaliacao-melhor':
          return (b.avaliacao || 0) - (a.avaliacao || 0);
        case 'duracao-menor':
          return parseDuracao(a.duracao) - parseDuracao(b.duracao);
        case 'duracao-maior':
          return parseDuracao(b.duracao) - parseDuracao(a.duracao);
        default:
          return (b.destaque === true) - (a.destaque === true) || (b.avaliacao || 0) - (a.avaliacao || 0);
      }
    });

    return resultados;
  }

  function getDurationBucket(duracao) {
    const minutos = parseDuracao(duracao);
    if (minutos <= 90) return 'curta';
    if (minutos <= 240) return 'media';
    return 'longa';
  }

  function renderTagChips() {
    const container = document.getElementById('tags-experiencias');
    if (!container) return;

    const tags = ['Aventura', 'Natureza', 'Família', 'Acessível', 'Gastronomia', 'Relaxamento', 'Urbano'];
    container.innerHTML = tags.map(tag => `
      <button type="button" class="filter-chip" data-tag="${tag}">${tag}</button>
    `).join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      btn.classList.toggle('active');
      aplicarFiltros();
    });
  }

  function renderExperienciasCards(container, lista, options = {}) {
    if (!container) return;

    const itens = Array.isArray(lista) ? lista : [];
    if (itens.length === 0) {
      container.innerHTML = `
        <div class="empty-state empty-state--compact">
          <i class="fa-solid fa-face-frown-open"></i>
          <h3>Nenhuma experiência encontrada</h3>
          <p>Tente ajustar os filtros ou buscar por outra cidade.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = itens.map((exp) => `
      <a href="detalhe.html?tipo=experience&id=${exp.id}" class="card card-clickable fade-in visible experience-card" style="display:block">
        <div class="card-img-wrap">
          <img class="card-img" src="${getImagemPrincipal(exp)}" alt="${exp.titulo}" loading="lazy">
          <span class="experience-badge">${exp.categoria}</span>
          <span class="experience-rating"><i class="fa-solid fa-star"></i> ${exp.avaliacao}</span>
        </div>
        <div class="card-body">
          <h3>${exp.titulo}</h3>
          <p>${exp.cidade} · ${exp.duracao} · ${exp.nivelDificuldade}</p>
          <div class="experience-meta">
            <span><i class="fa-solid fa-location-dot"></i> ${exp.cidade}</span>
            <span><i class="fa-regular fa-clock"></i> ${exp.duracao}</span>
          </div>
          <div class="experience-footer">
            <strong>${formatarPreco(exp)}</strong>
            <span class="btn-plan" style="padding:10px 16px;">Ver experiência</span>
          </div>
        </div>
      </a>
    `).join('');

    if (typeof iniciarObserver === 'function') {
      iniciarObserver();
    }
  }

  function renderHeaderCounts(resultados) {
    const total = document.getElementById('experiencias-total');
    const destaque = document.getElementById('experiencias-destaque-total');
    const cidades = new Set(resultados.map(item => item.cidade));
    const avaliadas = resultados.filter(item => item.avaliacao >= 4.8).length;

    if (total) total.textContent = resultados.length;
    if (destaque) destaque.textContent = avaliadas;

    const cidadesEl = document.getElementById('experiencias-cidades-total');
    if (cidadesEl) cidadesEl.textContent = cidades.size;
  }

  function aplicarFiltros() {
    const container = document.getElementById('grid-experiencias');
    if (!container) return;

    const filtros = getFiltrosAtivos();
    const resultados = filtrarDados(filtros);
    renderExperienciasCards(container, resultados);
    renderHeaderCounts(resultados);

    const meta = document.getElementById('experiencias-meta');
    if (meta) {
      meta.textContent = `${resultados.length} experiência(s) encontrada(s)`;
    }
  }

  function preencherSelects() {
    const selectCidade = document.getElementById('filtro-experiencia-cidade');
    const selectCategoria = document.getElementById('filtro-experiencia-categoria');

    if (selectCidade && typeof CIDADES !== 'undefined') {
      const cidades = [...new Set(EXPERIENCIAS.map(item => item.cidade))].sort();
      cidades.forEach(cidade => {
        const option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectCidade.appendChild(option);
      });
    }

    if (selectCategoria) {
      const categorias = [...new Set(EXPERIENCIAS.map(item => item.categoria))].sort();
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
      });
    }
  }

  function preencherFiltrosDaURL() {
    const params = new URLSearchParams(window.location.search);
    const cidade = params.get('cidade');
    const categoria = params.get('categoria');

    if (cidade) {
      const selectCidade = document.getElementById('filtro-experiencia-cidade');
      if (selectCidade) selectCidade.value = cidade;
    }

    if (categoria) {
      const selectCategoria = document.getElementById('filtro-experiencia-categoria');
      if (selectCategoria) selectCategoria.value = categoria;
    }
  }

  function inicializarPaginaExperiencias() {
    const pageGrid = document.getElementById('grid-experiencias');
    if (!pageGrid || paginaExperienciasInicializada) return;
    paginaExperienciasInicializada = true;

    preencherSelects();
    renderTagChips();
    preencherFiltrosDaURL();

    ['busca-experiencias', 'filtro-experiencia-cidade', 'filtro-experiencia-categoria', 'filtro-experiencia-duracao', 'filtro-experiencia-avaliacao', 'filtro-experiencia-ordem']
      .forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const eventName = el.tagName === 'INPUT' ? 'input' : 'change';
        el.addEventListener(eventName, aplicarFiltros);
      });

    const sliderPreco = document.getElementById('filtro-experiencia-preco');
    if (sliderPreco) {
      const atualizarLabel = () => {
        const label = document.getElementById('experiencia-preco-label');
        if (label) label.textContent = `Até R$ ${sliderPreco.value}`;
      };
      sliderPreco.addEventListener('input', () => {
        atualizarLabel();
        aplicarFiltros();
      });
      atualizarLabel();
    }

    aplicarFiltros();
    renderFeaturedBlocks();
  }

  function renderFeaturedBlocks() {
    const grid = document.getElementById('grid-experiencias-destaque');
    if (grid) {
      renderExperienciasCards(grid, EXPERIENCIAS.filter(exp => exp.destaque).slice(0, 3));
    }

    const homeGrid = document.getElementById('grid-experiencias-home');
    if (homeGrid) {
      renderExperienciasCards(homeGrid, EXPERIENCIAS.filter(exp => exp.destaque).slice(0, 3));
    }
  }

  window.EXPERIENCIAS = EXPERIENCIAS;
  window.renderExperienciasCards = renderExperienciasCards;
  window.inicializarPaginaExperiencias = inicializarPaginaExperiencias;

  document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedBlocks();
    if (document.getElementById('grid-experiencias') && !paginaExperienciasInicializada) {
      inicializarPaginaExperiencias();
    }
  });
})();
