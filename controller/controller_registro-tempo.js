/**************************************************************************************
 *  Objetivo: Responsavel pela regra de negocio referente ao CRUD de REGISTRO DE TEMPO
 *  Autor: Luiz e Muryllo
 *  Data: 31/05/2023
 *  Versão: 1.0
 **************************************************************************************/

//Import do arquivo DAO para acessar dados da Registro de Tempo no BD
var registroTempoDAO = require('../model/DAO/registroTempoDAO.js')

var matriculaDAO = require('../model/DAO/matriculaDAO.js')

var tarefaDAO = require('../model/DAO/tarefaDAO.js')

var message = require('./modulo/config.js')

//Retorna a lista de todas as RegistroTempos
const ctlGetRegistroTempo = async function () {

    let dadosRegistroTempoJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os registros do BD
    let dadosRegistroTempo = await registroTempoDAO.mdlSelectAllRegistroTempo();

    if (dadosRegistroTempo) {
        //Criando um JSON com o atributo RegistroTempos, para encaminhar um array de RegistroTempos
        dadosRegistroTempoJSON.status = message.SUCCESS_REQUEST.status;
        dadosRegistroTempoJSON.message = message.SUCCESS_REQUEST.message;
        dadosRegistroTempoJSON.quantidade = dadosRegistroTempo.length;
        dadosRegistroTempoJSON.registro_tempos = dadosRegistroTempo
        return dadosRegistroTempoJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND;
    }
}

//Retorna um registro de RegistroTempo filtrada pelo ID
const ctlGetRegistroTempoByID = async function (id) {

    let idNumero = id

    //Validação do ID
    if (idNumero == '' || id == undefined || isNaN(idNumero)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosRegistroTempoJSON = {}

        let dadosRegistroTempo = await registroTempoDAO.mdlSelectByIdRegistroTempo(idNumero)

        if (dadosRegistroTempo) {
            //Criando um JSON com o atributo RegistroTempo, para encaminhar um array de RegistroTempos
            dadosRegistroTempoJSON.status = message.SUCCESS_REQUEST.status;
            dadosRegistroTempoJSON.message = message.SUCCESS_REQUEST.message;
            dadosRegistroTempoJSON.registro_tempo = dadosRegistroTempo
            return dadosRegistroTempoJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND;
        }
    }
}

