// SISTEMA DE PAGINAÇÃO - 6 LIVROS POR PÁGINA

class SistemaPaginacao {
  constructor() {
    // Elementos DOM
    this.listaElemento = document.getElementById('bookList');
    this.paginacaoContainer = document.getElementById('paginacaoContainer');
    this.numerosPagina = document.getElementById('numerosPagina');
    this.btnAnterior = document.getElementById('paginaAnterior');
    this.btnProxima = document.getElementById('proximaPagina');

    // Configurações
    this.livrosPorPagina = 6;
    this.paginaAtual = 1;
    this.totalPaginas = 1;
    this.livrosFiltrados = [];
    this.livrosCompletos = [];
    this.estaInicializado = false;

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.inicializar());
    } else {
      this.inicializar();
    }
  }

  inicializar() {
    console.log('🔄 Inicializando sistema de paginação...');

    // Verificar se os elementos existem
    if (!this.paginacaoContainer) {
      console.error('❌ Container de paginação não encontrado');
      return;
    }

    // Adicionar event listeners aos botões
    this.adicionarEventListeners();

    // Inicialmente esconder a paginação
    this.paginacaoContainer.style.display = 'none';
    this.estaInicializado = true;

    console.log('✅ Sistema de paginação inicializado');

    // Configurar com livros se já estiverem disponíveis
    if (typeof livros !== 'undefined' && Array.isArray(livros) && livros.length > 0) {
      console.log('📚 Configurando paginação com', livros.length, 'livros');
      this.configurar(livros);
    }
  }

  adicionarEventListeners() {
    // Botão página anterior
    if (this.btnAnterior) {
      this.btnAnterior.addEventListener('click', () => {
        this.irParaPagina(this.paginaAtual - 1);
      });
    }

    // Botão próxima página
    if (this.btnProxima) {
      this.btnProxima.addEventListener('click', () => {
        this.irParaPagina(this.paginaAtual + 1);
      });
    }
  }

  // Configurar paginação com uma lista de livros
  configurar(livrosArray) {
    if (!Array.isArray(livrosArray)) {
      console.error('❌ Lista de livros inválida para paginação:', livrosArray);
      return;
    }

    console.log('⚙️ Configurando paginação com', livrosArray.length, 'livros');

    // Guardar a lista completa de livros
    this.livrosCompletos = [...livrosArray];
    this.livrosFiltrados = [...livrosArray];

    // Calcular total de páginas
    this.totalPaginas = Math.max(1, Math.ceil(livrosArray.length / this.livrosPorPagina));

    console.log('📄 Total de páginas:', this.totalPaginas);

    // Mostrar ou esconder a paginação
    if (this.totalPaginas > 1) {
      this.paginacaoContainer.style.display = 'flex';
      console.log('👁️ Paginação visível');
    } else {
      this.paginacaoContainer.style.display = 'none';
      console.log('🙈 Paginação oculta (apenas uma página)');
    }

    // Ir para a primeira página
    this.irParaPagina(1);
  }

  // Ir para uma página específica
  irParaPagina(numeroPagina) {
    // Validar número da página
    if (numeroPagina < 1 || numeroPagina > this.totalPaginas) {
      console.log('⛔ Página inválida:', numeroPagina);
      return;
    }

    console.log('➡️ Indo para página', numeroPagina, 'de', this.totalPaginas);

    // Atualizar página atual
    this.paginaAtual = numeroPagina;

    // Calcular índices dos livros para esta página
    const inicio = (this.paginaAtual - 1) * this.livrosPorPagina;
    const fim = inicio + this.livrosPorPagina;

    // Obter livros da página atual
    const livrosPagina = this.livrosFiltrados.slice(inicio, fim);

    console.log('📖 Página', this.paginaAtual, ':', inicio + 1, 'a', fim, '-', livrosPagina.length, 'livros');

    // Renderizar os livros desta página
    this.renderizarLivros(livrosPagina);

    // Atualizar controles de paginação
    this.atualizarControles();

    // Atualizar contador de livros
    this.atualizarContador();

    // Scroll suave para o topo da lista (apenas se não for a primeira página)
    if (this.paginaAtual > 1 && this.listaElemento) {
      setTimeout(() => {
        this.listaElemento.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }

  // Renderizar livros da página atual
  renderizarLivros(livros) {
    // Limpar lista atual
    this.listaElemento.innerHTML = '';

    if (!livros || livros.length === 0) {
      const mensagem = document.createElement('div');
      mensagem.className = 'sem-resultados';
      mensagem.innerHTML = `
                <p>📚 Nenhum livro encontrado nesta página.</p>
                <button onclick="window.sistemaPaginacao.irParaPagina(1)" class="btn-voltar">
                    Voltar para primeira página
                </button>
            `;
      this.listaElemento.appendChild(mensagem);
      console.log('📭 Nenhum livro para renderizar');
      return;
    }

    console.log('🎨 Renderizando', livros.length, 'livros');

    // Renderizar cada livro
    livros.forEach((livro, index) => {
      const livroElemento = this.criarElementoLivro(livro);
      this.listaElemento.appendChild(livroElemento);
    });
  }

  // Criar elemento de livro individual
  criarElementoLivro(livro) {
    const livroElemento = document.createElement('div');
    livroElemento.className = 'livro-card';

    // Usar a função do spt_base.js para criar link da imagem
    const imagemCapa = window.criarLinkImagem ?
      window.criarLinkImagem(livro.capa) :
      (livro.capa ? `https://drive.google.com/thumbnail?id=${livro.capa}&sz=w400` : 'body/img/capa-padrao.jpg');

    livroElemento.innerHTML = `
            <div class="capa-container">
                <img src="${imagemCapa}" 
                     alt="Capa do livro: ${livro.titulo}" 
                     class="capa"
                     onerror="this.src='body/img/capa-padrao.jpg'">
                ${livro.genero ? `<span class="badge-genero">${livro.genero}</span>` : ''}
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
                    <a href="${window.criarLinkDownload ? window.criarLinkDownload(livro.link) : `https://drive.google.com/uc?export=download&id=${livro.link}`}" 
                       class="btn-download" 
                       target="_blank"
                       download="${livro.titulo.replace(/[^a-z0-9]/gi, '_')}.pdf">
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

    return livroElemento;
  }

  // Atualizar controles de paginação (botões e números)
  atualizarControles() {
    console.log('🎛️ Atualizando controles - Página:', this.paginaAtual, '/', this.totalPaginas);

    // Atualizar estado dos botões
    if (this.btnAnterior) {
      this.btnAnterior.disabled = this.paginaAtual === 1;
      console.log('⬅️ Botão anterior:', this.btnAnterior.disabled ? 'desabilitado' : 'habilitado');
    }

    if (this.btnProxima) {
      this.btnProxima.disabled = this.paginaAtual === this.totalPaginas;
      console.log('➡️ Botão próxima:', this.btnProxima.disabled ? 'desabilitado' : 'habilitado');
    }

    // Atualizar números das páginas
    if (this.numerosPagina) {
      this.numerosPagina.innerHTML = '';

      // Se houver apenas 1 página, não mostrar números
      if (this.totalPaginas <= 1) return;

      // Definir quantas páginas mostrar ao redor da atual
      const paginasParaMostrar = Math.min(5, this.totalPaginas);
      let inicio = Math.max(1, this.paginaAtual - Math.floor(paginasParaMostrar / 2));
      let fim = Math.min(this.totalPaginas, inicio + paginasParaMostrar - 1);

      // Ajustar se estiver no início
      if (fim - inicio + 1 < paginasParaMostrar) {
        inicio = Math.max(1, fim - paginasParaMostrar + 1);
      }

      console.log('🔢 Mostrando páginas', inicio, 'a', fim);

      // Botão para primeira página (se necessário)
      if (inicio > 1) {
        const primeiraPagina = this.criarNumeroPagina(1);
        this.numerosPagina.appendChild(primeiraPagina);

        if (inicio > 2) {
          const reticencias = document.createElement('span');
          reticencias.textContent = '...';
          reticencias.className = 'reticencias-pagina';
          this.numerosPagina.appendChild(reticencias);
        }
      }

      // Criar números das páginas
      for (let i = inicio; i <= fim; i++) {
        const numeroPagina = this.criarNumeroPagina(i);
        this.numerosPagina.appendChild(numeroPagina);
      }

      // Botão para última página (se necessário)
      if (fim < this.totalPaginas) {
        if (fim < this.totalPaginas - 1) {
          const reticencias = document.createElement('span');
          reticencias.textContent = '...';
          reticencias.className = 'reticencias-pagina';
          this.numerosPagina.appendChild(reticencias);
        }

        const ultimaPagina = this.criarNumeroPagina(this.totalPaginas);
        this.numerosPagina.appendChild(ultimaPagina);
      }
    }
  }

  // Criar elemento de número de página
  criarNumeroPagina(numero) {
    const elemento = document.createElement('button');
    elemento.className = 'numero-pagina';
    elemento.setAttribute('aria-label', `Ir para página ${numero}`);

    if (numero === this.paginaAtual) {
      elemento.classList.add('ativa');
      elemento.setAttribute('aria-current', 'page');
    }

    elemento.textContent = numero;
    elemento.addEventListener('click', () => {
      console.log('🖱️ Clicou na página', numero);
      this.irParaPagina(numero);
    });

    return elemento;
  }

  // Atualizar contador de livros (ajustado para paginação)
  atualizarContador() {
    const contadorFiltrado = document.getElementById('quantidadeFiltrada');
    const contadorTotal = document.getElementById('quantidadeTotal');

    if (contadorFiltrado && contadorTotal) {
      const totalLivros = this.livrosFiltrados.length;
      contadorTotal.textContent = totalLivros;

      if (this.totalPaginas > 1 && totalLivros > 0) {
        const inicio = (this.paginaAtual - 1) * this.livrosPorPagina + 1;
        const fim = Math.min(this.paginaAtual * this.livrosPorPagina, totalLivros);
        contadorFiltrado.textContent = `${inicio}-${fim}`;
      } else {
        contadorFiltrado.textContent = totalLivros;
      }

      console.log('🔢 Contador atualizado:', contadorFiltrado.textContent, 'de', contadorTotal.textContent);
    }
  }

  // Filtrar livros (chamado pelo sistema de filtros)
  filtrarLivros(livrosFiltrados) {
    if (!Array.isArray(livrosFiltrados)) {
      console.error('❌ Lista filtrada inválida');
      return;
    }

    console.log('🔍 Aplicando filtro:', livrosFiltrados.length, 'livros encontrados');

    this.livrosFiltrados = [...livrosFiltrados];
    this.totalPaginas = Math.max(1, Math.ceil(livrosFiltrados.length / this.livrosPorPagina));
    this.paginaAtual = 1; // Voltar para primeira página

    console.log('📄 Novo total de páginas:', this.totalPaginas);

    // Mostrar ou esconder a paginação
    if (this.totalPaginas > 1) {
      this.paginacaoContainer.style.display = 'flex';
    } else {
      this.paginacaoContainer.style.display = 'none';
    }

    // Renderizar primeira página
    this.irParaPagina(1);
  }

  // Limpar filtros (mostrar todos os livros)
  limparFiltros() {
    console.log('🧹 Limpando filtros - Mostrando todos os', this.livrosCompletos.length, 'livros');

    this.livrosFiltrados = [...this.livrosCompletos];
    this.totalPaginas = Math.max(1, Math.ceil(this.livrosCompletos.length / this.livrosPorPagina));
    this.paginaAtual = 1;

    if (this.totalPaginas > 1) {
      this.paginacaoContainer.style.display = 'flex';
    } else {
      this.paginacaoContainer.style.display = 'none';
    }

    this.irParaPagina(1);
  }

  // Método para ser chamado pelo filtro.js
  configurarCompleto() {
    if (typeof livros !== 'undefined' && Array.isArray(livros)) {
      this.configurar(livros);
    } else {
      console.log('⏳ Aguardando carregamento dos livros...');
      setTimeout(() => this.configurarCompleto(), 100);
    }
  }
}

// Inicializar sistema de paginação automaticamente
let sistemaPaginacao;

// Aguardar o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado - Inicializando paginação');
    sistemaPaginacao = new SistemaPaginacao();
  });
} else {
  console.log('🚀 DOM já carregado - Inicializando paginação');
  sistemaPaginacao = new SistemaPaginacao();
}

// Exportar para uso global
window.sistemaPaginacao = sistemaPaginacao;

// Função auxiliar para debug
window.debugPaginacao = function () {
  console.log('=== DEBUG PAGINAÇÃO ===');
  console.log('📊 Livros totais:', window.sistemaPaginacao?.livrosCompletos?.length || 0);
  console.log('📊 Livros filtrados:', window.sistemaPaginacao?.livrosFiltrados?.length || 0);
  console.log('📄 Página atual:', window.sistemaPaginacao?.paginaAtual || 0);
  console.log('📄 Total de páginas:', window.sistemaPaginacao?.totalPaginas || 0);
  console.log('👁️ Paginação visível:', window.sistemaPaginacao?.paginacaoContainer?.style.display || 'n/a');
  console.log('=== FIM DEBUG ===');
};