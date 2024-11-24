const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sLançamento = document.querySelector('#mData');
const sEspecialidade = document.querySelector('#mEspecialidade');
const sDiasPrevistos = document.querySelector('#mDiasPrevistos');
const sDiasRealizados = document.querySelector('#mDiasRealizados');
const sParticipantesPrevistos = document.querySelector('#mParticipantesPrevistos');
const sParticipantesPresentes = document.querySelector('#mParticipantesPresentes');
const sPergunta01 = document.querySelector('#mPergunta01');
const sPergunta02 = document.querySelector('#mPergunta02');
const sPergunta03 = document.querySelector('#mPergunta03');
const btnSalvar = document.querySelector('#btnSalvar');
const searchInput = document.getElementById('searchInput');

// Certifique-se de que o elemento de mensagem de erro existe
const errorMessage = document.getElementById('error-message');

// Função para obter itens do localStorage
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) || [];

// Função para definir itens no localStorage
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

// Variáveis globais
let itens = [];
let id;

// Carrega itens do localStorage e os exibe
function loadItens() {
    itens = getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
}

// Insere um item na tabela
function insertItem(item, index) {
    let tr = document.createElement('tr');
    const nota01 = parseInt(item.diasRealizados) >= parseInt(item.diasPrevistos) ? 20 : 0;
    const nota02 = parseInt(item.participantesPresentes) >= parseInt(item.participantesPrevistos) ? 20 : 0;
    const nota03 = item.pergunta01 === 'Positivo' ? 20 : 0;
    const nota04 = item.pergunta02 === 'Positivo' ? 20 : 0;
    const nota05 = item.pergunta03 === 'Positivo' ? 20 : 0;
    const total = nota01 + nota02 + nota03 + nota04 + nota05;

    tr.innerHTML = `
        <td>${item.lançamento}</td>
        <td>${item.líder}</td>
        <td>${item.especialidade}</td>
        <td class="${nota01 === 0 ? 'nota-vermelha' : 'nota-verde'} negrito">${nota01}</td>
        <td class="${nota02 === 0 ? 'nota-vermelha' : 'nota-verde'} negrito">${nota02}</td>
        <td class="${nota03 === 0 ? 'nota-vermelha' : 'nota-verde'} negrito">${nota03}</td>
        <td class="${nota04 === 0 ? 'nota-vermelha' : 'nota-verde'} negrito">${nota04}</td>
        <td class="${nota05 === 0 ? 'nota-vermelha' : 'nota-verde'} negrito">${nota05}</td>
        <td class="${total < 80 ? 'total-vermelha' : 'total-verde'} negrito">${total}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

// Função para editar um item
function editItem(index) {
    openModal(true, index);
}

// Função para excluir um item
function deleteItem(index) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
}

// Função para abrir o modal
function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    }

    if (edit) {
        const currentItem = itens[index];
        sLançamento.value = currentItem.lançamento;
        sEspecialidade.value = currentItem.especialidade;
        sDiasPrevistos.value = currentItem.diasPrevistos;
        sDiasRealizados.value = currentItem.diasRealizados;
        sParticipantesPrevistos.value = currentItem.participantesPrevistos;
        sParticipantesPresentes.value = currentItem.participantesPresentes;
        sPergunta01.value = currentItem.pergunta01;
        sPergunta02.value = currentItem.pergunta02;
        sPergunta03.value = currentItem.pergunta03;
        id = index;
    } else {
        sLançamento.value = '';
        sEspecialidade.value = '';
        sDiasPrevistos.value = '';
        sDiasRealizados.value = '';
        sParticipantesPrevistos.value = '';
        sParticipantesPresentes.value = '';
        sPergunta01.value = '';
        sPergunta02.value = '';
        sPergunta03.value = '';
    }
}

// Função para salvar os dados do modal
btnSalvar.onclick = function (e) {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    
    // Verifica se o elemento de mensagem de erro existe
    if (errorMessage) {
        // Limpa a mensagem de erro anterior
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

    // Verificação dos campos obrigatórios
    if (!sLançamento.value || !sEspecialidade.value || !sDiasPrevistos.value || !sDiasRealizados.value ||
        !sParticipantesPrevistos.value || !sParticipantesPresentes.value || !sPergunta01.value ||
        !sPergunta02.value || !sPergunta03.value) {
        
        // Exibe a mensagem de erro se algum campo estiver vazio
        if (errorMessage) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        }
        return; // Interrompe a execução da função até que todos os campos estejam preenchidos
    }

    // Criação do novo item
    const newItem = {
        'lançamento': sLançamento.value,
        'especialidade': sEspecialidade.value,
        'diasPrevistos': sDiasPrevistos.value,
        'diasRealizados': sDiasRealizados.value,
        'participantesPrevistos': sParticipantesPrevistos.value,
        'participantesPresentes': sParticipantesPresentes.value,
        'pergunta01': sPergunta01.value,
        'pergunta02': sPergunta02.value,
        'pergunta03': sPergunta03.value,
    };

    // Se estiver editando, substitui o item no array
    if (id !== undefined) {
        itens[id] = newItem;
    } else {
        // Adiciona novo item ao array
        itens.push(newItem);
    }

    // Atualiza o localStorage e a tabela
    setItensBD();
    loadItens();

    // Fecha o modal e reseta o ID
    modal.classList.remove('active');
    id = undefined;
};

// Função de busca
searchInput.addEventListener('input', function () {
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

// Função para imprimir lançamentos
function imprimirLancamentos() {
    let tableHTML = "<table><thead><tr><th>Lançamento</th><th>Líder</th><th>Especialidade</th><th>Nota 01</th><th>Nota 02</th><th>Nota 03</th><th>Nota 04</th><th>Nota 05</th><th>Total</th></tr></thead><tbody>";

    itens.forEach(item => {
        tableHTML += `<tr><td>${item.lançamento}</td><td>${item.líder}</td><td>${item.especialidade}</td><td>${item.nota01}</td><td>${item.nota02}</td><td>${item.nota03}</td><td>${item.nota04}</td><td>${item.nota05}</td><td>${item.total}</td></tr>`;
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

// Carrega itens ao iniciar
loadItens();
