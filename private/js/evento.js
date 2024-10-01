// Este arquivo será utilizado para armazenar código JavaScript
// que permitirá a comunicação com o backend.
const formEvento = document.querySelector('.form-cadastro-evento'); // Atualizado para selecionar o formulário correto
const enderecoAPI = 'http://localhost:4000/eventos'; // URL da API
buscarTodosEventos();

var motivoAcao = "CADASTRAR";

formEvento.onsubmit = validarCampos;

function formatarDataParaInput(dataISO) {
    const data = new Date(dataISO);
    return data.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:mm
}

function gravarEvento() {
    const objetoEvento = {
        nome: document.getElementById('nome').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        nomePromoter: document.getElementById('nomePromoter').value,
        data: formatarDataParaInput(document.getElementById('data').value), // Formatação
        dataFim: formatarDataParaInput(document.getElementById('dataFim').value), // Formatação
        horario: document.getElementById('horario').value,
        capacidade: document.getElementById('capacidade').value,
        descricao: document.getElementById('descricao').value
    };

    fetch(enderecoAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoEvento)
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status) {
            exibirMensagem(respostaAPI.mensagem, 'green');
            buscarTodosEventos(); // Atualiza a lista de eventos
        } else {
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro.message, '#D2691E');
    });
}

function atualizarEvento(id) {
    const objetoEvento = {
        nome: document.getElementById('nome').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        nomePromoter: document.getElementById('nomePromoter').value,
        data: formatarDataParaInput(document.getElementById('data').value), // Formatação
        dataFim: formatarDataParaInput(document.getElementById('dataFim').value), // Formatação
        horario: document.getElementById('horario').value,
        capacidade: document.getElementById('capacidade').value,
        descricao: document.getElementById('descricao').value
    };

    fetch(`${enderecoAPI}/${id}`, {
        method: 'PUT', // ou 'PATCH', dependendo da sua preferência
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoEvento)
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status) {
            exibirMensagem(respostaAPI.mensagem, 'green');
            buscarTodosEventos(); // Atualiza a lista de eventos
        } else {
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro.message, '#D2691E');
    });
}

