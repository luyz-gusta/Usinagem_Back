/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de CRITERIO
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
var criterioDAO = require('../model/DAO/criterioDAO.js')

//Retorna a lista de todos os professores
const ctlGetCriterios = async () => {
    let dadosCriterioJSON = {}

    let dadosCriterio = await criterioDAO.mdlSelectAllCriterio()

    if (dadosCriterio) {

        const dados = dadosCriterio.map(async criterio => {
            let dadosMargemErro = await controllerMargemErro.ctlGetMargemErroIdCriterio(criterio.id)

            criterio.margem_erro = dadosMargemErro

            return await criterio
        });

        let arrayMargemErro = await Promise.all(dados)

        dadosCriterioJSON = {
            status: message.SUCCESS_REQUEST.status,
            message: message.SUCCESS_REQUEST.message,
            quantidade: dadosCriterio.length,
            criterios: arrayMargemErro
        }
        return dadosCriterioJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND
    }
}

const ctlGetCriterioByID = async (idCriterio) => {
    let dadosCriterioJSON = {}

    if (idCriterio == null || idCriterio == undefined || idCriterio == '') {
        return message.ERROR_REQUIRE_FIELDS
    } else if (isNaN(idCriterio)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosCriterio = await criterioDAO.mdlSelectCriterioByID(idCriterio)

        if (dadosCriterio) {
            const dados = dadosCriterio.map(async criterio => {
                let dadosMargemErro = await controllerMargemErro.ctlGetMargemErroIdCriterio(criterio.id)

                criterio.margem_erro = dadosMargemErro

                return await criterio
            });

            let arrayMargemErro = await Promise.all(dados)

            dadosCriterioJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                quantidade: dadosCriterio.length,
                criterios: arrayMargemErro
            }
            return dadosCriterioJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlGetCriterioByIdTarefa = async (idTarefa) => {
    let dadosCriterioJSON = {}

    if (idTarefa == null || idTarefa == undefined || idTarefa == '') {
        return message.ERROR_REQUIRE_FIELDS
    } else if (isNaN(idTarefa)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosCriterio = await criterioDAO.mdlSelectCriterioByIdTarefa(idTarefa)

        if (dadosCriterio) {
            const dados = dadosCriterio.map(async criterio => {
                let dadosMargemErro = await controllerMargemErro.ctlGetMargemErroIdCriterio(criterio.id)

                criterio.margem_erro = dadosMargemErro

                return await criterio
            });

            let arrayMargemErro = await Promise.all(dados)

            dadosCriterioJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                quantidade: dadosCriterio.length,
                criterios: arrayMargemErro
            }
            return dadosCriterioJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlInserirCriterio = async (dadosCriterio) => {
    if (
        dadosCriterio.descricao == '' || dadosCriterio.descricao == null || dadosCriterio.descricao == undefined || dadosCriterio.descricao.length > 350 ||
        dadosCriterio.nota_valida == null || dadosCriterio.nota_valida == undefined ||
        dadosCriterio.resultado_desejado.length > 15 ||
        dadosCriterio.tipo_critico == null || dadosCriterio.tipo_critico == undefined ||
        dadosCriterio.id_tarefa == null || dadosCriterio.id_tarefa == undefined || dadosCriterio.id_tarefa == ''
    ) {
        console.log(dadosCriterio.descricao + '-' + dadosCriterio.nota_valida + '-' + dadosCriterio.resultado_desejado + '-' + dadosCriterio.tipo_critico + '-' + dadosCriterio.id_tarefa);
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let resultDadosCriterio = await criterioDAO.mdlInsertCriterio(dadosCriterio)

        if (resultDadosCriterio) {
            let novoCriterio = await criterioDAO.mdlSelectLastByID()

            let dadosCriterioJSON = {
                status: message.SUCCESS_CREATED_ITEM.status,
                message: message.SUCCESS_CREATED_ITEM.message,
                criterio: novoCriterio
            }
            return dadosCriterioJSON
        }else{
            return message.ERROR_INTERNAL_SERVER
        }
    }

}

module.exports = {
    ctlGetCriterios,
    ctlGetCriterioByID,
    ctlGetCriterioByIdTarefa,
    ctlInserirCriterio
}