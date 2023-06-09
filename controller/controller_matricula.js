/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de MATRICULAS
 *  Autor: Luiz e Muryllo
 *  Data: 08/06/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados da matricula no BD
var matriculaDAO = require('../model/DAO/matriculaDAO.js')

var statusMatriculaDAO = require('../model/DAO/statusMatriculaDAO.js')

var alunoDAO = require('../model/DAO/alunoDAO.js')

var usuarioDAO = require('../model/DAO/usuarioDAO.js')

var message = require('./modulo/config.js')

//Retorna a lista de todos as matriculas
const ctlGetMatriculas = async function () {

    let dadosMatriculaJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosMatricula = await matriculaDAO.mdlSelectAllMatriculas();

    if (dadosMatricula) {
        //Criando um JSON com o atributo Matricula, para encaminhar um array de Matriculas
        dadosMatriculaJSON.status = message.SUCCESS_REQUEST.status;
        dadosMatriculaJSON.message = message.SUCCESS_REQUEST.message;
        dadosMatriculaJSON.quantidade = dadosMatricula.length;
        dadosMatriculaJSON.matriculas = dadosMatricula
        return dadosMatriculaJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }
}

//Retorna o Matricula filtrando pelo ID
const ctlGetBuscarMatriculaID = async function (id) {

    let idNumero = id

    //Validação do ID
    if (idNumero == '' || id == undefined || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosMatriculasJSON = {}

        let dadosMatricula = await matriculaDAO.mdlSelectByIdMatricula(idNumero)

        if (dadosMatricula) {
            //Criando um JSON com o atributo Matricula, para encaminhar um array de Matriculas
            dadosMatriculasJSON.status = message.SUCCESS_REQUEST.status;
            dadosMatriculasJSON.message = message.SUCCESS_REQUEST.message;
            dadosMatriculasJSON.matricula = dadosMatricula
            return dadosMatriculasJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Retorna o Matricula filtrando pelo nome
const ctlGetBuscarMatriculaNumero = async function (numero) {

    let numeroMatricula = numero

    if (numeroMatricula == '' || numeroMatricula == undefined || isNaN(numeroMatricula)) {
        return message.ERROR_INVALID_NUMBER
    } else {
        let dadosMatriculasJSON = {}

        let dadosMatricula = await matriculaDAO.mdlSelectByNumeroMatricula(numeroMatricula)

        if (dadosMatricula) {
            //Criando um JSON com o atributo Matricula, para encaminhar um array de Matriculas
            dadosMatriculasJSON.status = message.SUCCESS_REQUEST.status;
            dadosMatriculasJSON.message = message.SUCCESS_REQUEST.message;
            dadosMatriculasJSON.matricula = dadosMatricula
            return dadosMatriculasJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

const ctlInserirMatricula = async (dadosMatricula) => {
    if (
        dadosMatricula.numero == '' || dadosMatricula.numero == null || dadosMatricula.numero == undefined ||
        dadosMatricula.id_status_matricula == '' || dadosMatricula.id_status_matricula == null || dadosMatricula.id_status_matricula == undefined || isNaN(dadosMatricula.id_status_matricula) ||
        dadosMatricula.id_aluno == '' || dadosMatricula.id_aluno == null || dadosMatricula.id_aluno == undefined || isNaN(dadosMatricula.id_aluno) ||
        dadosMatricula.id_usuario == '' || dadosMatricula.id_usuario == null || dadosMatricula.id_usuario == undefined || isNaN(dadosMatricula.id_usuario)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let verificacaoStatusMatricula = await statusMatriculaDAO.mdlSelectStatusMatriculaByID(dadosMatricula.id_status_matricula)

        let verificacaoAluno = await alunoDAO.selectByIdAluno(dadosMatricula.id_aluno)

        let verificacaoUsuario = await usuarioDAO.mdlSelectUsuarioByID(dadosMatricula.id_usuario)

        if (verificacaoStatusMatricula == false || verificacaoAluno == false || verificacaoUsuario == false) {
            return message.ERROR_INVALID_ID_STATUS_USUARIO_ALUNO
        } else {
            let resultDadosMatricula = await matriculaDAO.mdlInsertMatricula(dadosMatricula)

            //Valida se o BD inseriu corretamente
            if (resultDadosMatricula) {
                let novaMatricula = await matriculaDAO.selectLastId()

                let dadosMatriculaJSON = {
                    status: message.SUCCESS_CREATED_ITEM.status,
                    message: message.SUCCESS_CREATED_ITEM.message,
                    matricula: novaMatricula
                }
                return dadosMatriculaJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

//Atualizar um aluno existente filtrando pelo id
const ctlAtualizarMatriculaPeloID = async function (dadosMatricula, idMatricula) {

    if (dadosMatricula.numero == '' || dadosMatricula.numero == null || dadosMatricula.numero == undefined || dadosMatricula.numero.length > 9 ||
        dadosMatricula.id_status_matricula == '' || dadosMatricula.id_status_matricula == null || dadosMatricula.id_status_matricula == undefined || isNaN(dadosMatricula.id_status_matricula) ||
        dadosMatricula.id_aluno == '' || dadosMatricula.id_aluno == null || dadosMatricula.id_aluno == undefined || isNaN(dadosMatricula.id_aluno) ||
        dadosMatricula.id_usuario == '' || dadosMatricula.id_usuario == null || dadosMatricula.id_usuario == undefined || isNaN(dadosMatricula.id_usuario)
    ) {
        return message.ERROR_REQUIRE_FIELDS
        //Validaçaõ do ID incorreto ou não informado
    } else if (idMatricula == '' || idMatricula == undefined || isNaN(idMatricula)) {
        return message.ERROR_INVALID_ID
    } else {

        let verificacaoStatusMatricula = await statusMatriculaDAO.mdlSelectStatusMatriculaByID(dadosMatricula.id_status_matricula)

        let verificacaoAluno = await alunoDAO.selectByIdAluno(dadosMatricula.id_aluno)

        let verificacaoUsuario = await usuarioDAO.mdlSelectUsuarioByID(dadosMatricula.id_usuario)

        if (verificacaoStatusMatricula == false || verificacaoAluno == false || verificacaoUsuario == false) {
            return message.ERROR_INVALID_ID_STATUS_USUARIO_ALUNO
        } else {

            //Adiciona o ID do aluno no JSON dos dados
            dadosMatricula.id = idMatricula

            let statusID = await matriculaDAO.mdlSelectByIdMatricula(idMatricula);

            if (statusID) {
                let resultDadosMatricula = await matriculaDAO.mdlUpdateMatricula(dadosMatricula);

                if (resultDadosMatricula) {

                    let dadosMatriculasJSON = {};
                    dadosMatriculasJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                    dadosMatriculasJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                    dadosMatriculasJSON.matricula = dadosMatricula;

                    return dadosMatriculasJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            } else {
                return message.ERROR_NOT_FOUND;
            }
        }
    }
}

//Excluir uma matricula existente filtrando pelo id
const ctlDeletarMatriculaPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarMatricula = await matriculaDAO.mdlSelectByIdMatricula(id);

        if (buscarMatricula == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let status = await matriculaDAO.mdlDeleteMatricula(id)

            if (status) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetMatriculas,
    ctlGetBuscarMatriculaID,
    ctlGetBuscarMatriculaNumero,
    ctlInserirMatricula,
    ctlAtualizarMatriculaPeloID,
    ctlDeletarMatriculaPeloID
}