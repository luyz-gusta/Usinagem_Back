/************************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos TURMAS no Banco de Dados
 * Autor: Luiz Gustavo, Muryllo Vieira e Millena Ferreira
 * Data: 22/05/2023
 * Versão: 1.0
************************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instancia da classe PrismaClient
var prisma = new PrismaClient();

//Inserir dados do Turma no Banco de dados
const mdlInsertTurma = async function (dadosTurma) {
    let sql = `insert into tbl_turma(
                                    nome,
                                    data_inicio,
                                    data_conclusao,
                                    descricao,
                                    semestre,
                                    id_curso
                                    )values(
                                    "${dadosTurma.nome}",
                                    "${dadosTurma.data_inicio}",
                                    "${dadosTurma.data_conclusao}",
                                    "${dadosTurma.descricao}",
                                    ${dadosTurma.semestre},
                                    ${dadosTurma.id_curso}
                                    );`

    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

//Atualizar um Turma existente 
const mdlUpdateTurma = async function (dadosTurma) {
    let sql = `update tbl_turma
                        set nome = '${dadosTurma.nome}',
                        data_inicio = '${dadosTurma.data_inicio}',
                        data_conclusao = '${dadosTurma.data_conclusao}',
                        descricao = '${dadosTurma.descricao}',
                        semestre = ${dadosTurma.semestre},
                        id_curso = ${dadosTurma.id_curso}
                    where id = ${dadosTurma.id};`

    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Excluir um Turma existente
const mdlDeleteTurma = async function (id) {

    let sql = `delete from tbl_turma where id = ${id}`

    let resultStatus = await prisma.$queryRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

//Retorna a lista de todos os Turma
const mdlSelectAllTurma = async function () {

    console.log('dao-turma');

    let sql = `select * from tbl_turma`;

    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma
    } else {
        return false;
    }
}

//Retorna o Turma filtrando pelo ID
const mdlSelectByIdTurma = async function (id) {
    let idTurma = id

    let sql = `select * from tbl_turma where id = ${idTurma}`;

    //console.log(sql);
    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma
    } else {
        return false;
    }
}

//Retorna o Turma filtrando pelo nome
const mdlSelectByNameTurma = async function (nome) {
    let nameTurma = nome

    let sql = `select * from tbl_turma where nome like '%${nameTurma}%'`;

    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma
    } else {
        return false;
    }

}

// Retorna o Turma filtrando pelo ID de Curso
const mdlSelectTurmaByIDCurso = async function (idCurso) {
    let idTurmaCurso = idCurso

    let sql = ` select 
                    tbl_turma.id, tbl_turma.nome as nome_turma,
                    tbl_turma.data_inicio, tbl_turma.data_conclusao,
                    tbl_turma.descricao, tbl_turma.semestre 
                from tbl_turma where tbl_turma.id_curso = ${idTurmaCurso};`;

    let rsTurma = await prisma.$queryRawUnsafe(sql)

    if (rsTurma.length > 0) {
        return rsTurma
    } else {
        return false;
    }

}

//Retorna o ultimo id inserido no BD
const mdlSelectLastId = async function () {

    let sql = 'select * from tbl_turma order by id desc limit 1'

    let rsTurma = await prisma.$queryRawUnsafe(sql);

    if (rsTurma.length > 0) {
        return rsTurma;
    } else {
        return false;
    }
}

module.exports = {
    mdlInsertTurma,
    mdlUpdateTurma,
    mdlDeleteTurma,
    mdlSelectAllTurma,
    mdlSelectByIdTurma,
    mdlSelectByNameTurma,
    mdlSelectTurmaByIDCurso,
    mdlSelectLastId
}