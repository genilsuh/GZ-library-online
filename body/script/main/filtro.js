// Sistema de Filtros por Gênero

class FiltroGenero {
   constructor() {
      this.livros = [];
      this.generoAtivo = null;
      this.listaElemento = document.getElementById('bookList');
      this.contadorFiltrado = document.getElementById('quantidadeFiltrada');
      this.contadorTotal = document.getElementById('quantidadeTotal');
      this.btnLimpar = document.getElementById('limparFiltros');

      this.inicializar();
   }

   inicializar() {
      // Verificar se os livros foram carregados
      if (typeof livros === 'undefined' || !Array.isArray(livros)) {
         console.log('Livros não encontrados. Aguardando carregamento...');
         setTimeout(() => this.inicializar(), 100);
         return;
      }

      this.livros = livros;
      this.criarEventListeners();
      this.atualizarContador();

      // Configurar paginação
      if (window.sistemaPaginacao) {
         window.sistemaPaginacao.configurar(this.livros);
      } else {
         // Fallback: renderizar diretamente
         this.renderizarLivros(this.livros);
      }
   }

   criarEventListeners() {
      // Adicionar eventos aos itens de gênero
      const itensGenero = document.querySelectorAll('.genero-item');

      itensGenero.forEach(item => {
         item.addEventListener('click', (e) => {
            e.preventDefault();
            const genero = item.getAttribute('data-genero');
            this.filtrarPorGenero(genero);
         });
      });

      // Evento para o botão limpar filtros
      if (this.btnLimpar) {
         this.btnLimpar.addEventListener('click', () => this.limparFiltros());
      }

      // Destacar item ativo
      this.atualizarDestaqueGenero();
   }

   filtrarPorGenero(genero) {
      this.generoAtivo = genero.toLowerCase();

      const livrosFiltrados = this.livros.filter(livro =>
         livro.genero && livro.genero.toLowerCase() === this.generoAtivo
      );

      // Chamar sistema de paginação
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

   limparFiltros() {
      this.generoAtivo = null;

      // Chamar sistema de paginação
      if (window.sistemaPaginacao) {
         window.sistemaPaginacao.limparFiltros();
      } else {
         this.renderizarLivros(this.livros);
      }

      this.atualizarContador();
      this.atualizarDestaqueGenero();
      this.esconderBotaoLimpar();
   }

   renderizarLivros(livrosParaRenderizar) {
      // Limpar lista atual
      this.listaElemento.innerHTML = '';

      if (livrosParaRenderizar.length === 0) {
         const mensagem = document.createElement('div');
         mensagem.className = 'sem-resultados';
         mensagem.innerHTML = `
        <p>📚 Nenhum livro encontrado para o gênero selecionado.</p>
        <button onclick="window.filtroGenero.limparFiltros()" class="btn-voltar">
          Voltar para todos os livros
        </button>
      `;
         this.listaElemento.appendChild(mensagem);
         return;
      }

      // Renderizar cada livro
      livrosParaRenderizar.forEach(livro => {
         const livroElemento = this.criarElementoLivro(livro);
         this.listaElemento.appendChild(livroElemento);
      });
   }

   criarElementoLivro(livro) {
      const livroElemento = document.createElement('div');
      livroElemento.className = 'livro-card';

      // Usar a função do spt_base.js para criar link da imagem
      const imagemCapa = window.criarLinkImagem ? window.criarLinkImagem(livro.capa) :
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

   atualizarContador(quantidadeFiltrada = null) {
      if (!this.contadorFiltrado || !this.contadorTotal) return;

      const total = this.livros.length;
      const filtrados = quantidadeFiltrada !== null ? quantidadeFiltrada : total;

      this.contadorTotal.textContent = total;
      this.contadorFiltrado.textContent = filtrados;
   }

   atualizarDestaqueGenero() {
      // Remover destaque de todos
      document.querySelectorAll('.genero-item').forEach(item => {
         item.classList.remove('genero-ativo');
      });

      // Adicionar destaque ao ativo
      if (this.generoAtivo) {
         const generoAtivoElement = document.querySelector(`.genero-item[data-genero="${this.generoAtivo}"]`);
         if (generoAtivoElement) {
            generoAtivoElement.classList.add('genero-ativo');
         }
      }
   }

   mostrarBotaoLimpar() {
      if (this.btnLimpar) {
         this.btnLimpar.style.display = 'inline-block';
      }
   }

   esconderBotaoLimpar() {
      if (this.btnLimpar) {
         this.btnLimpar.style.display = 'none';
      }
   }
}

// Inicializar quando o DOM estiver pronto
let filtroGenero;

document.addEventListener('DOMContentLoaded', () => {
   filtroGenero = new FiltroGenero();
});

// Exportar para uso global
window.filtroGenero = filtroGenero;