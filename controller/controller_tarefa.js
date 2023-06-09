/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de TAREFA
 *  Autor: Luiz e Muryllo
 *  Data: 29/05/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados da Tarefa no BD
var tarefaDAO = require('../model/DAO/tarefaDAO.js')
var professorDAO = require('../model/DAO/professorDAO.js')
var materiaDAO = require('../model/DAO/materiaDAO.js')
var tipoTarefaDAO = require('../controller/controller_tipo-tarefa.js')

var message = require('./modulo/config.js')

//Retorna a lista de todas as tarefas
const ctlGetTarefa = async function () {

    let dadosTarefaJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosTarefa = await tarefaDAO.mdlSelectAllTarefas();

    if (dadosTarefa) {

        dadosTarefaJSON = {
            status: message.SUCCESS_REQUEST.status,
            message: message.SUCCESS_REQUEST.message,
            quantidade: dadosTarefa.length,
            tarefas: dadosTarefa
        }

        return dadosTarefaJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }
}

//Retorna um registro de tarefa filtrada pelo ID
const ctlGetTarefaByID = async function (id) {

    //Validação do ID
    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosTarefaJSON = {}

        let dadosTarefa = await tarefaDAO.mdlSelectByIdTarefa(id)

        if (dadosTarefa) {
            //Criando um JSON com o atributo Tarefa, para encaminhar um array de Tarefas
            dadosTarefaJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                tarefas: dadosTarefa
            }
            return dadosTarefaJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Retorna uma Tarefa filtrando pelo nome
const ctlGetBuscarTarefaNome = async function (nome) {

    let nomeTarefa = nome

    let dadosTarefaJSON = {}

    let dadosTarefa = await tarefaDAO.mdlSelectByNameTarefa(nomeTarefa)

    if (dadosTarefa) {
        dadosTarefaJSON.status = message.SUCCESS_REQUEST.status;
        dadosTarefaJSON.message = message.SUCCESS_REQUEST.message;
        dadosTarefaJSON.tarefa = dadosTarefa
        return dadosTarefaJSON
    } else {
        return message.ERROR_INVALID_NOME;
    }
}

//Retorna uma Tarefa filtrando pelo tipo da tarefa
const ctlGetBuscarTarefaTipoTarefa = async function (idTipoTarefa) {

    let dadosTarefaJSON = {}

    let verificacaoTipoTarefa = await tipoTarefaDAO.ctlGetTipoTarefaByID(idTipoTarefa)

    if (verificacaoTipoTarefa.status == 200) {
        let dadosTarefa = await tarefaDAO.mdlSelectByIdTarefa(idTipoTarefa)

        if (dadosTarefa) {
            dadosTarefaJSON.status = message.SUCCESS_REQUEST.status;
            dadosTarefaJSON.message = message.SUCCESS_REQUEST.message;
            dadosTarefaJSON.quantidade = dadosTarefa.length;
            dadosTarefaJSON.tarefa = dadosTarefa
            return dadosTarefaJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    } else {
            return message.ERROR_INVALID_ID_TIPO_TAREFA
    }
}

//Inserir uma nova Tarefa
const ctlInserirTarefa = async function (dadosTarefa) {

    let resultDadosTarefa;

    if (dadosTarefa.nome == '' || dadosTarefa.nome == undefined || dadosTarefa.nome.length > 100 ||
        dadosTarefa.tempo_previsto == '' || dadosTarefa.tempo_previsto == undefined ||
        dadosTarefa.numero == '' || dadosTarefa.numero == undefined ||
        dadosTarefa.foto_peca == '' || dadosTarefa.foto_peca == undefined || dadosTarefa.foto_peca.length > 500 ||
        dadosTarefa.id_tipo_tarefa == '' || dadosTarefa.id_tipo_tarefa == undefined || isNaN(dadosTarefa.id_tipo_tarefa)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let verificacaoTipoTarefa = await tipoTarefaDAO.ctlGetTipoTarefaByID(dadosTarefa.id_tipo_tarefa)

        if (verificacaoTipoTarefa.status != 200) {
            return message.ERROR_INVALID_ID_TIPO_TAREFA
        } else {
            //Envia os dados para a model inserir no Banco de Dados
            resultDadosTarefa = await tarefaDAO.mdlInsertTarefa(dadosTarefa);

            //Valida de o banco de dados inseriu corretamente os dados
            if (resultDadosTarefa) {

                //Chama a função que vai encontrar o ID gerado após o insert
                let novaTarefa = await tarefaDAO.mdlSelectLastId();

                let dadosTarefasJSON = {};
                dadosTarefasJSON.status = message.SUCCESS_CREATED_ITEM.status;
                dadosTarefasJSON.message = message.SUCCESS_CREATED_ITEM.message;
                dadosTarefasJSON.tarefa = novaTarefa;
                return dadosTarefasJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

//Atualizar uma Tarefa
const ctlAtualizarTarefa = async function (dadosTarefa, idTarefa) {

    if (dadosTarefa.nome == '' || dadosTarefa.nome == undefined || dadosTarefa.nome.length > 100 ||
        dadosTarefa.tempo_previsto == '' || dadosTarefa.tempo_previsto == undefined ||
        dadosTarefa.numero == '' || dadosTarefa.numero == undefined ||
        dadosTarefa.foto_peca == '' || dadosTarefa.foto_peca == undefined || dadosTarefa.foto_peca.length > 150 ||
        dadosTarefa.id_tipo_tarefa == '' || dadosTarefa.id_tipo_tarefa == undefined
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idTarefa == '' || idTarefa == undefined || isNaN(idTarefa)) {
        return message.ERROR_INVALID_ID
    } else {
        let verificacaoTipoTarefa = await tipoTarefaDAO.ctlGetTipoTarefaByID(dadosTarefa.id_tipo_tarefa)

        if (verificacaoTipoTarefa.status != 200) {
            return message.ERROR_INVALID_ID_TIPO_TAREFA
        } else {
            //Adiciona o ID da Tarefa no JSON dos dados
            dadosTarefa.id = idTarefa

            let statusID = await tarefaDAO.mdlSelectByIdTarefa(idTarefa);

            if (statusID) {
                let resultDadosTarefa = await tarefaDAO.mdlUpdateTarefa(dadosTarefa);

                if (resultDadosTarefa) {
                    let dadosTarefaJSON = {};
                    dadosTarefaJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                    dadosTarefaJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                    dadosTarefaJSON.tarefa_antiga = statusID;
                    dadosTarefaJSON.tarefa_nova = dadosTarefa;

                    return dadosTarefaJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            } else {
                return message.ERROR_NOT_FOUND;
            }
        }
    }
}

//Excluir uma tarefa existente filtrando pelo id
const ctlDeletarTarefaPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarTarefa = await tarefaDAO.mdlSelectByIdTarefa(id);

        if (buscarTarefa == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let tarefa = await tarefaDAO.mdlDeleteTarefa(id)

            if (tarefa) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetTarefa,
    ctlGetTarefaByID,
    ctlGetBuscarTarefaNome,
    ctlGetBuscarTarefaTipoTarefa,
    ctlInserirTarefa,
    ctlAtualizarTarefa,
    ctlDeletarTarefaPeloID
}