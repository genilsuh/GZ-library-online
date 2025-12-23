// ==================== CONFIGURAÇÃO DE ÁUDIO ====================
const logoBiblioteca = document.getElementById("logo");
const musicaFundo = document.getElementById("musica-fundo");

logoBiblioteca.onclick = () => {
  if (musicaFundo.paused) {
    musicaFundo.play();
  } else {
    musicaFundo.pause();
  }
};

// ==================== MODAL DE CADASTRO ====================
const botaoAbrirModal = document.getElementById('abrir-modal-cadastro');
const modalCadastro = document.getElementById('modal-cadastro');
const botaoFecharModal = document.querySelector('.fechar-modal');
const formularioCadastro = document.getElementById('formulario-cadastro');

// Abrir modal de cadastro
botaoAbrirModal.addEventListener('click', () => {
  modalCadastro.style.display = 'block';
});

// Fechar modal de cadastro
botaoFecharModal.addEventListener('click', () => {
  modalCadastro.style.display = 'none';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
  if (event.target === modalCadastro) {
    modalCadastro.style.display = 'none';
  }
});

// Processar formulário de cadastro
if (formularioCadastro) {
  formularioCadastro.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Cadastro realizado com sucesso! (demonstração)');
    modalCadastro.style.display = 'none';
    formularioCadastro.reset();
  });
}

// ==================== VISUALIZADOR DE LIVROS ====================
const visualizadorModal = document.getElementById('visualizador');
const frameLivro = document.getElementById('frame-livro');
const botaoFecharVisualizador = document.getElementById('fechar-visualizador');

// Funções para gerar URLs do Google Drive
function gerarLinkImagem(idImagem) {
  if (!idImagem) return 'body/img/capa-padrao.jpg';
  return `https://drive.google.com/thumbnail?id=${idImagem}&sz=w400`;
}

function gerarLinkVisualizacao(idLivro) {
  return `https://drive.google.com/file/d/${idLivro}/preview`;
}

function gerarLinkDownload(idLivro) {
  return `https://drive.google.com/uc?export=download&id=${idLivro}`;
}

// Abrir visualização do livro
function abrirVisualizacaoLivro(event, idLivro) {
  event.preventDefault();
  frameLivro.src = gerarLinkVisualizacao(idLivro);
  visualizadorModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Fechar visualizador
botaoFecharVisualizador.addEventListener('click', () => {
  frameLivro.src = '';
  visualizadorModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Fechar visualizador ao clicar fora
visualizadorModal.addEventListener('click', (event) => {
  if (event.target === visualizadorModal) {
    frameLivro.src = '';
    visualizadorModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ==================== SISTEMA DE BUSCA ====================
const campoPesquisa = document.getElementById('campo-pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');

function executarBuscaLivros() {
  const termoBusca = campoPesquisa.value.toLowerCase().trim();
  const cardsLivros = document.querySelectorAll('.card-livro');
  let livrosEncontrados = 0;

  cardsLivros.forEach(card => {
    const titulo = card.querySelector('.titulo-livro')?.textContent.toLowerCase() || '';
    const autor = card.querySelector('.autor-livro')?.textContent.toLowerCase() || '';

    if (titulo.includes(termoBusca) || autor.includes(termoBusca)) {
      card.style.display = 'block';
      livrosEncontrados++;
    } else {
      card.style.display = 'none';
    }
  });

  // Atualizar contador se houver sistema de paginação
  if (window.sistemaPaginacao && termoBusca) {
    const livrosFiltrados = Array.from(cardsLivros).filter(card => card.style.display !== 'none');
    const quantidadeFiltrada = livrosFiltrados.length;
    const contadorFiltrado = document.getElementById('quantidade-filtrada');

    if (contadorFiltrado) {
      contadorFiltrado.textContent = quantidadeFiltrada;
    }
  }
}

// Event listeners para busca
if (campoPesquisa) {
  campoPesquisa.addEventListener('input', executarBuscaLivros);
}

if (botaoPesquisa) {
  botaoPesquisa.addEventListener('click', executarBuscaLivros);
}

// ==================== CARROSSEL ====================
document.addEventListener('DOMContentLoaded', () => {
  const carrossel = document.querySelector('.carrossel-banners');
  const slides = document.querySelectorAll('.slide-banner');
  const botaoAnterior = document.querySelector('.botao-anterior');
  const botaoProximo = document.querySelector('.botao-proximo');
  const indicadores = document.querySelectorAll('.indicador');

  if (!carrossel || slides.length === 0) return;

  // Configurações do carrossel
  let slideAtual = 0;
  const totalSlides = slides.length;
  let intervaloCarrossel;
  const tempoIntervalo = 5000; // 5 segundos

  // Atualizar posição do carrossel
  function atualizarCarrossel() {
    carrossel.style.transform = `translateX(-${slideAtual * 100}%)`;

    // Atualizar indicadores
    indicadores.forEach((indicador, indice) => {
      if (indice === slideAtual) {
        indicador.classList.add('ativo');
      } else {
        indicador.classList.remove('ativo');
      }
    });
  }

  // Avançar para próximo slide
  function proximoSlide() {
    slideAtual = (slideAtual + 1) % totalSlides;
    atualizarCarrossel();
  }

  // Voltar para slide anterior
  function slideAnterior() {
    slideAtual = (slideAtual - 1 + totalSlides) % totalSlides;
    atualizarCarrossel();
  }

  // Ir para slide específico
  function irParaSlide(indiceSlide) {
    slideAtual = indiceSlide;
    atualizarCarrossel();
  }

  // Iniciar transição automática
  function iniciarCarrosselAutomatico() {
    if (intervaloCarrossel) clearInterval(intervaloCarrossel);
    intervaloCarrossel = setInterval(proximoSlide, tempoIntervalo);
  }

  // Parar transição automática
  function pararCarrosselAutomatico() {
    clearInterval(intervaloCarrossel);
  }

  // Reiniciar transição automática
  function reiniciarCarrosselAutomatico() {
    pararCarrosselAutomatico();
    iniciarCarrosselAutomatico();
  }

  // Inicializar carrossel
  function inicializarCarrossel() {
    atualizarCarrossel();
    iniciarCarrosselAutomatico();

    // Eventos dos botões
    if (botaoAnterior) {
      botaoAnterior.addEventListener('click', () => {
        slideAnterior();
        reiniciarCarrosselAutomatico();
      });
    }

    if (botaoProximo) {
      botaoProximo.addEventListener('click', () => {
        proximoSlide();
        reiniciarCarrosselAutomatico();
      });
    }

    // Eventos dos indicadores
    indicadores.forEach(indicador => {
      indicador.addEventListener('click', () => {
        const indiceSlide = parseInt(indicador.getAttribute('data-slide'));
        irParaSlide(indiceSlide);
        reiniciarCarrosselAutomatico();
      });
    });

    // Pausar ao passar o mouse
    carrossel.addEventListener('mouseenter', pararCarrosselAutomatico);
    carrossel.addEventListener('mouseleave', iniciarCarrosselAutomatico);
  }

  inicializarCarrossel();
});

// ==================== EXPORTAR FUNÇÕES ====================
window.gerarLinkImagem = gerarLinkImagem;
window.gerarLinkVisualizacao = gerarLinkVisualizacao;
window.gerarLinkDownload = gerarLinkDownload;
window.abrirVisualizacaoLivro = abrirVisualizacaoLivro;