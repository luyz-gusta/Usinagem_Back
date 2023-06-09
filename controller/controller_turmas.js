/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de TRUMAS
 *  Autor: Luiz, Muryllo e Millena
 *  Data: 14/04/2023
 *  Versão: 1.0
 **************************************************************************************/

var message = require('./modulo/config.js')

var turmasDAO = require('../model/DAO/turmaDAO.js')

var cursoDAO = require('../model/DAO/cursoDAO.js')

// Retorna a lista de todas as turmas
const ctlGetTurmas = async () => {
    let dadosTurmasJSON = {}

    console.log('controller-turma');

    let dadosTurmas = await turmasDAO.mdlSelectAllTurma()

    if(dadosTurmas){

        dadosTurmasJSON = {
            status: message.SUCCESS_REQUEST.status,
            message: message.SUCCESS_REQUEST.message,
            quantidade: dadosTurmas.length,
            turmas: dadosTurmas
        }
        return dadosTurmasJSON
    }else{
        return message.ERROR_REGISTER_NOT_FOUND
    }
}

const ctlGetTurmasID = async (id) => {

    let dadosTurmasJSON = {};

    if (id == null || id == undefined || id == '') {
        return message.ERROR_REQUIRE_FIELDS
    }else{

        let dadosTurmas = await turmasDAO.mdlSelectByIdTurma(id)

        if(dadosTurmas){
            dadosTurmasJSON = {
                status : message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                turma : dadosTurmas
            }
            return dadosTurmasJSON
        }else{
            return message.ERROR_REGISTER_NOT_FOUND
        }

    }

}

const ctlGetTurmasNome = async (nome) => {

    let dadosTurmasJSON = {};

    if (nome == null || nome == undefined || nome == '') {
        return message.ERROR_REQUIRE_FIELDS
    }else{

        let dadosTurmas = await turmasDAO.mdlSelectByNameTurma(nome)

        if(dadosTurmas){
            dadosTurmasJSON = {
                status : message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                turma : dadosTurmas
            }
            return dadosTurmasJSON
        }else{
            return message.ERROR_INVALID_NOME
        }

    }

}

const ctlGetTurmasIDCurso = async (idCurso) => {
    let dadosTurmasJSON = {};

    if (idCurso == null || idCurso == undefined || idCurso == '') {
        return message.ERROR_REQUIRE_FIELDS
    }else{

        let dadosTurmas = await turmasDAO.mdlSelectTurmaByIDCurso(idCurso)

        if(dadosTurmas){
            dadosTurmasJSON = {
                status : message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                turmas : dadosTurmas
            }
            return dadosTurmasJSON
        }else{
            return message.ERROR_INVALID_ID_CURSO
        }

    }
}

const ctlGetInserirTurma = async (dadosTurmas) => {
    
    if(
        dadosTurmas.nome == '' || dadosTurmas.nome == null || dadosTurmas.nome == undefined || dadosTurmas.nome.length > 45 ||
        dadosTurmas.data_inicio == '' || dadosTurmas.data_inicio == null || dadosTurmas.data_inicio == undefined || 
        dadosTurmas.data_conclusao == '' || dadosTurmas.data_conclusao == null || dadosTurmas.data_conclusao == undefined ||
        dadosTurmas.descricao == '' || dadosTurmas.descricao == null || dadosTurmas.descricao == undefined || 
        dadosTurmas.semestre == '' || dadosTurmas.semestre == null || dadosTurmas.semestre == undefined || isNaN(dadosTurmas.semestre) ||
        dadosTurmas.id_curso == '' || dadosTurmas.id_curso == null || dadosTurmas.id_curso == undefined || isNaN(dadosTurmas.id_curso)

    ){
        console.log(dadosTurmas);
        return message.ERROR_REQUIRE_FIELDS
        
    } else{
        let verificarIdCurso = await cursoDAO.mdlSelectCursoByID(dadosTurmas.id_curso)

        if (verificarIdCurso == false) {
            return message.ERROR_INVALID_ID_CURSO
        } else {

            let resultDadosTurma = await turmasDAO.mdlInsertTurma(dadosTurmas)

            if (resultDadosTurma) {

                let novaTurma = await turmasDAO.mdlSelectLastId()

                let dadosTurmasJSON = {
                    status : message.SUCCESS_CREATED_ITEM.status,
                    message : message.SUCCESS_CREATED_ITEM.message,
                    turmas : novaTurma
                }
                return dadosTurmasJSON   
            }else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

const ctlAtualizarTurma = async (dadosTurmas, idTurma) => {
    if(
        dadosTurmas.nome == '' || dadosTurmas.nome == null || dadosTurmas.nome == undefined || dadosTurmas.nome.length > 45 ||
        dadosTurmas.data_inicio == '' || dadosTurmas.data_inicio == null || dadosTurmas.data_inicio == undefined || 
        dadosTurmas.data_conclusao == '' || dadosTurmas.data_conclusao == null || dadosTurmas.data_conclusao == undefined ||
        dadosTurmas.descricao == '' || dadosTurmas.descricao == null || dadosTurmas.descricao == undefined || 
        dadosTurmas.semestre == '' || dadosTurmas.semestre == null || dadosTurmas.semestre == undefined || isNaN(dadosTurmas.semestre) ||
        dadosTurmas.id_curso == '' || dadosTurmas.id_curso == null || dadosTurmas.id_curso == undefined || isNaN(dadosTurmas.id_curso)

    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idTurma == null || idTurma == '' || idTurma == undefined || isNaN(idTurma)){
        //console.log(idTurma);
        return message.ERROR_INVALID_ID
    } else {
        dadosTurmas.id = idTurma

        let dadosTurmaAntiga = await turmasDAO.mdlSelectByIdTurma(idTurma)

        if (dadosTurmaAntiga) {

            let resultDadosTurma = await turmasDAO.mdlUpdateTurma(dadosTurmas)

            if (resultDadosTurma) {
                let dadosTurmaNova = await turmasDAO.mdlSelectByIdTurma(idTurma)

                let dadosTurmasJSON = {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    turma_antiga : dadosTurmaAntiga,
                    turma_nova : dadosTurmaNova
                }

                return dadosTurmasJSON
            }else {
                return message.ERROR_INTERNAL_SERVER
            }
            
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlDeletarTurma = async (idTurma) => {

    if (idTurma == '' || idTurma == undefined || idTurma == null || isNaN(idTurma)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarTurma = await turmasDAO.mdlSelectByIdTurma(idTurma)

        if (buscarTurma) {
            let turma = await turmasDAO.mdlDeleteTurma(idTurma)

            if (turma) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

module.exports = {
    ctlGetTurmas,
    ctlGetTurmasID,
    ctlGetTurmasNome,
    ctlGetTurmasIDCurso,
    ctlGetInserirTurma,
    ctlAtualizarTurma,
    ctlDeletarTurma
}