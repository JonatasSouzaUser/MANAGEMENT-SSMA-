const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sAuditoria = document.querySelector('#mData');
const sEspecialidade = document.querySelector('#mEspecialidade');
const sUnidade = document.querySelector('#mUnidade');
const sLocal = document.querySelector('#mLocal');
const sDesvio = document.querySelector('#mDesvio');
const sDescrição = document.querySelector('#mDescrição');
const sTratativa = document.querySelector('#mTratativa');
const sClasses = document.querySelector('#mClasses'); // Novo seletor para Classes
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

function insertItem(item, index) {
  let tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${item.auditoria}</td>
    <td>${item.especialidade}</td>
    <td>${item.unidade}</td>
    <td>${item.local}</td>
    <td>${item.desvio}</td>
    <td>${item.classes.join(', ')}</td> <!-- Exibe as classes como uma string -->
    <td>${item.descrição}</td>
    <td>${item.tratativa}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
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

    // Preenche as classes selecionadas
    const checkboxes = document.querySelectorAll('#mClasses .custom-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = currentItem.classes.includes(checkbox.value); // Marca a checkbox se estiver na lista
    });

    id = index;
  } else {
    sAuditoria.value = '';
    sEspecialidade.value = '';
    sUnidade.value = '';
    sLocal.value = '';
    sDesvio.value = '';
    sDescrição.value = '';
    sTratativa.value = '';

    // Limpa as seleções das classes
    const checkboxes = document.querySelectorAll('#mClasses .custom-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false; // Desmarca todas as checkboxes
    });
  }
}

btnSalvar.onclick = e => {
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

  // Coleta as classes selecionadas
  const selectedClasses = Array.from(document.querySelectorAll('#mClasses .custom-checkbox input[type="checkbox"]:checked'))
                               .map(checkbox => checkbox.value);

  const newItem = {
    'auditoria': sAuditoria.value,
    'especialidade': sEspecialidade.value,
    'unidade': sUnidade.value,
    'local': sLocal.value,
    'desvio': sDesvio.value,
    'classes': selectedClasses, // Adiciona as classes selecionadas
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
}

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

function imprimirLancamentos() {
  let tableHTML = "<table><thead><tr><th>Auditoria</th><th>Especialidade</th><th>Unidade</th><th>Local</th><th>Desvio</th><th>Classes</th><th>Descrição</th><th>Tratativa</th></thead><tbody>";
  
  itens.forEach(item => {
      tableHTML += `<tr><td>${item.auditoria}</td><td>${item.especialidade}</td><td>${item.unidade}</td><td>${item.local}</td><td>${item.desvio}</td><td>${item.classes.join(', ')}</td><td>${item.descrição}</td><td>${item.tratativa}</td></tr>`;
  });

  tableHTML += "</tbody></table>";

  let printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(`
      <html>
      <head>
          <title>Impressão de Lançamentos</title>
          <style>
              table { width: 100%; border-collapse: collapse; }
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

loadItens();
