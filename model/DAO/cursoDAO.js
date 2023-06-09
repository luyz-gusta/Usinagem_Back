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

const mdlSelectAllCursos = async () => {
    let sql = `select * from tbl_curso;`

    let rsCurso = await prisma.$queryRawUnsafe(sql)

    if(rsCurso.length > 0){
        return rsCurso
    }else{
        return false
    }
}

const mdlSelectCursoByID = async (id) => {
    let sql = `select * from tbl_curso as curso where curso.id = '${id}';`

    let rsCurso = await prisma.$queryRawUnsafe(sql)

    if(rsCurso.length > 0){
        return rsCurso
    }else{
        return false
    }
}

const mdlSelectCursoByName = async (nome) => {
    let sql = `select * from tbl_curso as curso where curso.nome like '%${nome}%';`

    let rsCurso = await prisma.$queryRawUnsafe(sql)

    if(rsCurso.length > 0){
        return rsCurso
    }else{
        return false
    }
}

const mdlSelectCursoBySigla = async (sigla) => {
    let sql = `select * from tbl_curso as curso where curso.sigla like '%${sigla}%';`

    let rsCurso = await prisma.$queryRawUnsafe(sql)

    if(rsCurso.length > 0){
        return rsCurso
    }else{
        return false
    }
}

const mdlInsertCurso = async (dadosCurso) => {
    let sql = `insert into tbl_curso(
        nome, 
        carga_horaria, 
        descricao, 
        sigla, 
        foto
        )
    values(
        '${dadosCurso.nome}',
        ${dadosCurso.carga_horaria},
        '${dadosCurso.descricao}',
        '${dadosCurso.sigla}',
        '${dadosCurso.foto}'
    ); 
    `
    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)        

    if(resultStatus){
        return true
    }else{
        return false
    }
}

//Retorno o ultimo id inserido no banco de dados
const mdlSelectLastByID = async () => {
    let sql = `select * from tbl_curso order by id desc limit 1;
    `
    
    let rsCurso= await prisma.$queryRawUnsafe(sql)

    if(rsCurso.length > 0){
        return rsCurso
    }else{
        return false
    }
}

const mdlUpdateCurso = async (dadosCursos) => {
    let sql = `update tbl_curso set 
        nome = '${dadosCursos.nome}', 
        carga_horaria = ${dadosCursos.carga_horaria}, 
        descricao = '${dadosCursos.descricao}', 
        sigla = '${dadosCursos.sigla}', 
        foto = '${dadosCursos.foto}' 
        where id = ${dadosCursos.id};
    `

    //Executa o scriptSQL no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)
    
    if(resultStatus){
        return true
    }else{
        return false
    }
}

const mdlDeleteCurso = async (id) => {
    let sql = `delete from tbl_curso where id = ${id}` 

    let resultStatus = await prisma.$queryRawUnsafe(sql)
    
    if(resultStatus){
        return true
    }else{
        return false
    }
}


module.exports = {
    mdlSelectAllCursos,
    mdlSelectCursoByID,
    mdlSelectCursoByName,
    mdlSelectCursoBySigla,
    mdlSelectLastByID ,
    mdlInsertCurso,
    mdlUpdateCurso,
    mdlDeleteCurso
}