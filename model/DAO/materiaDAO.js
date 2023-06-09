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

//Inserir dados de materia no Banco de dados
const mdlInsertMateria = async function (dadosMateria) {
    let sql = `insert into tbl_materia(
                                    nome, 
                                    carga_horaria,
                                    sigla, 
                                    descricao, 
                                    id_curso
                                ) values (
                                    '${dadosMateria.nome}', 
                                    '${dadosMateria.carga_horaria}', 
                                    '${dadosMateria.sigla}', 
                                    '${dadosMateria.descricao}',
                                    '${dadosMateria.id_curso}');`

    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Atualizar uma materia existente 
const mdlUpdateMateria = async function (dadosMateria) {
    let sql = `update tbl_materia
    set nome = '${dadosMateria.nome}',
        carga_horaria = '${dadosMateria.carga_horaria}',
        sigla = '${dadosMateria.sigla}',
        descricao = '${dadosMateria.descricao}',
        id_curso = ${dadosMateria.id_curso}
    where id = ${dadosMateria.id};
    `
    //Executa o scriptSQL no banco de dados
    console.log(sql);
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

//Excluir uma materia existente
const mdlDeleteMateria = async function (id) {

    let sql = `delete from tbl_materia where id = ${id}`

    let resultStatus = await prisma.$queryRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

//Retorna a lista de todos as materias
const mdlSelectAllMaterias = async function () {

    //Script para buscar todos os itens no BD
    let sql = `select * from tbl_materia`;

    //$queryRawUnsafe(sql) - permite interpretar uma variavel como sendo um sriptSQL
    //queryRaw('select * from tbl_materia') - permite interpretar o scriptSQL direto no metodo
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false;
    }
}

//Retorna a materia filtrando pelo ID
const mdlSelectByIdMateria = async function (id) {

    //Script para buscar uma materia filtrando pelo ID
    let sql = `
    select materia.nome as nome_materia, 
        materia.carga_horaria as carga_horaria_materia,
        materia.sigla as sigla_materia,
        materia.descricao as descricao_materia
    from tbl_materia as materia 
        inner join tbl_curso_materia as curso_materia 
            on curso_materia.id_materia = materia.id
        inner join tbl_curso as curso 
            on curso.id = curso_materia.id_curso
        where materia.id = ${id}
        `;

    //console.log(sql);
    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false;
    }
}

//Retorna a materia filtrando pelo sigla
const mdlSelectBySiglaMateria = async function (sigla) {

    let siglaMateria = sigla

    //Script para buscar uma materia filtrando pelo ID
    let sql = `select * from tbl_materia where sigla like '%${siglaMateria}%'`;

    let rsMateria = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsMateria.length > 0) {
        return rsMateria
    } else {
        return false;
    }

}

//Retorna o ultimo id inserido no BD
const mdlSelectLastId = async function () {

    let sql = 'select * from tbl_materia order by id desc limit 1'

    let rsMateria = await prisma.$queryRawUnsafe(sql);

    if (rsMateria.length > 0) {
        return rsMateria;
    } else {
        return false;
    }

}

const mdlSelectByIdCurso = async (idCurso) => {
    let sql = `
    select materia.nome as nome_materia, 
        materia.carga_horaria as carga_horaria_materia,
        materia.sigla as sigla_materia,
        materia.descricao as descricao_materia
    from tbl_materia as materia 
        inner join tbl_curso_materia as curso_materia 
            on curso_materia.id_materia = materia.id
        inner join tbl_curso as curso 
            on curso.id = curso_materia.id_curso
        where curso.id = ${idCurso};
    `

    let rsMateria = await prisma.$queryRawUnsafe(sql);

    if (rsMateria.length > 0) {
        return rsMateria;
    } else {
        return false;
    }
}

const mdlSelectByIdTurma = async (idTurma, idProfessor) => {
    let sql = `
    select tbl_turma_curso_materia_professor.id,
	    turma.id as id_turma, turma.nome as nome_turma, turma.semestre as semestre_turma, turma.data_inicio as data_inicio_turma, turma.descricao as descricao_turma, 
        turma.data_conclusao as conclusao_turma, 
	    curso.nome as nome_curso, curso.sigla as sigla_curso, curso.descricao as descricao_curso, curso.carga_horaria as carga_horaria_curso,
        materia.id as id_materia, materia.nome as nome_materia, materia.sigla as sigla_materia, 
        materia.carga_horaria as carga_horaria_materia, materia.descricao as descricao_materia
    from tbl_turma_curso_materia_professor
	    inner join tbl_turma as turma
		    on turma.id = tbl_turma_curso_materia_professor.id_turma
	    inner join tbl_professor as professor 
		    on professor.id = tbl_turma_curso_materia_professor.id_professor
	    inner join tbl_curso_materia 
		    on tbl_curso_materia.id = tbl_turma_curso_materia_professor.id_curso_materia
	    inner join tbl_curso as curso 
		    on tbl_curso_materia.id_curso = curso.id
	    inner join tbl_materia as materia
		    on tbl_curso_materia.id_materia = materia.id 
    where professor.id = 1 and turma.id = 1;
    `

    let rsMateria = await prisma.$queryRawUnsafe(sql);

    if (rsMateria.length > 0) {
        return rsMateria;
    } else {
        return false;
    }
}

module.exports = {
    mdlSelectAllMaterias,
    mdlSelectByIdMateria,
    mdlInsertMateria,
    mdlSelectLastId,
    mdlSelectBySiglaMateria,
    mdlSelectByIdCurso,
    mdlUpdateMateria,
    mdlDeleteMateria
}