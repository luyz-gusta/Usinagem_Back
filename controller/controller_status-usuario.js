/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de STATUS DE USUARIO
 *  Autor: Muryllo e Luiz
 *  Data: 25/05/2023
 *  Versão: 1.0
 **************************************************************************************/

/**
 * Métodos com inicio 'ctl' são funções da controller
 * e
 * Métodos com inicio 'mdl' são funções da model
 */


//Import do arquivo de configuração das variaveis, constantes e funções globais
var message = require('./modulo/config.js')

//Import do arquivo DAO para acessar dados do status de usuario no BD
var statusUsuarioDAO = require('../model/DAO/statusUsuarioDAO.js')

//Retorna a lista de todos os alunos
const ctlGetStatusUsuario = async function () {

    let dadosStatusUsuarioJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosStatusUsuario = await statusUsuarioDAO.mdlselectAllStatusUsuario();

    if (dadosStatusUsuario) {
        //Criando um JSON com o atributo aluno, para encaminhar um array de alunos
        dadosStatusUsuarioJSON.status = message.SUCCESS_REQUEST.status;
        dadosStatusUsuarioJSON.message = message.SUCCESS_REQUEST.message;
        dadosStatusUsuarioJSON.quantidade = dadosStatusUsuario.length;
        dadosStatusUsuarioJSON.status_de_usuario = dadosStatusUsuario
        return dadosStatusUsuarioJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }

}

//Retorna o aluno filtrando pelo ID
const ctlGetBuscarStatusUsuarioID = async function (id) {

    let idNumero = id

    if (idNumero === undefined || idNumero === '' || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosStatusUsuarioJSON = {}

        let dadosStatusUsuario = await statusUsuarioDAO.mdlSelectStatusUsuarioById(idNumero);

        if (dadosStatusUsuario) {
            //Criando um JSON com o atributo aluno, para encaminhar um array de alunos
            dadosStatusUsuarioJSON.status = message.SUCCESS_REQUEST.status;
            dadosStatusUsuarioJSON.message = message.SUCCESS_REQUEST.message;
            dadosStatusUsuarioJSON.status_de_usuario = dadosStatusUsuario
            return dadosStatusUsuarioJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Retorna o aluno filtrando pelo NOME
const ctlGetBuscarStatusUsuarioNome = async function (nome) {

    let nomeStatus = nome

    if (nomeStatus === undefined || nomeStatus === '' || !isNaN(nomeStatus) || nomeStatus.length > 20) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let dadosStatusUsuarioJSON = {}

        let dadosStatusUsuario = await statusUsuarioDAO.mdlSelectStatusUsuarioByName(nomeStatus);

        if (dadosStatusUsuario) {
            //Criando um JSON com o atributo aluno, para encaminhar um array de alunos
            dadosStatusUsuarioJSON.status = message.SUCCESS_REQUEST.status;
            dadosStatusUsuarioJSON.message = message.SUCCESS_REQUEST.message;
            dadosStatusUsuarioJSON.status_de_usuario = dadosStatusUsuario
            return dadosStatusUsuarioJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Insere um novo status de usuario no banco
const ctlInsertStatusUsuario = async function (statusUsuario) {

    let resultStatusUsuario;

    if (statusUsuario.nivel === undefined || statusUsuario.nivel === '' || statusUsuario.nivel.length > 20) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        resultStatusUsuario = await statusUsuarioDAO.mdlInsertStatusUsuario(statusUsuario);

        //Valida de o banco de dados inseriu corretamente os dados
        if (resultStatusUsuario) {
            //Chama a função que vai encontrar o ID gerado após o insert
            let novoStatus = await statusUsuarioDAO.mdlSelectLastId();

            let dadosStatusUsuarioJSON = {};
            dadosStatusUsuarioJSON.status = message.SUCCESS_CREATED_ITEM.status;
            dadosStatusUsuarioJSON.status_usuario = novoStatus;
            return dadosStatusUsuarioJSON;
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

//Atualizar um status de usuario existente 
const ctlAtualizarStatusUsuarioID = async function (dadosStatus, idStatus) {

    if (dadosStatus.nivel == '' || dadosStatus.nivel == undefined || dadosStatus.nivel.length > 20) {
        return message.ERROR_REQUIRE_FIELDS
        //Validaçaõ do ID incorreto ou não informado
    } else if (idStatus == '' || idStatus == undefined || isNaN(idStatus)) {
        return message.ERROR_INVALID_ID
    } else {
        //Adiciona o ID do status usuario no JSON dos dados
        dadosStatus.id = idStatus

        let statusID = await statusUsuarioDAO.mdlSelectStatusUsuarioById(idStatus);

        if (statusID) {
            let resultDadosStatusUsuario = await statusUsuarioDAO.mdlUpdateStatusUsuarioID(dadosStatus);

            if (resultDadosStatusUsuario) {

                let dadosStatusUsuarioJSON = {};
                dadosStatusUsuarioJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                dadosStatusUsuarioJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                dadosStatusUsuarioJSON.aluno = dadosStatus;

                return dadosStatusUsuarioJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }

    }

}

//Excluir um status de usuario existente
const ctlDeletarStatusUsuario = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarStatus = await statusUsuarioDAO.mdlSelectStatusUsuarioById(id)

        if (buscarStatus  == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let status = await statusUsuarioDAO.mdlDeleteStatusUsuarioID(id)

            if (status) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetStatusUsuario,
    ctlGetBuscarStatusUsuarioID,
    ctlGetBuscarStatusUsuarioNome,
    ctlInsertStatusUsuario,
    ctlAtualizarStatusUsuarioID,
    ctlDeletarStatusUsuario,
}