function excluirEvento(id) {
    fetch(`${enderecoAPI}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((resposta) => {
        return resposta.json();
    }).then((respostaAPI) => {
        if (respostaAPI.status) {
            exibirMensagem(respostaAPI.mensagem, 'green');
            buscarTodosEventos(); // Atualiza a lista de eventos
        } else {
            exibirMensagem(respostaAPI.mensagem, 'red');
        }
    }).catch((erro) => {
        exibirMensagem(erro.message, '#D2691E');
    });
}

function buscarTodosEventos() {
    fetch(enderecoAPI, { method: 'GET' })
        .then((resposta) => {
            return resposta.json();
        })
        .then((respostaAPI) => {
            if (respostaAPI.status) {
                exibirTabelaEventos(respostaAPI.eventos); // Atualizado para refletir a estrutura da resposta
            } else {
                exibirMensagem(respostaAPI.mensagem, 'red');
            }
        })
        .catch((erro) => {
            exibirMensagem(erro.message, '#D2691E');
        });
}

function validarCampos(evento) {
    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const nomePromoter = document.getElementById('nomePromoter').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
    const capacidade = document.getElementById('capacidade').value;
    const descricao = document.getElementById('descricao').value;

    // Impedindo que o navegador continue o processo de submissão do formulário
    evento.stopPropagation();
    evento.preventDefault();

    if (nome && endereco && cidade && estado && nomePromoter && data && horario && capacidade && descricao) {
        if (motivoAcao === "CADASTRAR") {
            gravarEvento();
        } else if (motivoAcao === "EDITAR") {
            const idEvento = document.getElementById('idEvento').value; // Supondo que tenha um campo oculto com o ID do evento
            atualizarEvento(idEvento);
            motivoAcao = "CADASTRAR";
        } else if (motivoAcao === "EXCLUIR") {
            const idEvento = document.getElementById('idEvento').value; // Supondo que tenha um campo oculto com o ID do evento
            excluirEvento(idEvento);
            motivoAcao = "CADASTRAR";
        }

        formEvento.reset();
        buscarTodosEventos();
        return true;
    } else {
        exibirMensagem('Por favor, preencha todos os campos do formulário.');
        return false;
    }
}

function exibirMensagem(mensagem, cor = 'black') {
    const divMensagem = document.getElementById('mensagem');
    divMensagem.innerHTML = "<p style='color: " + cor + ";'>" + mensagem + "</p>";
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
}

function exibirTabelaEventos(listaEventos) {
    const espacoTabela = document.getElementById('containerTabela');
    espacoTabela.innerHTML = ""; // Limpa a tabela anterior

    if (listaEventos.length > 0) {
        const tabela = document.createElement('table');
        tabela.classList = "table table-striped table-hover";
        const cabecalho = document.createElement('thead');
        cabecalho.innerHTML = `
            <tr>
                <th>ID</th>
                <th>NOME</th>
                <th>ENDEREÇO</th>
                <th>CIDADE</th>
                <th>ESTADO</th>
                <th>NOME DO PROMOTER</th>
                <th>DATA</th>
                <th>DATA FIM</th>
                <th>HORÁRIO</th>
                <th>CAPACIDADE</th>
                <th>DESCRIÇÃO</th>
                <th>AÇÕES</th>
            </tr>
        `;
        const corpo = document.createElement('tbody');

        for (const evento of listaEventos) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${evento.id}</td>
                <td>${evento.nome}</td>
                <td>${evento.endereco}</td>
                <td>${evento.cidade}</td>
                <td>${evento.estado}</td>
                <td>${evento.nomePromoter}</td>
                <td>${new Date(evento.data).toLocaleString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>${new Date(evento.dataFim).toLocaleString('pt-BR', { timeZone: 'UTC' })}</td>
                <td>${evento.horario}</td>
                <td>${evento.capacidade}</td>
                <td>${evento.descricao}</td>
                <td>
                    <button onclick="selecionarEvento('${evento.id}', '${evento.nome}', '${evento.endereco}', '${evento.cidade}', '${evento.estado}', '${evento.nomePromoter}', '${evento.data}', '${evento.dataFim}', '${evento.horario}', '${evento.capacidade}', '${evento.descricao}', 'EDITAR')">Alterar</button>
                    <button onclick="confirmarExclusao('${evento.id}')">Excluir</button>
                </td>
            `;
            corpo.appendChild(linha);
        }

        tabela.appendChild(cabecalho);
        tabela.appendChild(corpo);
        espacoTabela.appendChild(tabela);
    } else {
        espacoTabela.innerHTML = "<p>Não há eventos cadastrados.</p>";
    }
}

function selecionarEvento(id, nome, endereco, cidade, estado, nomePromoter, data, dataFim, horario, capacidade, descricao, motivo) {
    document.getElementById('idEvento').value = id; // Armazena o ID do evento em um campo oculto
    document.getElementById('nome').value = nome;
    document.getElementById('endereco').value = endereco;
    document.getElementById('cidade').value = cidade;
    document.getElementById('estado').value = estado;
    document.getElementById('nomePromoter').value = nomePromoter;

    // Verifica se a data e a dataFim são válidas antes de formatar
    const dataFormatada = (data && data !== "null") ? data.split('T')[0] : ''; // Extrai apenas a parte da data, se existir e não for null
    const dataFimFormatada = (dataFim && dataFim !== "null") ? dataFim.split('T')[0] : ''; // Extrai apenas a parte da dataFim, se existir e não for null

    document.getElementById('data').value = dataFormatada; // Define o valor no input
    document.getElementById('dataFim').value = dataFimFormatada; // Define o valor no input
    
    document.getElementById('horario').value = horario;
    document.getElementById('capacidade').value = capacidade;
    document.getElementById('descricao').value = descricao;

    motivoAcao = motivo; // Define a ação que será executada
}


function confirmarExclusao(id) {
    const confirmacao = confirm('Tem certeza que deseja excluir este evento?');
    if (confirmacao) {
        excluirEvento(id);
    }
}
