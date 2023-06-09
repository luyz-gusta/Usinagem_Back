/**************************************************************************************
 *  Objetivo: Responsavel pela manipulação de dados dos USUARIO no banco de dados
 *  Autor: Muryllo e Luiz
 *  Data: 22/05/2023
 *  Versão: 1.0
 **************************************************************************************/

/**
 * Métodos com inicio 'ctl' são funções da controller
 * e
 * Métodos com inicio 'mdl' são funções da model
 */


//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instancia da classe PrismaClient
var prisma = new PrismaClient();

//Retorna a lista de todos os status de usuario
const mdlselectAllStatusUsuario = async function () {

    //Script para buscar todos os itens no BD
    let sql = 'select * from tbL_status_usuario';

    //$queryRawUnsafe(sql) - permite interpretar uma variavel como sendo um sriptSQL
    //queryRaw('select * from tbl_status_usuario') - permite interpretar o scriptSQL direto no metodo
    let rsStatusUsuario = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsStatusUsuario.length > 0) {
        return rsStatusUsuario
    } else {
        return false;
    }
}

//Retornar um status de usuario filtrando pelo ID
const mdlSelectStatusUsuarioById = async function (id) {

    //Script para buscar um status de usuario filtrando pelo ID
    let sql = `select * from tbL_status_usuario where id = ${id}`;

    let rsStatusUsuario = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsStatusUsuario.length > 0) {
        return rsStatusUsuario
    } else {
        return false;
    }
}

//Retornar um status de usuario filtrando pelo Nome
const mdlSelectStatusUsuarioByName = async function (nome) {

    //Script para buscar um status de usuario filtrando pelo ID
    let sql = `select * from tbL_status_usuario where nivel = '${nome}';`;
    console.log(sql);

    let rsStatusUsuario = await prisma.$queryRawUnsafe(sql)
    console.log(rsStatusUsuario);

    console.log(rsStatusUsuario);
    //Valida de o Banco de Dados retornou algum registro
    if (rsStatusUsuario.length > 0) {
        return rsStatusUsuario
    } else {
        return false;
    }
}

//Inserir dados dos status de usuario no Banco de dados
const mdlInsertStatusUsuario = async function (dadosStatus) {

    //ScriptSQL para inserir os dados
    let sql = `insert into tbL_status_usuario(
                                        nivel
                                        )values(
                                        '${dadosStatus.nivel}'
                                        );`

    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    console.log(resultStatus);
    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido no BD
const mdlSelectLastId = async function (){

    let sql = 'select * from tbl_status_usuario order by id desc limit 1;'

    let rsStatusUsuario = await prisma.$queryRawUnsafe(sql);

    if (rsStatusUsuario.length > 0){
        return rsStatusUsuario;
    } else {
        return false;
    }
}

//Atualiza um registro do banco de dados
const mdlUpdateStatusUsuarioID = async function (dadosStatus){

    let sql = `update tbl_status_usuario set
                            nivel = '${dadosStatus.nivel}'
                    where id = ${dadosStatus.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if(resultStatus){
        return true
    } else {
        return false
    }
}

//Apagar um registro do banco de dados
const mdlDeleteStatusUsuarioID = async function (id){

    let sql = `delete from tbl_status_usuario where id = ${id};`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    } else {
        return false
    }
}

module.exports = {
    mdlselectAllStatusUsuario,
    mdlInsertStatusUsuario,
    mdlSelectStatusUsuarioById,
    mdlSelectStatusUsuarioByName,
    mdlSelectLastId,
    mdlUpdateStatusUsuarioID,
    mdlDeleteStatusUsuarioID,
}