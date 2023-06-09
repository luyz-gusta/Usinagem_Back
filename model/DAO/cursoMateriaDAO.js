/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados de MATERIAS no Banco de Dados
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

//Retorna a lista de todos as materias
const mdlSelectAllCursoMateria = async function () {

    //Script para buscar todos os itens no BD
    let sql = `select * from tbl_curso_materia`;

    //$queryRawUnsafe(sql) - permite interpretar uma variavel como sendo um sriptSQL
    //queryRaw('select * from tbl_curso_materia') - permite interpretar o scriptSQL direto no metodo
    let rsCursoMateria = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsCursoMateria.length > 0) {
        return rsCursoMateria
    } else {
        return false;
    }
}

//Retorna o ultimo id inserido no BD
const mdlSelectLastId = async function () {

    let sql = 'select * from tbl_curso_materia order by id desc limit 1'

    let rsCursoMateria= await prisma.$queryRawUnsafe(sql);

    if (rsCursoMateria.length > 0) {
        return rsCursoMateria;
    } else {
        return false;
    }

}

module.exports = {
    
}