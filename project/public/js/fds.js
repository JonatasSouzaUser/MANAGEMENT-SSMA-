const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sIdentificação = document.querySelector('#mIdentificacao');
const sNONU = document.querySelector('#mNONU');
const sFornecedor = document.querySelector('#mForncedor');
const sFabricante = document.querySelector('#mFabricante');
const sUsoRecomendado = document.querySelector('#mUsoRecomendado');
const sSetor = document.querySelector('#mSetor');
const sComposiçãoQuimica = document.querySelector('#mCQ');
const btnSalvar = document.querySelector('#btnSalvar');

let itens = [];
let id;

const getItensBD = () => JSON.parse(localStorage.getItem('dbfuncpt')) || [];
const setItensBD = () => localStorage.setItem('dbfuncpt', JSON.stringify(itens));

function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

loadItens();
function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.auditoria}</td>
    <td>${item.líder}</td>
    <td>${item.especialidade}</td>
    <td>${item.unidade}</td>
    <td>${item.local}</td>
    <td>${item.desvio}</td>
    <td>${item.descrição}</td>
    <td>${item.tratativa}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}


function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  }

  if (edit) {
    const currentItem = itens[index];
    sAuditoria.value = currentItem.auditoria;
    sEspecialidade.value = currentItem.especialidade;
    sUnidade.value = currentItem.unidade;
    sLocal.value = currentItem.local;
    sDesvio.value = currentItem.desvio;
    sDescrição.value = currentItem.descrição;
    sTratativa.value = currentItem.tratativa;
    id = index;
  } else {
    sAuditoria.value = '';
    sEspecialidade.value = '';
    sUnidade.value = '';
    sLocal.value = '';
    sDesvio.value = '';
    sDescrição.value = '';
    sTratativa.value = '';
  }
}

btnSalvar.onclick = e => {
  console.log("Botão de salvar clicado!");
  e.preventDefault(); 

  if (!sAuditoria.value || 
      !sEspecialidade.value || 
      !sUnidade.value || 
      !sLocal.value || 
      !sDesvio.value || 
      !sDescrição.value || 
      !sTratativa.value) {
      alert('Por favor, preencha todos os campos obrigatórios.'); 
    return;
  }

  const newItem = {
    'auditoria': sAuditoria.value,
    'especialidade': sEspecialidade.value,
    'unidade': sUnidade.value,
    'local': sLocal.value,
    'desvio': sDesvio.value,
    'descrição': sDescrição.value,
    'tratativa': sTratativa.value
  };

  if (id !== undefined) {
    itens[id] = newItem;
  } else {
    itens.push(newItem);
  }

  setItensBD();

  modal.classList.remove('active');
  loadItens();
  id = undefined;
;


const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
  const searchText = this.value.trim().toLowerCase();
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    let found = false;

    cells.forEach(cell => {
      if (cell.textContent.toLowerCase().includes(searchText)) {
        found = true;
      }
    });

    if (found) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

function imprimirLancamentos() {// Construir uma representação da tabela em formato de string
    let tableHTML = "<table><thead><tr><th>Auditoria</th><th>Líder</th><th>Unidade</th><th>Local</th><th>Desvio</th><th>Descrição do desvio</th><th>Tratativa</th></thead><tbody>";
    
    // Iterar sobre os lançamentos e adicionar as linhas à representação da tabela
    itens.forEach(item => {
        tableHTML += `<tr><td>${item.auditoria}</td><td>${item.líder}</td><td>${item.unidade}</td><td>${item.local}</td><td>${item.especialidade}</td><td>${item.desvio}</td><td>${item.descrição}</td><td>${item.tratativa}</td></tr>`;
    });
  
    tableHTML += "</tbody></table>";
  
    let printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
        <html>
        <head>
            <title>Impressão de Lançamentos</title>
            <style>
                /* Estilos para a tabela na impressão */
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
    printWindow.print();}
}