//Inserir uma nova RegistroTempo
const ctlInserirRegistroTempo = async function (dadosRegistroTempo) {

    let resultDadosRegistroTempo;

    if (dadosRegistroTempo.data_inicio == '' || dadosRegistroTempo.data_inicio == undefined ||
        dadosRegistroTempo.duracao_inicio == '' || dadosRegistroTempo.duracao_inicio == undefined ||
        dadosRegistroTempo.duracao_termino == '' || dadosRegistroTempo.duracao_termino == undefined ||
        dadosRegistroTempo.desconto == '' || dadosRegistroTempo.desconto == undefined || 
        dadosRegistroTempo.liquido == '' || dadosRegistroTempo.liquido == undefined || 
        dadosRegistroTempo.tempo_geral == '' || dadosRegistroTempo.tempo_geral == undefined || 
        dadosRegistroTempo.id_tarefa == '' || dadosRegistroTempo.id_tarefa == undefined || isNaN(dadosRegistroTempo.id_tarefa) ||
        dadosRegistroTempo.id_matricula == '' || dadosRegistroTempo.id_matricula == undefined || isNaN(dadosRegistroTempo.id_matricula)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let verificacaoMatricula = await matriculaDAO.mdlSelectByIdMatricula(dadosRegistroTempo.id_matricula)
        let verificacaoTarefa = await tarefaDAO.mdlSelectByIdTarefa(dadosRegistroTempo.id_tarefa)

        if (verificacaoMatricula == false || verificacaoTarefa == false) {
            return message.ERROR_INVALID_ID_MATRICULA_TAREFA
        } else {
            //Envia os dados para a model inserir no Banco de Dados
            resultDadosRegistroTempo = await registroTempoDAO.mdlInsertRegistroTempo(dadosRegistroTempo);

            //Valida de o banco de dados inseriu corretamente os dados
            if (resultDadosRegistroTempo) {

                //Chama a função que vai encontrar o ID gerado após o insert
                let novaRegistroTempo = await registroTempoDAO.mdlSelectLastId();

                let dadosRegistroTemposJSON = {};
                dadosRegistroTemposJSON.status = message.SUCCESS_CREATED_ITEM.status;
                dadosRegistroTemposJSON.message = message.SUCCESS_CREATED_ITEM.message;
                dadosRegistroTemposJSON.registro_tempo = novaRegistroTempo;
                return dadosRegistroTemposJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

//Atualizar uma RegistroTempo
const ctlAtualizarRegistroTempo = async function (dadosRegistroTempo, idRegistroTempo) {

    if (dadosRegistroTempo.data_inicio == '' || dadosRegistroTempo.data_inicio == undefined ||
        dadosRegistroTempo.duracao_inicio == '' || dadosRegistroTempo.duracao_inicio == undefined ||
        dadosRegistroTempo.duracao_termino == '' || dadosRegistroTempo.duracao_termino == undefined ||
        dadosRegistroTempo.desconto == '' || dadosRegistroTempo.desconto == undefined ||
        dadosRegistroTempo.liquido == '' || dadosRegistroTempo.liquido == undefined || 
        dadosRegistroTempo.tempo_geral == '' || dadosRegistroTempo.tempo_geral == undefined || 
        dadosRegistroTempo.id_tarefa == '' || dadosRegistroTempo.id_tarefa == undefined || isNaN(dadosRegistroTempo.id_tarefa) ||
        dadosRegistroTempo.id_matricula == '' || dadosRegistroTempo.id_matricula == undefined || isNaN(dadosRegistroTempo.id_matricula)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idRegistroTempo == '' || idRegistroTempo == undefined || isNaN(idRegistroTempo)) {
        return message.ERROR_INVALID_ID
    } else {
        let verificacaoMatricula = await matriculaDAO.mdlSelectByIdMatricula(dadosRegistroTempo.id_matricula)
        let verificacaoTarefa = await tarefaDAO.mdlSelectByIdTarefa(dadosRegistroTempo.id_tarefa)

        if (verificacaoMatricula == false || verificacaoTarefa == false) {
            return message.ERROR_INVALID_ID_MATRICULA_TAREFA
        } else {
            //Adiciona o ID da RegistroTempo no JSON dos dados
            dadosRegistroTempo.id = idRegistroTempo

            let statusID = await registroTempoDAO.mdlSelectByIdRegistroTempo(idRegistroTempo);

            if (statusID) {
                let resultDadosRegistroTempo = await registroTempoDAO.mdlUpdateRegistroTempo(dadosRegistroTempo);

                if (resultDadosRegistroTempo) {

                    let dadosRegistroTempoJSON = {};
                    dadosRegistroTempoJSON.status = message.SUCCESS_UPDATED_ITEM.status;
                    dadosRegistroTempoJSON.message = message.SUCCESS_UPDATED_ITEM.message;
                    dadosRegistroTempoJSON.registro_tempo = dadosRegistroTempo;

                    return dadosRegistroTempoJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER
                }
            } else {
                return message.ERROR_NOT_FOUND;
            }
        }
    }
}

//Excluir uma tarefa existente filtrando pelo id
const ctlDeletarRegistroTempoPeloID = async function (id) {

    if (id == '' || id == undefined || id == null || isNaN(id)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarRegistroTempo = await registroTempoDAO.mdlSelectByIdRegistroTempo(id);

        if (buscarRegistroTempo == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let registroTempo = await registroTempoDAO.mdlDeleteRegistroTempo(id)

            if (registroTempo) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetRegistroTempo,
    ctlGetRegistroTempoByID,
    ctlInserirRegistroTempo,
    ctlAtualizarRegistroTempo,
    ctlDeletarRegistroTempoPeloID
}