/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados dos ALUNOS no Banco de Dados
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

const mdlSelectAllStatusMatricula = async () => {

    let sql = `select * from tbl_status_matricula;`

    let rsStatusMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsStatusMatricula.length > 0) {
        return rsStatusMatricula
    } else {
        return false
    }
}

const mdlSelectStatusMatriculaByID = async (idStatus) => {

    let sql = `select * from tbl_status_matricula where id = ${idStatus};`

    let rsStatusMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsStatusMatricula.length > 0) {
        return rsStatusMatricula
    } else {
        return false
    }
}

//Retorna nomeStatus filtrando pelo ID
const mdlSelectByNameStatusMatricula = async function (name) {

    //Script para buscar um status de matricula filtrando pelo nome
    let sql = `select * from tbl_status_matricula where nome = '${name}'`;

    //console.log(sql);
    let nomeStatus = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (nomeStatus.length > 0) {
        return nomeStatus
    } else {
        return false;
    }
}

//Inserir dados de StatusMatricula no Banco de dados
const mdlInsertStatusMatricula = async function (dadosStatusMatricula) {
    let sql = `insert into tbl_status_matricula (nome) values ('${dadosStatusMatricula.nome}');`
                
    //Executa o scriptSQL no banco de dados
    //console.log(sql);
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido no BD
const mdlSelectLastId = async function () {

    let sql = 'select * from tbl_status_matricula order by id desc limit 1'

    let rsStatusMatricula = await prisma.$queryRawUnsafe(sql);

    if (rsStatusMatricula.length > 0) {
        return rsStatusMatricula;
    } else {
        return false;
    }
}

//Atualizar uma StatusMatricula existente 
const mdlUpdateStatusMatricula = async function (dadosStatusMatricula) {
    let sql = `update tbl_status_matricula 
                    set nome = '${dadosStatusMatricula.nome}'
               where id = ${dadosStatusMatricula.id};`

    //Executa o scriptSQL no banco de dados
    // console.log(sql);
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Excluir uma StatusMatricula existente
const mdlDeleteStatusMatricula = async function (id) {

    let sql = `delete from tbl_status_matricula where id = ${id}`

    let resultStatus = await prisma.$queryRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

module.exports = {
    mdlSelectAllStatusMatricula,
    mdlSelectStatusMatriculaByID,
    mdlSelectByNameStatusMatricula,
    mdlInsertStatusMatricula,
    mdlUpdateStatusMatricula,
    mdlDeleteStatusMatricula,
    mdlSelectLastId,
}