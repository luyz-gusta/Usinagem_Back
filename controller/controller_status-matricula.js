/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de Status da Matricula
 *  Autor: Luiz e Muryllo
 *  Data: 31/05/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados da Registro de Tempo no BD
var statusMatriculaDAO = require('../model/DAO/statusMatriculaDAO.js')

var message = require('./modulo/config.js')

//Retorna a lista de todas as StatusMatriculas
const ctlGetStatusMatricula = async function () {

    let dadosStatusMatriculaJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosStatusMatricula = await statusMatriculaDAO.mdlSelectAllStatusMatricula();

    if (dadosStatusMatricula) {
        //Criando um JSON com o atributo StatusMatriculas, para encaminhar um array de StatusMatriculas
        dadosStatusMatriculaJSON.status = message.SUCCESS_REQUEST.status;
        dadosStatusMatriculaJSON.message = message.SUCCESS_REQUEST.message;
        dadosStatusMatriculaJSON.quantidade = dadosStatusMatricula.length;
        dadosStatusMatriculaJSON.status_matriculas = dadosStatusMatricula
        return dadosStatusMatriculaJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }
}

//Retorna um registro de StatusMatricula filtrada pelo ID
const ctlGetStatusMatriculaByID = async function (id) {

    let idNumero = id

    //Validação do ID
    if (idNumero == '' || id == undefined || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosStatusMatriculaJSON = {}

        let dadosStatusMatricula = await statusMatriculaDAO.mdlSelectStatusMatriculaByID(idNumero)

        if (dadosStatusMatricula) {
            //Criando um JSON com o atributo StatusMatricula, para encaminhar um array de StatusMatriculas
            dadosStatusMatriculaJSON.status = message.SUCCESS_REQUEST.status;
            dadosStatusMatriculaJSON.message = message.SUCCESS_REQUEST.message;
            dadosStatusMatriculaJSON.status_matricula = dadosStatusMatricula
            return dadosStatusMatriculaJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Retorna um registro de StatusMatricula filtrada pelo nome
const ctlGetStatusMatriculaByName = async function (nome) {

    let nomeStatusMatricula = nome

    //Validação do ID
    if (nomeStatusMatricula == '' || nomeStatusMatricula == undefined) {
        return message.ERROR_INVALID_NOME
    } else {

        let dadosStatusMatriculaJSON = {}

        let dadosStatusMatricula = await statusMatriculaDAO.mdlSelectByNameStatusMatricula(nomeStatusMatricula)

        if (dadosStatusMatricula) {
            dadosStatusMatriculaJSON.status = message.SUCCESS_REQUEST.status;
            dadosStatusMatriculaJSON.message = message.SUCCESS_REQUEST.message;
            dadosStatusMatriculaJSON.Status_matricula = dadosStatusMatricula
            return dadosStatusMatriculaJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Inserir uma nova StatusMatricula
const ctlInserirStatusMatricula = async function (dadosStatusMatricula) {

    let resultDadosStatusMatricula;

    if (dadosStatusMatricula.nome == '' || dadosStatusMatricula.nome == undefined || dadosStatusMatricula.nome.length > 50) {
        return message.ERROR_REQUIRE_FIELDS
    } else {

        //Envia os dados para a model inserir no Banco de Dados
        resultDadosStatusMatricula = await statusMatriculaDAO.mdlInsertStatusMatricula(dadosStatusMatricula);

        //Valida de o banco de dados inseriu corretamente os dados
        if (resultDadosStatusMatricula) {

            //Chama a função que vai encontrar o ID gerado após o insert
            let novaStatusMatricula = await statusMatriculaDAO.mdlSelectLastId();

            let dadosStatusMatriculasJSON = {};
            dadosStatusMatriculasJSON.status = message.SUCCESS_CREATED_ITEM.status;
            dadosStatusMatriculasJSON.message = message.SUCCESS_CREATED_ITEM.message;
            dadosStatusMatriculasJSON.status_matricula = novaStatusMatricula;
            return dadosStatusMatriculasJSON
        } else {
            return message.ERROR_INTERNAL_SERVER
        }

    }
}

//Atualizar um Status da Matricula
const ctlAtualizarStatusMatricula = async function (dadosStatusMatricula, idStatusMatricula) {

    if (dadosStatusMatricula.nome == '' || dadosStatusMatricula.nome == undefined || dadosStatusMatricula.nome.length > 50) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idStatusMatricula == '' || idStatusMatricula == undefined || isNaN(idStatusMatricula)) {
        return message.ERROR_INVALID_ID
    } else {

        //Adiciona o ID da StatusMatricula no JSON dos dados
        dadosStatusMatricula.id = idStatusMatricula

        let statusID = await statusMatriculaDAO.mdlSelectStatusMatriculaByID(idStatusMatricula);

        if (statusID) {
            let resultDadosStatusMatricula = await statusMatriculaDAO.mdlUpdateStatusMatricula(dadosStatusMatricula);

            if (resultDadosStatusMatricula) {

                let dadosStatusMatriculaJSON = {};
                dadosStatusMatriculaJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                dadosStatusMatriculaJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                dadosStatusMatriculaJSON.status_matricula = dadosStatusMatricula;

                return dadosStatusMatriculaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_NOT_FOUND;
        }

    }
}

//Excluir um status da matricula existente filtrando pelo id
const ctlDeletarStatusMatriculaPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarStatusMatricula = await statusMatriculaDAO.mdlSelectStatusMatriculaByID(id);

        if (buscarStatusMatricula == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let StatusMatricula = await statusMatriculaDAO.mdlDeleteStatusMatricula(id)

            if (StatusMatricula) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetStatusMatricula,
    ctlGetStatusMatriculaByID,
    ctlGetStatusMatriculaByName,
    ctlInserirStatusMatricula,
    ctlAtualizarStatusMatricula,
    ctlDeletarStatusMatriculaPeloID
}