/************************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Cursos
 * Autor: Luiz Gustavo
 * Data: 12/05/2023
 * Versão: 1.0
************************************************************************************************/

/**********************************************************
* Métodos com inicio 'ctl' são funcões do controller
* e
* Métodos com inicio 'mdl' são funcões do model
**********************************************************/

var message = require('./modulo/config.js')

//Import do arquivo DAO para acessar dados do aluno no BD
var cursoDAO = require('../model/DAO/cursoDAO.js')


//Retorna todos os cursos
const ctlGetCursos = async () => {
    let dadosCursoJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os resgistros do DB
    let dadosCurso = await cursoDAO.mdlSelectAllCursos()

    if (dadosCurso) {
        dadosCursoJSON = {
            status: message.SUCCESS_REQUEST.status,
            message: message.SUCCESS_REQUEST.message,
            quantidade: dadosCurso.length,
            cursos: dadosCurso
        }
        return dadosCursoJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND
    }
}

const ctlGetCursosID = async (id) => {
    let dadosCursoJSON = {}

    if (id == null || id == undefined || id == '') {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let dadosCurso = await cursoDAO.mdlSelectCursoByID(id)

        if (dadosCurso) {
            dadosCursoJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                cursos: dadosCurso
            }
            return dadosCursoJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlGetCursosNome = async (nome) => {
    let dadosCursoJSON = {}

    if (nome == null || nome == undefined || nome == '') {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let dadosCurso = await cursoDAO.mdlSelectCursoByName(nome)

        if (dadosCurso) {
            dadosCursoJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                cursos: dadosCurso
            }
            return dadosCursoJSON
        } else {
            return message.ERROR_INVALID_NOME
        }
    }
}

const ctlGetCursosSigla = async (sigla) => {
    let dadosCursoJSON = {}

    if (sigla == null || sigla == '' || sigla == undefined) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let dadosCurso = await cursoDAO.mdlSelectCursoBySigla(sigla)

        if (dadosCurso) {
            dadosCursoJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                cursos: dadosCurso
            }
            return dadosCursoJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlInserirCurso = async (dadosCurso) => {
    if (
        dadosCurso.nome == '' || dadosCurso.nome == null || dadosCurso.nome == undefined || dadosCurso.nome.length > 100 ||
        dadosCurso.carga_horaria == '' || dadosCurso.carga_horaria == null || dadosCurso.carga_horaria == undefined || isNaN(dadosCurso.carga_horaria) ||
        dadosCurso.descricao == '' || dadosCurso.descricao == null || dadosCurso.descricao == undefined ||
        dadosCurso.sigla == '' || dadosCurso.sigla == null || dadosCurso.sigla == undefined || dadosCurso.sigla.length > 5 ||
        dadosCurso.foto == '' || dadosCurso.foto == null || dadosCurso.foto == undefined || dadosCurso.foto > 150
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let verificacaoCurso = await cursoDAO.mdlSelectCursoByName(dadosCurso.nome)

        if (verificacaoCurso) {
            return message.ERROR_EXISTING_CURSO
        } else {
            let resultDadosCurso = await cursoDAO.mdlInsertCurso(dadosCurso)

            //Valida se o BD inseriu corretamente
            if (resultDadosCurso) {
                let novoCurso = await cursoDAO.mdlSelectLastByID()

                let dadosCursoJSON = {
                    status: message.SUCCESS_CREATED_ITEM.status,
                    message: message.SUCCESS_CREATED_ITEM.message,
                    cursos: novoCurso
                }
                return dadosCursoJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

const ctlAtualizarCurso = async (dadosCurso, idCurso) => {

    if (
        dadosCurso.nome == '' || dadosCurso.nome == null || dadosCurso.nome == undefined || dadosCurso.nome.length > 100 ||
        dadosCurso.carga_horaria == '' || dadosCurso.carga_horaria == null || dadosCurso.carga_horaria == undefined || isNaN(dadosCurso.carga_horaria) ||
        dadosCurso.descricao == '' || dadosCurso.descricao == null || dadosCurso.descricao == undefined ||
        dadosCurso.sigla == '' || dadosCurso.sigla == null || dadosCurso.sigla == undefined || dadosCurso.sigla.length > 5 ||
        dadosCurso.foto == '' || dadosCurso.foto == null || dadosCurso.foto == undefined || dadosCurso.foto > 150
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idCurso == null || idCurso == '' || idCurso == undefined || isNaN(idCurso)) {
        return message.ERROR_INVALID_ID
    } else {
        dadosCurso.id = idCurso

        let dadosCursoAntigo = await cursoDAO.mdlSelectCursoByID(idCurso)

        if (dadosCursoAntigo) {

            let resultDadosCurso = await cursoDAO.mdlUpdateCurso(dadosCurso)

            if (resultDadosCurso) {
                let dadosCursoNovo = await cursoDAO.mdlSelectCursoByID(idCurso)

                let dadosCursoJSON = {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    curso_antigo: dadosCursoAntigo,
                    curso_novo: dadosCursoNovo
                }

                return dadosCursoJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }

        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlExcluirCursos = async (idCurso) => {

    if (idCurso == '' || idCurso == undefined || idCurso == null || isNaN(idCurso)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarCurso = await cursoDAO.mdlSelectCursoByID(idCurso)

        if (buscarCurso) {
            let curso = await cursoDAO.mdlDeleteCurso(idCurso)

            if (curso) {
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
    ctlGetCursos,
    ctlGetCursosID,
    ctlGetCursosNome,
    ctlGetCursosSigla,
    ctlInserirCurso,
    ctlAtualizarCurso,
    ctlExcluirCursos
}
