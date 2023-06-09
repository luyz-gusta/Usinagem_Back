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
const ctlGetCursoMaterias = async function () {

    let dadosMateriaJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMateria = await materiaDAO.mdlSelectAllMaterias();

    if (dadosMateria) {
        //Criando um JSON com o atributo materias, para encaminhar um array de materias
        dadosMateriaJSON = {
            
        }
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

module.exports = {
    
}