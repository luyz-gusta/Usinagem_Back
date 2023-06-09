/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados dos PROFESSOR no Banco de Dados
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

const mdlSelectAllProfessores = async () => {
    let sql = `select 
    professor.id, 
    professor.nome, 
    professor.nif,
    professor.telefone, 
    professor.email as email_pessoal, 
    usuario.email as email_usuario, 
    usuario.senha, status.nivel 
    from tbl_professor as professor 
    inner join tbl_usuario as usuario on 
    usuario.id = professor.id_usuario 
    inner join tbl_status_usuario as status on 
    usuario.id_status_usuario = status.id;`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if(rsProfessor.length > 0){
        return rsProfessor
    }else{
        return false
    }
}

const mdlSelectProfessorByID = async (id) => {
    let sql = `select 
    professor.id, 
    professor.nome, 
    professor.nif,
    professor.telefone, 
    professor.email as email_pessoal, 
    usuario.email as email_usuario, 
    usuario.senha, status.nivel 
    from tbl_professor as professor 
    inner join tbl_usuario as usuario on 
    usuario.id = professor.id_usuario 
    inner join tbl_status_usuario as status on 
    usuario.id_status_usuario = status.id 
    where professor.id = ${id};`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if(rsProfessor.length > 0){
        return rsProfessor
    }else{
        return false
    }
}

const mdlSelectProfessorByName = async (nome) => {
    let sql = `select 
    professor.id, 
    professor.nome, 
    professor.nif,
    professor.telefone, 
    professor.email as email_pessoal, 
    usuario.email as email_usuario, 
    usuario.senha, status.nivel 
    from tbl_professor as professor 
    inner join tbl_usuario as usuario on 
    usuario.id = professor.id_usuario 
    inner join tbl_status_usuario as status on 
    usuario.id_status_usuario = status.id 
    where professor.nome like '${nome}%';`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if(rsProfessor.length > 0){
        return rsProfessor
    }else{
        return false
    }
}

const mdlSelectProfessorByNif = async (nif) => {
    let sql = `select 
    professor.id, 
    professor.nome, 
    professor.nif,
    professor.telefone, 
    professor.email as email_pessoal, 
    usuario.email as email_usuario, 
    usuario.senha, status.nivel 
    from tbl_professor as professor 
    inner join tbl_usuario as usuario on 
    usuario.id = professor.id_usuario 
    inner join tbl_status_usuario as status on 
    usuario.id_status_usuario = status.id 
    where professor.nif like '${nif}';`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if(rsProfessor.length > 0){
        return rsProfessor
    }else{
        return false
    }
}

const mdlSelectLastByID = async () => {
    let sql = `select 
    professor.id, 
    professor.nome, 
    professor.nif,
    professor.telefone, 
    professor.email as email_pessoal, 
    usuario.email as email_usuario, 
    usuario.senha, status.nivel 
    from tbl_professor as professor 
    inner join tbl_usuario as usuario on 
    usuario.id = professor.id_usuario 
    inner join tbl_status_usuario as status on 
    usuario.id_status_usuario = status.id 
    order by professor.id desc limit 1;`

    let rsProfessor = await prisma.$queryRawUnsafe(sql)

    if(rsProfessor.length > 0){
        return rsProfessor
    }else{
        return false
    }
}

const mdlInsertProfessor = async (dadosProfessor) => {
    let sql = `insert into tbl_professor(
        nome, 
        nif, 
        telefone, 
        email, 
        id_usuario
        ) values (
        '${dadosProfessor.nome}', 
        '${dadosProfessor.nif}', 
        '${dadosProfessor.telefone}', 
        '${dadosProfessor.email}', 
        ${dadosProfessor.id_usuario}
        );`

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)        

    if(resultStatus){
        return true
    }else{
        return false
    }
}

const mdlUpdateProfessor = async (dadosProfessor) => {
    let sql = `update tbl_professor set
    nome = '${dadosProfessor.nome}',
    nif = '${dadosProfessor.nif}',
    telefone = '${dadosProfessor.telefone}', 
    email = '${dadosProfessor.email}'
    where id = ${dadosProfessor.id};
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)
    
    if(resultStatus){
        return true
    }else{
        return false
    }
}

const mdlDeleteProfessor = async (id) => {
    let sql = `delete from tbl_professor where id = ${id}` 

    let resultStatus = await prisma.$queryRawUnsafe(sql)
    
    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    mdlSelectAllProfessores,
    mdlSelectProfessorByID,
    mdlSelectProfessorByName,
    mdlSelectProfessorByNif,
    mdlSelectLastByID,
    mdlInsertProfessor,
    mdlUpdateProfessor,
    mdlDeleteProfessor
}