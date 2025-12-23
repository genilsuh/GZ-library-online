// SISTEMA DE PAGINAÇÃO - 6 LIVROS POR PÁGINA
class SistemaPaginacao {
  constructor() {
    // Elementos DOM
    this.elementoLista = document.getElementById('lista-livros');
    this.containerPaginacao = document.getElementById('container-paginacao');
    this.numerosPagina = document.getElementById('numeros-pagina');
    this.botaoAnterior = document.getElementById('pagina-anterior');
    this.botaoProxima = document.getElementById('proxima-pagina');

    // Configurações
    this.livrosPorPagina = 6;
    this.paginaAtual = 1;
    this.totalPaginas = 1;
    this.livrosFiltrados = [];
    this.livrosCompletos = [];
    this.estaInicializado = false;

    // Inicializar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.inicializar());
    } else {
      this.inicializar();
    }
  }

  inicializar() {
    console.log('Inicializando sistema de paginação...');

    if (!this.containerPaginacao) {
      console.error('❌ Container de paginação não encontrado');
      return;
    }

    this.adicionarEventListeners();
    this.containerPaginacao.style.display = 'none';
    this.estaInicializado = true;

    console.log('Sistema de paginação inicializado');

    // Configurar com livros se já estiverem disponíveis
    if (typeof livros !== 'undefined' && Array.isArray(livros) && livros.length > 0) {
      console.log('Configurando paginação com', livros.length, 'livros');
      this.configurar(livros);
    }
  }

  adicionarEventListeners() {
    // Botão página anterior
    if (this.botaoAnterior) {
      this.botaoAnterior.addEventListener('click', () => {
        this.irParaPagina(this.paginaAtual - 1);
      });
    }

    // Botão próxima página
    if (this.botaoProxima) {
      this.botaoProxima.addEventListener('click', () => {
        this.irParaPagina(this.paginaAtual + 1);
      });
    }
  }

  configurar(livrosArray) {
    if (!Array.isArray(livrosArray)) {
      console.error('❌ Lista de livros inválida para paginação:', livrosArray);
      return;
    }

    console.log('Configurando paginação com', livrosArray.length, 'livros');

    this.livrosCompletos = [...livrosArray];
    this.livrosFiltrados = [...livrosArray];
    this.totalPaginas = Math.max(1, Math.ceil(livrosArray.length / this.livrosPorPagina));

    console.log('Total de páginas:', this.totalPaginas);

    if (this.totalPaginas > 1) {
      this.containerPaginacao.style.display = 'flex';
      console.log(' Paginação visível');
    } else {
      this.containerPaginacao.style.display = 'none';
      console.log('Paginação oculta (apenas uma página)');
    }

    this.irParaPagina(1);
  }

  irParaPagina(numeroPagina) {
    if (numeroPagina < 1 || numeroPagina > this.totalPaginas) {
      console.log('Página inválida:', numeroPagina);
      return;
    }

    console.log('Indo para página', numeroPagina, 'de', this.totalPaginas);

    this.paginaAtual = numeroPagina;
    const inicio = (this.paginaAtual - 1) * this.livrosPorPagina;
    const fim = inicio + this.livrosPorPagina;
    const livrosPagina = this.livrosFiltrados.slice(inicio, fim);

    console.log('Página', this.paginaAtual, ':', inicio + 1, 'a', fim, '-', livrosPagina.length, 'livros');

    this.renderizarLivros(livrosPagina);
    this.atualizarControles();
    this.atualizarContador();

    if (this.paginaAtual > 1 && this.elementoLista) {
      setTimeout(() => {
        this.elementoLista.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }

  renderizarLivros(livros) {
    this.elementoLista.innerHTML = '';

    if (!livros || livros.length === 0) {
      const mensagem = document.createElement('div');
      mensagem.className = 'mensagem-sem-resultados';
      mensagem.innerHTML = `
        <p>Nenhum livro encontrado nesta página.</p>
        <button onclick="window.sistemaPaginacao.irParaPagina(1)" class="botao-voltar">
          Voltar para primeira página
        </button>
      `;
      this.elementoLista.appendChild(mensagem);
      console.log('Nenhum livro para renderizar');
      return;
    }

    console.log('Renderizando', livros.length, 'livros');

    livros.forEach((livro) => {
      const elementoLivro = this.criarElementoLivro(livro);
      this.elementoLista.appendChild(elementoLivro);
    });
  }

  criarElementoLivro(livro) {
    const elementoLivro = document.createElement('div');
    elementoLivro.className = 'card-livro';

    const imagemCapa = window.gerarLinkImagem ?
      window.gerarLinkImagem(livro.capa) :
      (livro.capa ? `https://drive.google.com/thumbnail?id=${livro.capa}&sz=w400` : 'body/img/capa-padrao.jpg');

    elementoLivro.innerHTML = `
      <div class="container-capa">
        <img src="${imagemCapa}" 
             alt="Capa do livro: ${livro.titulo}" 
             class="imagem-capa"
             onerror="this.src='body/img/capa-padrao.jpg'">
        ${livro.genero ? `<span class="badge-genero">${livro.genero}</span>` : ''}
      </div>
      <div class="info-livro">
        <h3 class="titulo-livro">${livro.titulo}</h3>
        <div class="autor-livro">${livro.autor}</div>
        <p class="descricao-livro">${livro.descricao}</p>
        
        <div class="botoes-acao">
          <button class="botao-abrir" 
                  onclick="abrirVisualizacaoLivro(event, '${livro.link}')">
            📖 Ler Online
          </button>
          <a href="${window.gerarLinkDownload ? window.gerarLinkDownload(livro.link) : `https://drive.google.com/uc?export=download&id=${livro.link}`}" 
             class="botao-download" 
             target="_blank"
             download="${livro.titulo.replace(/[^a-z0-9]/gi, '_')}.pdf">
            ⬇️ Download
          </a>
          <a href="https://drive.google.com/file/d/${livro.link}/view" 
             class="botao-drive" 
             target="_blank">
            🔗 Abrir no Drive
          </a>
        </div>
      </div>
    `;

    return elementoLivro;
  }

  atualizarControles() {
    console.log('Atualizando controles - Página:', this.paginaAtual, '/', this.totalPaginas);

    if (this.botaoAnterior) {
      this.botaoAnterior.disabled = this.paginaAtual === 1;
      console.log('⬅️ Botão anterior:', this.botaoAnterior.disabled ? 'desabilitado' : 'habilitado');
    }

    if (this.botaoProxima) {
      this.botaoProxima.disabled = this.paginaAtual === this.totalPaginas;
      console.log('➡️ Botão próxima:', this.botaoProxima.disabled ? 'desabilitado' : 'habilitado');
    }

    if (this.numerosPagina) {
      this.numerosPagina.innerHTML = '';

      if (this.totalPaginas <= 1) return;

      const paginasParaMostrar = Math.min(5, this.totalPaginas);
      let inicio = Math.max(1, this.paginaAtual - Math.floor(paginasParaMostrar / 2));
      let fim = Math.min(this.totalPaginas, inicio + paginasParaMostrar - 1);

      if (fim - inicio + 1 < paginasParaMostrar) {
        inicio = Math.max(1, fim - paginasParaMostrar + 1);
      }

      console.log('Mostrando páginas', inicio, 'a', fim);

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

      for (let i = inicio; i <= fim; i++) {
        const numeroPagina = this.criarNumeroPagina(i);
        this.numerosPagina.appendChild(numeroPagina);
      }

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
      console.log('Clicou na página', numero);
      this.irParaPagina(numero);
    });

    return elemento;
  }

  atualizarContador() {
    const contadorFiltrado = document.getElementById('quantidade-filtrada');
    const contadorTotal = document.getElementById('quantidade-total');

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

      console.log('Contador atualizado:', contadorFiltrado.textContent, 'de', contadorTotal.textContent);
    }
  }

  filtrarLivros(livrosFiltrados) {
    if (!Array.isArray(livrosFiltrados)) {
      console.error('Lista filtrada inválida');
      return;
    }

    console.log('Aplicando filtro:', livrosFiltrados.length, 'livros encontrados');

    this.livrosFiltrados = [...livrosFiltrados];
    this.totalPaginas = Math.max(1, Math.ceil(livrosFiltrados.length / this.livrosPorPagina));
    this.paginaAtual = 1;

    console.log('Novo total de páginas:', this.totalPaginas);

    if (this.totalPaginas > 1) {
      this.containerPaginacao.style.display = 'flex';
    } else {
      this.containerPaginacao.style.display = 'none';
    }

    this.irParaPagina(1);
  }

  limparFiltros() {
    console.log('Limpando filtros - Mostrando todos os', this.livrosCompletos.length, 'livros');

    this.livrosFiltrados = [...this.livrosCompletos];
    this.totalPaginas = Math.max(1, Math.ceil(this.livrosCompletos.length / this.livrosPorPagina));
    this.paginaAtual = 1;

    if (this.totalPaginas > 1) {
      this.containerPaginacao.style.display = 'flex';
    } else {
      this.containerPaginacao.style.display = 'none';
    }

    this.irParaPagina(1);
  }

  configurarCompleto() {
    if (typeof livros !== 'undefined' && Array.isArray(livros)) {
      this.configurar(livros);
    } else {
      console.log('⏳ Aguardando carregamento dos livros...');
      setTimeout(() => this.configurarCompleto(), 100);
    }
  }
}

// Inicializar sistema de paginação
let sistemaPaginacao;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando paginação');
    sistemaPaginacao = new SistemaPaginacao();
  });
} else {
  console.log('Inicializando paginação');
  sistemaPaginacao = new SistemaPaginacao();
}

// Exportar para uso global
window.sistemaPaginacao = sistemaPaginacao;