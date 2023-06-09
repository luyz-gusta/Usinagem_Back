/************************************************************************************************
 * Objetivo: Responsável pela regra de negócio referente ao CRUD de Usuarios
 * Autor: Luiz Gustavo e Muryllo
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
let usuarioDao = require('../model/DAO/usuarioDAO.js')

//Retorna todos os usuarios
const ctlGetUsuarios = async () => {
    let dadosUsuariosJSON = {}

    //Chama a função do arquivo DAO que irá retornar todos os resgistros do DB
    let dadosUsuario = await usuarioDao.mdlSelectAllUsuarios()

    if (dadosUsuario) {
        dadosUsuariosJSON = {
            status: message.SUCCESS_REQUEST.status,
            message: message.SUCCESS_REQUEST.message,
            quantidade: dadosUsuario.length,
            usuarios: dadosUsuario
        }
        return dadosUsuariosJSON
    } else {
        return message.ERROR_REGISTER_NOT_FOUND
    }
}

const ctlGetUsuarioID = async (id) => {
    let dadosUsuariosJSON = {}

    if (id == '' || id == null || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_PARAMS
    } else {
        let dadosUsuario = await usuarioDao.mdlSelectUsuarioByID(id)

        if (dadosUsuario) {
            dadosUsuariosJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                usuarios: dadosUsuario
            }
            return dadosUsuariosJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }

}

const ctlGetUsuarioEmail = async (email) => {
    let dadosUsuariosJSON = {}

    if (email == '' || email == null || email == undefined || email.length > 255) {
        console.log('teste erro');
        return message.ERROR_INVALID_EMAIL
    } else {
        let dadosUsuario = await usuarioDao.mdlSelectUsuarioByEmail(email)

        if (dadosUsuario) {
            dadosUsuariosJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                usuarios: dadosUsuario
            }
            return dadosUsuariosJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlGetUsuarioEmailSenha = async (email, senha) => {
    let dadosUsuariosJSON = {}

    if (email == '' || email == null || email == undefined || email.length > 255 || senha == '' || senha == null || senha == undefined || senha.length > 150) {
        return message.ERROR_INVALID_EMAIL_SENHA
    } else {
        let dadosEmail = await ctlGetUsuarioEmail(email)

        if (dadosEmail.status == 200) {
            let dadosUsuario = await usuarioDao.mdlSelectUsuarioByEmailAndSenha(email, senha)

            if (dadosUsuario) {
                dadosUsuariosJSON = {
                    status: message.SUCCESS_REQUEST.status,
                    message: message.SUCCESS_REQUEST.message,
                    usuarios: dadosUsuario
                }
                return dadosUsuariosJSON
            } else {
                return message.ERROR_REGISTER_NOT_FOUND
            }

        } else {
            return message.ERROR_INVALID_EMAIL
        }
    }
}

const ctlGetUsuarioNivel = async (nivel) => {
    let dadosUsuariosJSON = {}

    if (nivel == '' || nivel == null || nivel == undefined || nivel.length > 20) {
        return message.ERROR_INVALID_NIVEL
    } else {
        let dadosUsuario = await usuarioDao.mdlSelectUsuarioByNivel(nivel)

        if (dadosUsuario) {
            dadosUsuariosJSON = {
                status: message.SUCCESS_REQUEST.status,
                message: message.SUCCESS_REQUEST.message,
                usuarios: dadosUsuario
            }
            return dadosUsuariosJSON
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlInserirUsuario = async (dadosUsuario) => {
    let verificacaoEmail = await usuarioDao.mdlSelectUsuarioByEmail(dadosUsuario.email)

    //Validação para tratar campos obrigatórios e quantidade de caracteres   
    if (
        dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 255 ||
        dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 150 ||
        dadosUsuario.id_status_usuario == '' || dadosUsuario.id_status_usuario == undefined || isNaN(dadosUsuario.id_status_usuario)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (verificacaoEmail) {
        return message.ERROR_EXISTING_EMAIL
    } else {
        //Envia os dados para a model inserir no BD
        let resultDadosUsuario = await usuarioDao.mdlInsertUsuario(dadosUsuario)

        //Valida se o BD inseriu corretamente
        if (resultDadosUsuario) {
            let novoUsuario = await usuarioDao.mdlSelectLastByID()

            let dadosUsuarioJSON = {
                status: message.SUCCESS_CREATED_ITEM.status,
                message: message.SUCCESS_CREATED_ITEM.message,
                usuarios: novoUsuario
            }

            return dadosUsuarioJSON
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }
}

const ctlAtualizarUsuario = async (dadosUsuario, idUsuario) => {

    //Validação para tratar campos obrigatórios e quantidade de caracteres   
    if (
        dadosUsuario.email == '' || dadosUsuario.email == undefined || dadosUsuario.email.length > 255 ||
        dadosUsuario.senha == '' || dadosUsuario.senha == undefined || dadosUsuario.senha.length > 150 ||
        dadosUsuario.id_status_usuario == '' || dadosUsuario.id_status_usuario == undefined || isNaN(dadosUsuario.id_status_usuario)
    ) {
        return message.ERROR_REQUIRE_FIELDS
    } else if (idUsuario == '' || idUsuario == undefined || idUsuario == null || isNaN(idUsuario)) {
        return message.ERROR_INVALID_ID
    } else {
        dadosUsuario.id = idUsuario

        let dadosUsuarioAntigo = await usuarioDao.mdlSelectUsuarioByID(idUsuario)

        if (dadosUsuarioAntigo) {
            let resultDadosUsuario = await usuarioDao.mdlUpdateUsuario(dadosUsuario)

            let dadosUsuarioNovo = await usuarioDao.mdlSelectUsuarioByID(idUsuario)

            if (resultDadosUsuario) {
                let dadosUsuarioJSON = {
                    status: message.SUCCESS_UPDATED_ITEM.status,
                    message: message.SUCCESS_UPDATED_ITEM.message,
                    aluno_antigo: dadosUsuarioAntigo,
                    aluno_novo: dadosUsuarioNovo
                }
                return dadosUsuarioJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_REGISTER_NOT_FOUND
        }
    }
}

const ctlExcluirUsuario = async (idUsuario) => {

    if (idUsuario == '' || idUsuario == undefined || idUsuario == null || isNaN(idUsuario)) {
        return message.ERROR_REQUIRE_FIELDS
    } else {
        let buscarUsuario = await usuarioDao.mdlSelectUsuarioByID(idUsuario)

        if (buscarUsuario == false) {
            return message.ERROR_REGISTER_NOT_FOUND
        } else {
            let usuario = await usuarioDao.mdlDeleteUsuario(idUsuario)

            if (usuario) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                message.ERROR_INTERNAL_SERVER
            }
        }
    }
}

module.exports = {
    ctlGetUsuarios,
    ctlGetUsuarioID,
    ctlGetUsuarioEmail,
    ctlGetUsuarioEmailSenha,
    ctlGetUsuarioNivel,
    ctlInserirUsuario,
    ctlAtualizarUsuario,
    ctlExcluirUsuario
}