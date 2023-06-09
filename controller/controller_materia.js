/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de MATERIA
 *  Autor: Luiz e Muryllo
 *  Data: 25/05/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados da materia no BD
var materiaDAO = require('../model/DAO/materiaDAO.js')

var controllerCurso = require('./controller_curso.js')

var cursoDAO = require('../model/DAO/cursoDAO.js')

var message = require('./modulo/config.js')

//Retorna a lista de todos as materias
const ctlGetMaterias = async function () {

    let dadosMateriaJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMateria = await materiaDAO.mdlSelectAllMaterias();

    if (dadosMateria) {
        //Criando um JSON com o atributo materias, para encaminhar um array de materias
        dadosMateriaJSON.status = message.SUCCESS_REQUEST.status;
        dadosMateriaJSON.message = message.SUCCESS_REQUEST.message;
        dadosMateriaJSON.quantidade = dadosMateria.length;
        dadosMateriaJSON.materias = dadosMateria
        return dadosMateriaJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }

}

const ctlGetMateriaByID = async function (id) {

    let idNumero = id

    //Validação do ID
    if (idNumero == '' || id == undefined || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosMateriaJSON = {}

        let dadosMateria = await materiaDAO.mdlSelectByIdMateria(idNumero)

        if (dadosMateria) {
            //Criando um JSON com o atributo materia, para encaminhar um array de materias
            dadosMateriaJSON.status = message.SUCCESS_REQUEST.status;
            dadosMateriaJSON.message = message.SUCCESS_REQUEST.message;
            dadosMateriaJSON.materia = dadosMateria
            return dadosMateriaJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Retorna uma materia filtrando pelo sigla
const ctlGetBuscarMateriaSigla = async function (sigla) {

    let siglaMateria = sigla

    let dadosMateriaJSON = {}

    let dadosMateria = await materiaDAO.mdlSelectBySiglaMateria(siglaMateria)

    if (dadosMateria) {
        dadosMateriaJSON.status = message.SUCCESS_REQUEST.status;
        dadosMateriaJSON.message = message.SUCCESS_REQUEST.message;
        dadosMateriaJSON.materia = dadosMateria
        return dadosMateriaJSON
    } else {
        return message.ERROR_INVALID_SIGLA;
    }
}

//Retorna uma lista de materia filtrando pelo id do curso
const ctlGetBuscarMateriaIdCurso = async function (idCurso) {

    let dadosMateriaJSON = {}

    let verificacaoCurso = await controllerCurso.ctlGetCursosID(idCurso)

    if (verificacaoCurso) {
        let dadosMateria = await materiaDAO.mdlSelectByIdCurso(idCurso)

        if (dadosMateria) {
            dadosMateriaJSON = {
                status: message.SUCCESS_CREATED_ITEM.status,
                message: message.SUCCESS_CREATED_ITEM.message,
                materias: dadosMateria
            }
            return dadosMateriaJSON
        }else{
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }else{
        return message.ERROR_INVALID_ID_CURSO
    }
}


//Inserir uma nova materia
const ctlInserirMateria = async function (dadosMateria) {

    let resultDadosMateria;

    if (dadosMateria.nome == '' || dadosMateria.nome == undefined || dadosMateria.nome.length > 45 ||
        dadosMateria.carga_horaria == '' || dadosMateria.carga_horaria == undefined ||
        dadosMateria.sigla == '' || dadosMateria.sigla == undefined || dadosMateria.sigla.length > 5 ||
        dadosMateria.descricao == '' || dadosMateria.descricao == undefined ||
        dadosMateria.id_curso == '' || dadosMateria.id_curso == undefined
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let verificacaoCurso = await cursoDAO.mdlSelectCursoByID(dadosMateria.id_curso)

        if (verificacaoCurso == false) {
            return message.ERROR_INVALID_ID_CURSO
        } else {
            //Envia os dados para a model inserir no Banco de Dados
            resultDadosMateria = await materiaDAO.mdlInsertMateria(dadosMateria);

            //Valida de o banco de dados inseriu corretamente os dados
            if (resultDadosMateria) {

                //Chama a função que vai encontrar o ID gerado após o insert
                let novaMateria = await materiaDAO.mdlSelectLastId();

                let dadosMateriasJSON = {};
                dadosMateriasJSON.status = message.SUCCESS_CREATED_ITEM.status;
                dadosMateriasJSON.message = message.SUCCESS_CREATED_ITEM.message;
                dadosMateriasJSON.materia = novaMateria;
                return dadosMateriasJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

//Atualizar uma materia
const ctlAtualizarMateria = async function (dadosMateria, idMateria) {

    if (dadosMateria.nome == '' || dadosMateria.nome == undefined || dadosMateria.nome.length > 45 ||
        dadosMateria.carga_horaria == '' || dadosMateria.carga_horaria == undefined ||
        dadosMateria.sigla == '' || dadosMateria.sigla == undefined || dadosMateria.sigla.length > 5 ||
        dadosMateria.descricao == '' || dadosMateria.descricao == undefined ||
        dadosMateria.id_curso == '' || dadosMateria.id_curso == undefined
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idMateria == '' || idMateria == undefined || isNaN(idMateria)) {
        return message.ERROR_INVALID_ID
    } else {
        let verificacaoCurso = await cursoDAO.mdlSelectCursoByID(dadosTurma.id_curso)

        if (verificacaoCurso == false) {
            return message.ERROR_INVALID_ID_CURSO
        } else {
            //Adiciona o ID da materia no JSON dos dados
            dadosMateria.id = idMateria

            let statusID = await materiaDAO.mdlSelectByIdMateria(idMateria);

            if (statusID) {
                let resultDadosMateria = await materiaDAO.mdlUpdateMateria(dadosMateria);

                if (resultDadosMateria) {

                    let dadosMateriaJSON = {};
                    dadosMateriaJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                    dadosMateriaJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                    dadosMateriaJSON.materia = dadosMateria;

                    return dadosMateriaJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            } else {
                return message.ERROR_NOT_FOUND;
            }
        }
    }
}

//Excluir uma materia existente filtrando pelo id
const ctlDeletarMateriaPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarMateria = await materiaDAO.mdlSelectByIdMateria(id);

        if (buscarMateria == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let status = await materiaDAO.mdlDeleteMateria(id)

            if (status) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }

}

module.exports = {
    ctlGetMaterias,
    ctlGetMateriaByID,
    ctlGetBuscarMateriaSigla,
    ctlGetBuscarMateriaIdCurso,
    ctlInserirMateria,
    ctlAtualizarMateria,
    ctlDeletarMateriaPeloID
}