/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados de TIPO DE TAREFA no Banco de Dados
 * Autor: Luiz Gustavo e Muryllo Vieira
 * Data: 22/05/2023
 * Versão: 1.0
************************************************************************************************/

/**
    //$queryRawUnsafe( ) -> Permite interpretar uma variavel como sendo um scriptSQL
    //$queryRaw( ) -> Esse executa o comando dentro de aspas e não podendo interpretar uma variavel
*/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instancia da classe PrismaClient
var prisma = new PrismaClient();

//Retorna a lista de todos os tipos de tarefa
const mdlSelectAllTiposTarefas = async function () {

    //Script para buscar todos os itens no BD
    let sql = 'select * from tbl_tipo_tarefa';

    //$queryRawUnsafe(sql) - permite interpretar uma variavel como sendo um sriptSQL
    //queryRaw('select * from tbl_TipoTarefa') - permite interpretar o scriptSQL direto no metodo
    let rsTipoTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTipoTarefa.length > 0) {
        return rsTipoTarefa
    } else {
        return false;
    }
}

//Retorna a TipoTarefa filtrando pelo ID
const mdlSelectByIdTipoTarefa = async function (id) {

    let idTipoTarefa = id

    //Script para buscar uma TipoTarefa filtrando pelo ID
    let sql = `select * from tbl_tipo_tarefa where id = ${idTipoTarefa}`;

    //console.log(sql);
    let rsTipoTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTipoTarefa.length > 0) {
        return rsTipoTarefa
    } else {
        return false;
    }
}

//Retorna a TipoTarefa filtrando pelo nome
const mdlSelectByNameTipoTarefa = async function (nome) {

    let nameTipoTarefa = nome

    //Script para buscar uma TipoTarefa filtrando pelo ID
    let sql = `select * from tbl_tipo_tarefa where nome like '%${nameTipoTarefa}%'`;

    let rsTipoTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTipoTarefa.length > 0) {
        return rsTipoTarefa
    } else {
        return false;
    }
}

//Inserir dados de tipo tarefa no Banco de dados
const mdlInsertTipoTarefa = async function (dadosTipoTarefa) {
    let sql = `insert into tbl_tipo_tarefa(
                                    nome
                                ) values (
                                    '${dadosTipoTarefa.nome}');`

    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Atualizar uma tipoTarefa existente 
const mdlUpdateTipoTarefa = async function (dadosTipoTarefa) {
    let sql = `update tbl_tipo_tarefa
    set nome = '${dadosTipoTarefa.nome}'
    where id = ${dadosTipoTarefa.id};
    `
    //Executa o scriptSQL no banco de dados
    // console.log(sql);
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

//Retorna o ultimo id inserido no BD
const mdlSelectLastId = async function () {

    let sql = 'select * from tbl_tipo_tarefa order by id desc limit 1'

    let rsTipoTarefa = await prisma.$queryRawUnsafe(sql);

    if (rsTipoTarefa.length > 0) {
        return rsTipoTarefa;
    } else {
        return false;
    }
}

//Excluir um tipo de tarefa existente
const mdlDeleteTipoTarefa = async function (id) {

    let sql = `delete from tbl_tipo_tarefa where id = ${id}`

    let resultStatus = await prisma.$queryRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

module.exports = {
    mdlSelectAllTiposTarefas,
    mdlSelectByIdTipoTarefa,
    mdlSelectByNameTipoTarefa,
    mdlInsertTipoTarefa,
    mdlUpdateTipoTarefa,
    mdlDeleteTipoTarefa,
    mdlSelectLastId
}