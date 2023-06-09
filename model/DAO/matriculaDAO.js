/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados das MATRICULAS no Banco de Dados
 * Autor: Luiz Gustavo e Muryllo Vieira
 * Data: 22/05/2023
 * Versão: 1.0
************************************************************************************************/

/**
    //$queryRawUnsafe( ) -> Permite interpretar uma variavel como sendo um scriptSQL
    //$queryRaw( ) -> Esse executa o comando dentro de aspas e não podendo interpretar uma variavel


 */

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

//Instancia da Classe PrismaClient 
var prisma = new PrismaClient()

const mdlSelectAllMatriculas = async () => {
    let sql = `select tbl_matricula.id as id_matricula, tbl_matricula.numero as numero_matricula,
            tbl_status_matricula.nome as status_matricula,
            tbl_aluno.id as id_aluno, tbl_aluno.nome as nome_aluno, tbl_aluno.cpf, tbl_aluno.email as email_pessoal,
            tbl_usuario.email as email_institucional, tbl_usuario.senha,
            tbl_status_usuario.nivel as nome_status_usuario
        from tbl_matricula
            inner join tbl_aluno
                on tbl_aluno.id = tbl_matricula.id_aluno
            inner join tbl_usuario
                on tbl_usuario.id = tbl_matricula.id_usuario
            inner join tbl_status_usuario
                on tbl_status_usuario.id = tbl_usuario.id_status_usuario
            inner join tbl_status_matricula
                on tbl_status_matricula.id = tbl_matricula.id_status_matricula;`

    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false
    }
}

//Retorna a matricula filtrando pelo ID
const mdlSelectByIdMatricula = async function (id) {

    let idMatricula = id

    //Script para buscar uma matricula filtrando pelo ID
    let sql = `select tbl_matricula.id as id_matricula, tbl_matricula.numero as numero_matricula,
                tbl_status_matricula.nome as status_matricula,
                tbl_aluno.id as id_aluno, tbl_aluno.nome as nome_aluno, tbl_aluno.cpf, tbl_aluno.email as email_pessoal,
                tbl_usuario.email as email_institucional, tbl_usuario.senha,
                tbl_status_usuario.nivel as nome_status_usuario
            from tbl_matricula
                inner join tbl_aluno
                    on tbl_aluno.id = tbl_matricula.id_aluno
                inner join tbl_usuario
                    on tbl_usuario.id = tbl_matricula.id_usuario
                inner join tbl_status_usuario
                    on tbl_status_usuario.id = tbl_usuario.id_status_usuario
                inner join tbl_status_matricula
                    on tbl_status_matricula.id = tbl_matricula.id_status_matricula
            where tbl_matricula.id = ${idMatricula}`;

    //console.log(sql);
    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false;
    }
}

//Retorna a matricula filtrando pelo ID
const mdlSelectByNumeroMatricula = async function (numero) {

    let nomeMatricula = numero

    //Script para buscar uma matricula filtrando pelo numero
    let sql = `select tbl_matricula.id as id_matricula, tbl_matricula.numero as numero_matricula,
                tbl_status_matricula.nome as status_matricula,
                tbl_aluno.id as id_aluno, tbl_aluno.nome as nome_aluno, tbl_aluno.cpf, tbl_aluno.email as email_pessoal,
                tbl_usuario.email as email_institucional, tbl_usuario.senha,
                tbl_status_usuario.nivel as nome_status_usuario
            from tbl_matricula
                inner join tbl_aluno
                    on tbl_aluno.id = tbl_matricula.id_aluno
                inner join tbl_usuario
                    on tbl_usuario.id = tbl_matricula.id_usuario
                inner join tbl_status_usuario
                    on tbl_status_usuario.id = tbl_usuario.id_status_usuario
                inner join tbl_status_matricula
                    on tbl_status_matricula.id = tbl_matricula.id_status_matricula
            where tbl_matricula.numero = ${nomeMatricula}`;

    //console.log(sql);
    let rsMatricula = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsMatricula.length > 0) {
        return rsMatricula
    } else {
        return false;
    }
}

//Inserir dados da matricula no Banco de dados
const mdlInsertMatricula = async function (dadosMatricula) {

        //ScriptSQL para inserir dados
        let sql = `insert into tbl_matricula(
                                        numero, 
                                        id_status_matricula,
                                        id_aluno, 
                                        id_usuario
                                    )values(
                                        ${dadosMatricula.numero},
                                        ${dadosMatricula.id_status_matricula},
                                        ${dadosMatricula.id_aluno},
                                        ${dadosMatricula.id_usuario}
                                    );`;
   
    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Atualizar uma matricula existente 
const mdlUpdateMatricula = async function (dadosMatricula) {

    let sql = `update tbl_matricula set numero = ${dadosMatricula.numero},
                        id_status_matricula = ${dadosMatricula.id_status_matricula},
                        id_aluno = ${dadosMatricula.id_aluno},
                        id_usuario = ${dadosMatricula.id_usuario}
                where id = ${dadosMatricula.id}`;

    console.log(sql);
    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Excluir uma matricula existente
const mdlDeleteMatricula = async function (id) {

    let idMatricula = id;

    let sql = `delete from tbl_matricula where id = ${idMatricula};`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido no BD
const selectLastId = async function () {

    let sql = 'select * from tbl_matricula order by id desc limit 1'

    let rsMatricula = await prisma.$queryRawUnsafe(sql);

    if (rsMatricula.length > 0) {
        return rsMatricula;
    } else {
        return false;
    }
}

module.exports = {
    mdlSelectAllMatriculas,
    mdlSelectByIdMatricula,
    mdlSelectByNumeroMatricula,
    mdlInsertMatricula,
    mdlUpdateMatricula,
    mdlDeleteMatricula,
    selectLastId,
}