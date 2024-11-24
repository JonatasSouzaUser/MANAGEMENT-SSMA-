// Seleciona os elementos do DOM
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sMatrícula = document.querySelector('#m-matrícula');
const sFunção = document.querySelector('#m-função');
const sEspecialidade = document.querySelector('#m-especialidade');
const btnSalvar = document.querySelector('#btnSalvar');

let leaders = [];  // Lista global de líderes
let id;  // Variável global 'id', usada para identificar se é um novo líder ou para editar um existente

// Função para buscar os líderes do MongoDB
async function getLeaders() {
  const response = await fetch('/leaders');
  const data = await response.json();

  // Verifica se a resposta contém dados válidos
  if (data && Array.isArray(data.data)) {
    leaders = data.data;  // Atribui o array de líderes à variável global
  } else {
    console.error("A resposta não contém dados válidos:", data);
  }
}

// Função para criar um novo líder no MongoDB
async function createLeader(leader) {
  console.log("Enviando dados do líder:", leader);  // Verifique os dados antes de enviar
  try {
    const response = await fetch('/leaders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leader),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro ao criar líder: ${response.statusText}`, errorData);
      throw new Error(`Erro ao criar líder: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Líder criado com sucesso:", data);
  } catch (error) {
    console.error("Erro na criação do líder:", error);
  }
}

// Função para atualizar um líder no MongoDB
async function updateLeader(id, leader) {
  await fetch(`/leaders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leader),
  });
}

// Função para excluir um líder do MongoDB
async function deleteLeaderFromTable(id) {
  await fetch(`/leaders/${id}`, { method: 'DELETE' });
  loadLeaders();  // Recarrega a lista de líderes após a exclusão
}

// Carrega os itens na inicialização da página
loadLeaders();

// Função para carregar líderes na tabela
async function loadLeaders() {
  await getLeaders();  // Busca os líderes do banco de dados
  tbody.innerHTML = '';  // Limpa a tabela antes de adicionar os novos dados
  
  // Verifica se 'leaders' é um array
  if (Array.isArray(leaders)) {
    leaders.forEach((leader) => insertLeader(leader));  // Adiciona cada líder na tabela
  } else {
    console.error("A variável 'leaders' não contém um array válido:", leaders);
  }
}

// Função para inserir um líder na tabela
function insertLeader(leader) {
  let tr = document.createElement('tr');
  
  tr.innerHTML = `
    <td>${leader.nome}</td>
    <td>${leader.matrícula}</td>
    <td>${leader.função}</td>
    <td>${leader.especialidade}</td>
    <td class="acao">
      <button onclick="editLeader('${leader._id}')"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteLeaderFromTable('${leader._id}')"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função para editar um líder
function editLeader(id) {
  openModal(true, id);
}

// Função para excluir um líder
async function deleteLeaderFromTable(id) {
  await fetch(`/leaders/${id}`, { method: 'DELETE' });
  loadLeaders();  // Recarrega a lista de líderes após a exclusão
}

// Evento de clique no botão 'Salvar'
btnSalvar.onclick = async (e) => {
  e.preventDefault();

  if (sNome.value === '' || sFunção.value === '' || sEspecialidade.value === '') {
    return;  // Não salva se algum campo estiver vazio
  }

  const leader = {
    nome: sNome.value,
    matrícula: sMatrícula.value,
    função: sFunção.value,
    especialidade: sEspecialidade.value,
  };

  if (id !== undefined) {
    await updateLeader(id, leader);  // Atualiza o líder no MongoDB
  } else {
    await createLeader(leader);  // Cria um novo líder no MongoDB
  }

  modal.classList.remove('active');  // Fecha o modal
  loadLeaders();  // Recarrega a lista de líderes
  id = undefined;  // Reseta o 'id' para garantir que a próxima ação seja uma criação
};

// Função para abrir o modal de inclusão/edição de itens
function openModal(edit = false, leaderId = null) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  }

  if (edit && leaderId !== null) {
    const leader = leaders.find(l => l._id === leaderId); // Encontra o líder pelo ID
    sNome.value = leader.nome;
    sMatrícula.value = leader.matrícula;
    sFunção.value = leader.função;
    sEspecialidade.value = leader.especialidade;
    id = leaderId;  // Define o 'id' para editar
  } else {
    sNome.value = '';
    sMatrícula.value = '';
    sFunção.value = '';
    sEspecialidade.value = '';
    id = undefined;  // Reseta o 'id' se estiver criando um novo líder
  }
}

// Função para imprimir os lançamentos em uma nova janela
function imprimirLancamentos() {
  let tableHTML = "<table><thead><tr><th>Nome</th><th>Matrícula</th><th>Função</th><th>Especialidade</th></tr></thead><tbody>";
  
  leaders.forEach(item => {
      tableHTML += `<tr><td>${item.nome}</td><td>${item.matrícula}</td><td>${item.função}</td><td>${item.especialidade}</td></tr>`;
  });

  tableHTML += "</tbody></table>";

  let printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(`
      <html>
      <head>
          <title>Impressão de Lançamentos</title>
          <style>
              table { width: 100%; border-collapse: collapse;}
              th, td { border: 1px solid black; padding: 8px; }
              th { background-color: #f2f2f2; }
          </style>
      </head>
      <body>
          ${tableHTML}
      </body>
      </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// Evento para fechar o modal ao clicar fora do modal
modal.onclick = e => {
  if (e.target.className.indexOf('modal-container') !== -1) {
    modal.classList.remove('active');
  }
};

// Evento para fechar o modal com a tecla ESC
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    modal.classList.remove('active');
  }
});
