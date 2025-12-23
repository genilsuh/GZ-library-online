// SISTEMA DE FILTROS POR GÊNERO
class FiltroGenero {
   constructor() {
      this.listaLivros = [];
      this.generoAtivo = null;
      this.elementoLista = document.getElementById('lista-livros');
      this.contadorFiltrado = document.getElementById('quantidade-filtrada');
      this.contadorTotal = document.getElementById('quantidade-total');
      this.botaoLimparFiltros = document.getElementById('limpar-filtros');

      this.inicializar();
   }

   inicializar() {
      // Verificar se os livros foram carregados
      if (typeof livros === 'undefined' || !Array.isArray(livros)) {
         console.log('Aguardando carregamento dos livros...');
         setTimeout(() => this.inicializar(), 100);
         return;
      }

      this.listaLivros = livros;
      this.configurarEventListeners();
      this.atualizarContador();

      // Configurar com sistema de paginação se disponível
      if (window.sistemaPaginacao) {
         window.sistemaPaginacao.configurar(this.listaLivros);
      } else {
         this.renderizarLivros(this.listaLivros);
      }
   }

   configurarEventListeners() {
      // Eventos para os itens de gênero
      const itensGenero = document.querySelectorAll('.item-genero');

      itensGenero.forEach(item => {
         item.addEventListener('click', (evento) => {
            evento.preventDefault();
            const genero = item.getAttribute('data-genero');
            this.aplicarFiltroGenero(genero);
         });
      });

      // Evento para o botão limpar filtros
      if (this.botaoLimparFiltros) {
         this.botaoLimparFiltros.addEventListener('click', () => this.removerFiltros());
      }

      this.atualizarDestaqueGenero();
   }

   aplicarFiltroGenero(genero) {
      this.generoAtivo = genero.toLowerCase();

      const livrosFiltrados = this.listaLivros.filter(livro =>
         livro.genero && livro.genero.toLowerCase() === this.generoAtivo
      );

      // Usar sistema de paginação se disponível
      if (window.sistemaPaginacao) {
         window.sistemaPaginacao.filtrarLivros(livrosFiltrados);
      } else {
         this.renderizarLivros(livrosFiltrados);
      }

      this.atualizarContador(livrosFiltrados.length);
      this.atualizarDestaqueGenero();
      this.mostrarBotaoLimpar();

      // Scroll suave para a lista de livros
      document.querySelector('main').scrollIntoView({
         behavior: 'smooth',
         block: 'start'
      });
   }

   removerFiltros() {
      this.generoAtivo = null;

      // Usar sistema de paginação se disponível
      if (window.sistemaPaginacao) {
         window.sistemaPaginacao.limparFiltros();
      } else {
         this.renderizarLivros(this.listaLivros);
      }

      this.atualizarContador();
      this.atualizarDestaqueGenero();
      this.esconderBotaoLimpar();
   }

   renderizarLivros(livrosParaRenderizar) {
      // Limpar lista atual
      this.elementoLista.innerHTML = '';

      if (livrosParaRenderizar.length === 0) {
         const mensagem = document.createElement('div');
         mensagem.className = 'mensagem-sem-resultados';
         mensagem.innerHTML = `
        <p>📚 Nenhum livro encontrado para o gênero selecionado.</p>
        <button onclick="window.filtroGenero.removerFiltros()" class="botao-voltar">
          Voltar para todos os livros
        </button>
      `;
         this.elementoLista.appendChild(mensagem);
         return;
      }

      // Renderizar cada livro
      livrosParaRenderizar.forEach(livro => {
         const elementoLivro = this.criarElementoLivro(livro);
         this.elementoLista.appendChild(elementoLivro);
      });
   }

   criarElementoLivro(livro) {
      const elementoLivro = document.createElement('div');
      elementoLivro.className = 'card-livro';

      // Gerar link da imagem
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

   atualizarContador(quantidadeFiltrada = null) {
      if (!this.contadorFiltrado || !this.contadorTotal) return;

      const total = this.listaLivros.length;
      const filtrados = quantidadeFiltrada !== null ? quantidadeFiltrada : total;

      this.contadorTotal.textContent = total;
      this.contadorFiltrado.textContent = filtrados;
   }

   atualizarDestaqueGenero() {
      // Remover destaque de todos
      document.querySelectorAll('.item-genero').forEach(item => {
         item.classList.remove('genero-ativo');
      });

      // Adicionar destaque ao ativo
      if (this.generoAtivo) {
         const elementoGeneroAtivo = document.querySelector(`.item-genero[data-genero="${this.generoAtivo}"]`);
         if (elementoGeneroAtivo) {
            elementoGeneroAtivo.classList.add('genero-ativo');
         }
      }
   }

   mostrarBotaoLimpar() {
      if (this.botaoLimparFiltros) {
         this.botaoLimparFiltros.style.display = 'inline-block';
      }
   }

   esconderBotaoLimpar() {
      if (this.botaoLimparFiltros) {
         this.botaoLimparFiltros.style.display = 'none';
      }
   }
}

// Inicializar sistema de filtros quando o DOM estiver pronto
let filtroGenero;

document.addEventListener('DOMContentLoaded', () => {
   filtroGenero = new FiltroGenero();
});

// Exportar para uso global
window.filtroGenero = filtroGenero;