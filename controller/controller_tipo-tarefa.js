/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de TIPO DE TAREFA
 *  Autor: Luiz e Muryllo
 *  Data: 25/05/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados da TipoTarefa no BD
var tipoTarefaDAO = require('../model/DAO/tipoTarefaDAO.js')

var message = require('./modulo/config.js')

//Retorna a lista de todos os tipos de tarefa
const ctlGetTipoTarefa = async function () {

    let dadosTipoTarefaJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosTipoTarefa = await tipoTarefaDAO.mdlSelectAllTiposTarefas();

    if (dadosTipoTarefa) {
        //Criando um JSON com o atributo TipoTarefas, para encaminhar um array de TipoTarefas
        dadosTipoTarefaJSON.status = message.SUCCESS_REQUEST.status;
        dadosTipoTarefaJSON.message = message.SUCCESS_REQUEST.message;
        dadosTipoTarefaJSON.quantidade = dadosTipoTarefa.length;
        dadosTipoTarefaJSON.tipoTarefas = dadosTipoTarefa
        return dadosTipoTarefaJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }
}

//Retorna um registro de tipo de tarefa filtrada pelo ID
const ctlGetTipoTarefaByID = async function (id) {

    let idNumero = id

    //Validação do ID
    if (idNumero == '' || id == undefined || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosTipoTarefaJSON = {}

        let dadosTipoTarefa = await tipoTarefaDAO.mdlSelectByIdTipoTarefa(idNumero)

        if (dadosTipoTarefa) {
            //Criando um JSON com o atributo TipoTarefa, para encaminhar um array de TipoTarefas
            dadosTipoTarefaJSON.status = message.SUCCESS_REQUEST.status;
            dadosTipoTarefaJSON.message = message.SUCCESS_REQUEST.message;
            dadosTipoTarefaJSON.tipoTarefa = dadosTipoTarefa
            return dadosTipoTarefaJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Retorna uma TipoTarefa filtrando pelo nome
const ctlGetBuscarTipoTarefaNome = async function (nome) {

    let nomeTipoTarefa = nome

    let dadosTipoTarefaJSON = {}

    let dadosTipoTarefa = await tipoTarefaDAO.mdlSelectByNameTipoTarefa(nomeTipoTarefa)

    if (dadosTipoTarefa) {
        dadosTipoTarefaJSON.status = message.SUCCESS_REQUEST.status;
        dadosTipoTarefaJSON.message = message.SUCCESS_REQUEST.message;
        dadosTipoTarefaJSON.tipoTarefa = dadosTipoTarefa
        return dadosTipoTarefaJSON
    } else {
        return message.ERROR_INVALID_NOME;
    }
}

//Inserir um novo tipo de tarefa
const ctlInserirTipoTarefa = async function (dadosTipoTarefa) {

    let resultDadosTipoTarefa;

    if (dadosTipoTarefa.nome == '' || dadosTipoTarefa.nome == undefined || dadosTipoTarefa.nome.length > 45
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else {

        //Envia os dados para a model inserir no Banco de Dados
        resultDadosTipoTarefa = await tipoTarefaDAO.mdlInsertTipoTarefa(dadosTipoTarefa)

        //Valida de o banco de dados inseriu corretamente os dados
        if (resultDadosTipoTarefa) {

            //Chama a função que vai encontrar o ID gerado após o insert
            let novaTipoTarefa = await tipoTarefaDAO.mdlSelectLastId()

            let dadosTipoTarefaJSON = {};
            dadosTipoTarefaJSON.status = message.SUCCESS_CREATED_ITEM.status;
            dadosTipoTarefaJSON.message = message.SUCCESS_CREATED_ITEM.message;
            dadosTipoTarefaJSON.tipoTarefa = novaTipoTarefa;
            return dadosTipoTarefaJSON
        } else {
            return message.ERROR_INTERNAL_SERVER
        }

    }
}

//Atualizar um Tipo de Tarefa
const ctlAtualizarTipoTarefa = async function (dadosTipoTarefa, idTipoTarefa) {

    if (dadosTipoTarefa.nome == '' || dadosTipoTarefa.nome == undefined || dadosTipoTarefa.nome.length > 45
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idTipoTarefa == '' || idTipoTarefa == undefined || isNaN(idTipoTarefa)) {
        return message.ERROR_INVALID_ID
    } else {

        //Adiciona o ID da TipoTarefa no JSON dos dados
        dadosTipoTarefa.id = idTipoTarefa

        let statusID = await tipoTarefaDAO.mdlSelectByIdTipoTarefa(idTipoTarefa);
        if (statusID == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            if (statusID) {
                let resultDadosTipoTarefa = await tipoTarefaDAO.mdlUpdateTipoTarefa(dadosTipoTarefa);

                if (resultDadosTipoTarefa) {

                    let dadosTipoTarefaJSON = {};
                    dadosTipoTarefaJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                    dadosTipoTarefaJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                    dadosTipoTarefaJSON.tipoTarefa = dadosTipoTarefa;

                    return dadosTipoTarefaJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            } else {
                return message.ERROR_NOT_FOUND;
            }

        }
    }
}

//Excluir um tipo de tarefa existente filtrando pelo id
const ctlDeletarTipoTarefaPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarTipoTarefa = await tipoTarefaDAO.mdlSelectByIdTipoTarefa(id);

        if (buscarTipoTarefa == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let tipoTarefa = await tipoTarefaDAO.mdlDeleteTipoTarefa(id)

            if (tipoTarefa) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetTipoTarefa,
    ctlGetTipoTarefaByID,
    ctlGetBuscarTipoTarefaNome,
    ctlInserirTipoTarefa,
    ctlAtualizarTipoTarefa,
    ctlDeletarTipoTarefaPeloID
}