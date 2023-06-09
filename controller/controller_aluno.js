/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de ALUNOS
 *  Autor: Luiz e Muryllo
 *  Data: 14/04/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados do aluno no BD
var alunoDAO = require('../model/DAO/alunoDAO.js')

var message = require('./modulo/config.js')

//Inserir um novo aluno
const inserirAluno = async function (dadosAluno) {

    let resultDadosAluno;

    if (dadosAluno.nome == '' || dadosAluno.nome == undefined || dadosAluno.nome.length > 100 ||
        dadosAluno.email == '' || dadosAluno.email == undefined || dadosAluno.email.length > 255 ||
        dadosAluno.cpf.length > 15
    ) {
        //console.log(dadosAluno);
        return message.ERROR_REQUIRE_FIELDS
    } else if (dadosAluno.data_nascimento == '') {
        return message.ERROR_DATE_BIRTH_INVALID
    } else {
        //Envia os dados para a model inserir no Banco de Dados
        resultDadosAluno = await alunoDAO.insertAluno(dadosAluno);

        //Valida de o banco de dados inseriu corretamente os dados
        if (resultDadosAluno) {

            //Chama a função que vai encontrar o ID gerado após o insert
            let novoAluno = await alunoDAO.selectLastId();

            let dadosAlunosJSON = {};
            dadosAlunosJSON.status = message.SUCCESS_CREATED_ITEM.status;
            dadosAlunosJSON.message = message.SUCCESS_CREATED_ITEM.message
            dadosAlunosJSON.aluno = novoAluno;
            return dadosAlunosJSON
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

//Atualizar um aluno existente filtrando pelo id
const atualizarAlunoPeloID = async function (dadosAluno, idAluno) {

    if (dadosAluno.nome == '' || dadosAluno.nome == undefined || dadosAluno.nome.length > 100 ||
        dadosAluno.email == '' || dadosAluno.email == undefined || dadosAluno.email.length > 255 ||
        dadosAluno.cpf.length > 15
    ) {
        return message.ERROR_REQUIRE_FIELDS
        //Validaçaõ do ID incorreto ou não informado
    } else if (idAluno == '' || idAluno == undefined || isNaN(idAluno)) {
        return message.ERROR_INVALID_ID
    } else if (dadosAluno.data_nascimento == '') {
        return message.ERROR_DATE_BIRTH_INVALID
    } else {
        //Adiciona o ID do aluno no JSON dos dados
        dadosAluno.id = idAluno

        let statusID = await alunoDAO.selectByIdAluno(idAluno);

        if (statusID) {
            let resultDadosAluno = await alunoDAO.updateAluno(dadosAluno);

            if (resultDadosAluno) {

                let dadosAlunosJSON = {};
                dadosAlunosJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                dadosAlunosJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                dadosAlunosJSON.aluno = dadosAluno;

                return dadosAlunosJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_NOT_FOUND;
        }
    }
}

//Excluir um aluno existente filtrando pelo id
const deletarAlunoPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarAluno = await alunoDAO.selectByIdAluno(id);

        if (buscarAluno == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let status = await alunoDAO.deleteAluno(id)

            if (status) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

//Retorna a lista de todos os alunos
const getAlunos = async function () {

    let dadosAlunosJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosAluno = await alunoDAO.selectAllAlunos();

    if (dadosAluno) {
        //Criando um JSON com o atributo aluno, para encaminhar um array de alunos
        dadosAlunosJSON.status = message.SUCCESS_REQUEST.status;
        dadosAlunosJSON.message = message.SUCCESS_REQUEST.message;
        dadosAlunosJSON.quantidade = dadosAluno.length;
        dadosAlunosJSON.alunos = dadosAluno
        return dadosAlunosJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }

}

//Retorna o aluno filtrando pelo ID
const getBuscarAlunoID = async function (id) {

    let idNumero = id

    //Validação do ID
    if (idNumero == '' || id == undefined || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosAlunosJSON = {}

        let dadosAluno = await alunoDAO.selectByIdAluno(idNumero)

        if (dadosAluno) {
            //Criando um JSON com o atributo aluno, para encaminhar um array de alunos
            dadosAlunosJSON.status = message.SUCCESS_REQUEST.status;
            dadosAlunosJSON.message = message.SUCCESS_REQUEST.message;
            dadosAlunosJSON.aluno = dadosAluno
            return dadosAlunosJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }

}

//Retorna o aluno filtrando pelo nome
const getBuscarAlunoNome = async function (nome) {

    let nomeAluno = nome

    if (nomeAluno == '' || nomeAluno == undefined) {
        return message.ERROR_INVALID_NOME
    } else {
        let dadosAlunosJSON = {}

        let dadosAluno = await alunoDAO.selectByNameAluno(nomeAluno)

        if (dadosAluno) {
            //Criando um JSON com o atributo aluno, para encaminhar um array de alunos
            dadosAlunosJSON.status = message.SUCCESS_REQUEST.status;
            dadosAlunosJSON.message = message.SUCCESS_REQUEST.message;
            dadosAlunosJSON.aluno = dadosAluno
            return dadosAlunosJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

module.exports = {
    getAlunos,
    getBuscarAlunoID,
    getBuscarAlunoNome,
    inserirAluno,
    atualizarAlunoPeloID,
    deletarAlunoPeloID,
}