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

// Carregar livros do JSON
fetch("/db/d.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(livros => {
    if (!Array.isArray(livros) || livros.length === 0) {
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
  })
  .catch(error => {
    console.error('Erro ao carregar livros:', error);
    listaElemento.innerHTML = `
      <div class="erro-carregamento">
        <p>❌ Não foi possível carregar os livros.</p>
        <p>Detalhes: ${error.message}</p>
      </div>
    `;
  });

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