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

// Chama a função para carregar os livros quando a página estiver pronta
if (document.readyState === 'loading') {
  // Se a página ainda está carregando, espera o evento
  document.addEventListener('DOMContentLoaded', carregarLivrosDoJS);
} else {
  // Se a página já carregou, executa imediatamente
  carregarLivrosDoJS();
}


// Busca de livros (funcionalidade adicional)
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