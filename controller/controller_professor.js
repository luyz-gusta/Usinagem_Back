/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de PROFESSORES
 *  Autor: Luiz e Muryllo
 *  Data: 14/04/2023
 *  Versão: 1.0
 **************************************************************************************/

/**********************************************************
* Métodos com inicio 'ctl' são funcões do controller
* e
* Métodos com inicio 'mdl' são funcões do model
**********************************************************/

var message = require('./modulo/config.js')

//Import do arquivo DAO para acessar dados do aluno no BD
var professorDAO = require('../model/DAO/professorDAO.js')

//Retorna a lista de todos os professores
const ctlGetProfessores = async function () {
    let dadosProfessorJSON = {}

    let dadosProfessor = await professorDAO.mdlSelectAllProfessores()

    if (dadosProfessor) {
        dadosProfessorJSON = {
            status: message.SUCCESS_REQUEST.status,
            message: message.SUCCESS_REQUEST.message,
            quantidade: dadosProfessor.length,
            professores: dadosProfessor
        }
        return dadosProfessorJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND
    }
}

//Retorna o professores filtrando pelo ID
const ctlGetBuscarProfessorID = async function (id) {
    let dadosProfessorJSON = {}

    if (id == null || id == undefined || id == '') {
        return message.ERROR_REQUIRE_FIELDS
    } else if (isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosProfessor = await professorDAO.mdlSelectProfessorByID(id)

        if (dadosProfessor) {
            dadosProfessorJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                professores: dadosProfessor
            }
            return dadosProfessorJSON
        } else {
            return message.ERROR_INVALID_ID
        }
    }
}

//Retorna o professor filtrando pelo nome
const ctlGetBuscarProfessorNome = async function (nome) {
    let dadosProfessorJSON = {}

    if (nome == null || nome == undefined || nome == '') {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let dadosProfessor = await professorDAO.mdlSelectProfessorByName(nome)

        if (dadosProfessor) {
            dadosProfessorJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                professores: dadosProfessor
            }
            return dadosProfessorJSON
        } else {
            return message.ERROR_INVALID_ID
        }
    }
}

//Inserir um novo professor
const ctlInserirProfessor = async function (dadosProfessor) {
    if (
        dadosProfessor.nome == '' || dadosProfessor.nome == null || dadosProfessor.nome == undefined || dadosProfessor.nome.length > 50 ||
        dadosProfessor.nif == '' || dadosProfessor.nif == null || dadosProfessor.nif == undefined || dadosProfessor.nif.length > 15 ||
        dadosProfessor.email == '' || dadosProfessor.email == null || dadosProfessor.email == undefined || dadosProfessor.email.length > 255 ||
        dadosProfessor.id_usuario == '' || dadosProfessor.id_usuario == null || dadosProfessor.id_usuario == undefined || isNaN(dadosProfessor.id_usuario)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (dadosProfessor.telefone.length > 15 || dadosProfessor.telefone < 8 && dadosProfessor.telefone != '') {
        return message.ERROR_INVALID_TELEFONE
    } else {
        let verificacaoIdUsuario = await usuarioDAO.mdlSelectUsuarioByID(dadosProfessor.id_usuario)

        if (verificacaoIdUsuario) {
            let verificacaoProfessor = await professorDAO.mdlSelectProfessorByNif(dadosProfessor.nif)

            if (verificacaoProfessor) {
                return message.ERROR_EXISTING_PROFESSOR
            } else {
                let resultDadosProfessor = await professorDAO.mdlInsertProfessor(dadosProfessor)

                if (resultDadosProfessor) {
                    let novoProfessor = await professorDAO.mdlSelectLastByID()

                    let dadosProfessorJSON = {
                        status: message.SUCCESS_CREATED_ITEM.status,
                        message: message.SUCCESS_CREATED_ITEM.message,
                        professores: novoProfessor
                    }
                    return dadosProfessorJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            }
        } else {
            return message.ERROR_NOT_EXISTING_ID_USUARIO
        }
    }
}

//Atualizar um professor existente filtrando pelo id
const ctlAtualizarProfessor = async function (dadosProfessor, idProfessor) {
    if (
        dadosProfessor.nome == '' || dadosProfessor.nome == null || dadosProfessor.nome == undefined || dadosProfessor.nome.length > 50 ||
        dadosProfessor.nif == '' || dadosProfessor.nif == null || dadosProfessor.nif == undefined || dadosProfessor.nif.length > 15 ||
        dadosProfessor.email == '' || dadosProfessor.email == null || dadosProfessor.email == undefined || dadosProfessor.email.length > 255
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (dadosProfessor.telefone.length > 15 || dadosProfessor.telefone < 8 && dadosProfessor.telefone != '') {
        return message.ERROR_INVALID_TELEFONE
    } else if (idProfessor == null || idProfessor == '' || idProfessor == undefined || isNaN(idProfessor)) {
        return message.ERROR_INVALID_ID
    } else {
        dadosProfessor.id = idProfessor

        let dadosProfessorAntigo = await professorDAO.mdlSelectProfessorByID(idProfessor)

        if (dadosProfessorAntigo) {
            let resultDadosProfessor = await professorDAO.mdlUpdateProfessor(dadosProfessor)

            if (resultDadosProfessor) {
                let dadosProfessorNovo = await professorDAO.mdlSelectProfessorByID(idProfessor)

                let dadosProfessorJSON = {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    professor_antigo: dadosProfessorAntigo,
                    professor_novo: dadosProfessorNovo
                }
                return dadosProfessorJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }

        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

//Excluir um professor filtrando pelo id
const ctlDeletarProfessor = async function (idProfessor) {
    if (idProfessor == null || idProfessor == '' || idProfessor == undefined || isNaN(idProfessor)) {
        return message.ERROR_INVALID_ID
    } else {
        let buscarProfessor = await professorDAO.mdlSelectProfessorByID(idProfessor)

        if (buscarProfessor) {
            let professor = await professorDAO.mdlDeleteProfessor(idProfessor)

            if (professor) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

module.exports = {
    ctlGetProfessores,
    ctlGetBuscarProfessorID,
    ctlGetBuscarProfessorNome,
    ctlInserirProfessor,
    ctlAtualizarProfessor,
    ctlDeletarProfessor
}