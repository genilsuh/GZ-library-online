


const logo = document.getElementById("logo");
const musica = document.getElementById("musica");

logo.onclick = () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
};









// MODAL DO CADASTRO
const btnAbrir = document.getElementById('abriModal');
const modal = document.getElementById('modalCadastro');
const btnFechar = document.querySelector('.fecha-cadastro');
const form = document.getElementById('CartCadastro');

// Eventos para abrir e fechar
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

// Prevenir envio do formulário (para demonstração)
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Cadastro realizado com sucesso! (demonstração)');
    modal.style.display = 'none';
    form.reset();
  });
}

// --- CARREGAR LISTA DE LIVROS ---
const listaElemento = document.getElementById('bookList');
const modalViewer = document.getElementById('viewer');
const bookFrame = document.getElementById('bookFrame');
const closeBtn = document.getElementById('closeBtn');

// Função para criar link da imagem
function criarLinkImagem(id) {
  if (!id) return 'body/img/capa-padrao.jpg';
  return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
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
  document.body.style.overflow = 'hidden'; // Previne scroll da página principal
}

// Fechar modal
closeBtn.addEventListener('click', () => {
  bookFrame.src = '';
  modalViewer.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restaura scroll
});

// Fechar modal ao clicar fora
modalViewer.addEventListener('click', (event) => {
  if (event.target === modalViewer) {
    bookFrame.src = '';
    modalViewer.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Exportar funções para uso global
window.criarLinkImagem = criarLinkImagem;
window.criarLinkVisualizacao = criarLinkVisualizacao;
window.criarLinkDownload = criarLinkDownload;
window.abrirVisualizacao = abrirVisualizacao;

// Busca de livros
const barraPesquisa = document.getElementById('pesquisa-header');
const btnPesquisa = document.getElementById('btn-pesquisa');

function executarBusca() {
  const termo = barraPesquisa.value.toLowerCase().trim();
  const livros = document.querySelectorAll('.livro-card');
  let livrosEncontrados = 0;

  livros.forEach(livro => {
    const titulo = livro.querySelector('.titulo')?.textContent.toLowerCase() || '';
    const autor = livro.querySelector('.autor')?.textContent.toLowerCase() || '';

    if (titulo.includes(termo) || autor.includes(termo)) {
      livro.style.display = 'block';
      livrosEncontrados++;
    } else {
      livro.style.display = 'none';
    }
  });

  // Atualizar contador
  if (window.sistemaPaginacao && termo) {
    const livrosFiltrados = Array.from(livros).filter(livro => livro.style.display !== 'none');
    const quantidadeFiltrada = livrosFiltrados.length;
    const contadorFiltrado = document.getElementById('quantidadeFiltrada');
    if (contadorFiltrado) {
      contadorFiltrado.textContent = quantidadeFiltrada;
    }
  }
}

if (barraPesquisa) {
  barraPesquisa.addEventListener('input', executarBusca);
}

if (btnPesquisa) {
  btnPesquisa.addEventListener('click', executarBusca);
}

// --- CARROSSEL ---
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carrossel');
  const slides = document.querySelectorAll('.slide-banner');
  const prevBtn = document.querySelector('.ant-btn');
  const nextBtn = document.querySelector('.prox-btn');
  const indicators = document.querySelectorAll('.indicador');

  if (!carousel || slides.length === 0) return;

  // Configurações
  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval;
  const intervalTime = 5000; // 5 segundos

  // Função para atualizar o carrossel
  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Atualiza indicadores
    indicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add('ativo');
      } else {
        indicator.classList.remove('ativo');
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
    if (slideInterval) clearInterval(slideInterval);
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

  // Inicializar carrossel
  function initCarousel() {
    // Posiciona o carrossel
    updateCarousel();

    // Inicia a transição automática
    startAutoSlide();

    // Adiciona eventos aos botões
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    // Adiciona eventos aos indicadores
    indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        const slideIndex = parseInt(indicator.getAttribute('data-slide'));
        goToSlide(slideIndex);
        resetAutoSlide();
      });
    });

    // Pausar ao passar o mouse
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
  }

  // Inicializar
  initCarousel();
});