



//  MODAL DO CADASTRO
const btnAbrir = document.getElementById('abriModal');
const modal = document.getElementById('modalCadastro');
const btnFechar = document.querySelector('.fecha-cadastro');
const form = document.getElementById('CartCadastro');

// COISOS QUE FAZEM ABRIE E FECHAR
btnAbrir.addEventListener('click', () => {
  modal.style.display = 'block';
});

btnFechar.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

















// --- CARREGAR LISTA DE LIVROS ---
const listaElemento = document.getElementById('bookList');
const modalViewer = document.getElementById('viewer');
const bookFrame = document.getElementById('bookFrame');
const closeBtn = document.getElementById('closeBtn');

// funcao da capa do livro q n queria dar crt essa desgraçaaaaa😪😭😭😭😭😭!!!!!!!!!
function criarLinkImagem(id) {
  if (!id) return 'body/img/capa-padrao.jpg';
  const formatos = [
    // tp1 - coiso Thumbnail
    `https://drive.google.com/thumbnail?id=${id}&sz=w400`,
    // tp2 - coiso de visu
    `https://drive.google.com/uc?export=view&id=${id}`,
    // tp3 - coiso de dowlod 
    `https://drive.google.com/uc?export=download&id=${id}`,
  ];
  return formatos[0];
}


// Funções para criar URLs
function criarLinkVisualizacao(id) {
  return `https://drive.google.com/file/d/${id}/preview`;
}
function criarLinkDownload(id) {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}


// Abrir visualização do livro
function abrirVisualizacao(event, livroId) {
  event.preventDefault();
  bookFrame.src = criarLinkVisualizacao(livroId);
  modalViewer.style.display = 'flex';
}

// Fechar modal
closeBtn.addEventListener('click', () => {
  bookFrame.src = '';
  modalViewer.style.display = 'none';
});

// Fechar modal ao clicar fora
modalViewer.addEventListener('click', (event) => {
  if (event.target === modalViewer) {
    bookFrame.src = '';
    modalViewer.style.display = 'none';
  }
});

// FUNÇÃO PARA CARREGAR LIVROS DO d.js
function carregarLivrosDoJS() {
  // Verifica se a variável 'livros' foi carregada do d.js
  if (typeof livros !== 'undefined' && Array.isArray(livros)) {
    // Usa os dados diretamente da variável global 'livros'
    if (livros.length === 0) {
      listaElemento.innerHTML = '<p class="sem-livros">Nenhum livro disponível no momento.</p>';
      return;
    }

    livros.forEach(livro => {
      const livroElemento = document.createElement('div');
      livroElemento.className = 'livro-card';

      // Usar a capa do Google Drive se disponível
      const imagemCapa = livro.capa ? criarLinkImagem(livro.capa) : 'body/img/capa-padrao.jpg';

      livroElemento.innerHTML = `
        <div class="capa-container">
          <img src="${imagemCapa}" 
               alt="Capa do livro: ${livro.titulo}" 
               class="capa"
               onerror="this.src='body/img/capa-padrao.jpg'">
        </div>
        <div class="info-livro">
          <h3 class="titulo">${livro.titulo}</h3>
          <div class="autor">${livro.autor}</div>
          <p class="descricao">${livro.descricao}</p>
          
          <div class="acoes-livro">
            <button class="btn-abrir" 
                    onclick="abrirVisualizacao(event, '${livro.link}')">
              📖 Ler Online
            </button>
            <a href="${criarLinkDownload(livro.link)}" 
               class="btn-download" 
               target="_blank"
               download>
              ⬇️ Download
            </a>
            <a href="https://drive.google.com/file/d/${livro.link}/view" 
               class="btn-drive" 
               target="_blank">
              🔗 Abrir no Drive
            </a>
          </div>
        </div>
      `;

      listaElemento.appendChild(livroElemento);
    });

    console.log(`✅ Carregados ${livros.length} livros do d.js`);
  } else {
    // Fallback caso d.js não tenha carregado
    console.error('❌ Variável "livros" não encontrada no d.js');
    listaElemento.innerHTML = `
      <div class="erro-carregamento">
        <p>❌ Não foi possível carregar os livros.</p>
        <p>Erro: Dados não disponíveis</p>
        <p><small>Verifique se o arquivo d.js existe e contém a variável "livros"</small></p>
      </div>
    `;
  }
}



// Modificar a função de carregamento para não renderizar automaticamente
function inicializarSistema() {
  // Aguardar o carregamento do filtroGenero
  if (typeof filtroGenero === 'undefined') {
    setTimeout(inicializarSistema, 100);
    return;
  }

  // O sistema de filtros agora cuida da renderização
  console.log('✅ Sistema de biblioteca inicializado');
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarSistema);
} else {
  inicializarSistema();
}


// Busca de livros
const barraPesquisa = document.getElementById('pesquisa-header');
if (barraPesquisa) {
  barraPesquisa.addEventListener('input', function () {
    const termo = this.value.toLowerCase();
    const livros = document.querySelectorAll('.livro-card');

    livros.forEach(livro => {
      const titulo = livro.querySelector('.titulo').textContent.toLowerCase();
      const autor = livro.querySelector('.autor').textContent.toLowerCase();

      if (titulo.includes(termo) || autor.includes(termo)) {
        livro.style.display = 'block';
      } else {
        livro.style.display = 'none';
      }
    });
  });
}


// Elementos do DOM
const carousel = document.querySelector('.carrossel');
const slides = document.querySelectorAll('.slide-banner');
const prevBtn = document.querySelector('.ant-btn');
const nextBtn = document.querySelector('.prox-btn');
const indicators = document.querySelectorAll('.indicador');

// Configurações
let currentSlide = 0;
const totalSlides = slides.length;
let slideInterval;
const intervalTime = 5000; // 5 segundos

// Função para inicializar o carrossel
function initCarousel() {
  // Posiciona o carrossel no slide atual
  updateCarousel();

  // Inicia a transição automática
  startAutoSlide();

  // Adiciona eventos aos botões
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  // Adiciona eventos aos indicadores
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const slideIndex = parseInt(indicator.getAttribute('data-slide'));
      goToSlide(slideIndex);
      resetAutoSlide();
    });
  });

  // Adiciona suporte a teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoSlide();
    } else if (e.key === ' ') {
      // Espaço pausa/continua
      if (!isPaused) {
        stopAutoSlide();
        pauseControl.textContent = "Continuar";
        isPaused = true;
      } else {
        startAutoSlide();
        pauseControl.textContent = "Pausar";
        isPaused = false;
      }
    }
  });
}

// Função para atualizar a posição do carrossel
function updateCarousel() {
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Atualiza indicadores
  indicators.forEach((indicator, index) => {
    if (index === currentSlide) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Função para ir para o próximo slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

// Função para ir para o slide anterior
function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

// Função para ir para um slide específico
function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateCarousel();
}

// Função para iniciar a transição automática
function startAutoSlide() {
  slideInterval = setInterval(nextSlide, intervalTime);
}

// Função para parar a transição automática
function stopAutoSlide() {
  clearInterval(slideInterval);
}

// Função para reiniciar a transição automática
function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

// Inicializa o carrossel quando a página carrega
document.addEventListener('DOMContentLoaded', initCarousel);