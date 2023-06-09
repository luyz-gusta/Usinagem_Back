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

const mdlSelectAllCriterio = async () => {
    let sql = `
    select 
	    criterio.id,
	    criterio.descricao as descricao_criterio,
        criterio.nota_valida as nota_valida_criterio,
        criterio.resultado_desejado as resultado_desejado_criterio,
        criterio.tipo_critico as tipo_critico_criterio,
        criterio.id_tarefa as id_tarefa_criterio,
        tarefa.nome as nome_tarefa,
        tarefa.numero as numero_tarefa,
        tarefa.foto_peca as foto_peca_tarefa
    from tbl_criterio as criterio
	    inner join tbl_tarefa as tarefa on criterio.id_tarefa = tarefa.id
    order by criterio.id asc;
    `

    let rsCriterio = await prisma.$queryRawUnsafe(sql)

    if (rsCriterio.length > 0) {
        return rsCriterio
    } else {
        return false
    }
}

const mdlSelectCriterioByID = async (idCriterio) => {
    let sql = `
    select 
	    criterio.id,
	    criterio.descricao as descricao_criterio,
        criterio.nota_valida as nota_valida_criterio,
        criterio.resultado_desejado as resultado_desejado_criterio,
        criterio.tipo_critico as tipo_critico_criterio,
        criterio.id_tarefa as id_tarefa_criterio,
        tarefa.nome as nome_tarefa,
        tarefa.numero as numero_tarefa,
        tarefa.foto_peca as foto_peca_tarefa
    from tbl_criterio as criterio
	    inner join tbl_tarefa as tarefa on criterio.id_tarefa = tarefa.id
    where criterio.id = ${idCriterio};
    `

    let rsCriterio = await prisma.$queryRawUnsafe(sql)

    if (rsCriterio.length > 0) {
        return rsCriterio
    } else {
        return false
    }
}

const mdlSelectCriterioByIdTarefa = async (idTarefa) => {
    let sql = `
    select 
	    criterio.id,
	    criterio.descricao as descricao_criterio,
        criterio.nota_valida as nota_valida_criterio,
        criterio.resultado_desejado as resultado_desejado_criterio,
        criterio.tipo_critico as tipo_critico_criterio,
        criterio.id_tarefa as id_tarefa_criterio,
        tarefa.nome as nome_tarefa,
        tarefa.numero as numero_tarefa,
        tarefa.foto_peca as foto_peca_tarefa
    from tbl_criterio as criterio
	    inner join tbl_tarefa as tarefa on criterio.id_tarefa = tarefa.id
    where criterio.id_tarefa = ${idTarefa};
    `

    let rsCriterio = await prisma.$queryRawUnsafe(sql)

    if (rsCriterio.length > 0) {
        return rsCriterio
    } else {
        return false
    }
}

const mdlInsertCriterio = async (dadosCriterio) =>{
    let sql = `
    insert into tbl_criterio(
        descricao, 
        nota_valida,
        resultado_desejado, 
        tipo_critico, 
        id_tarefa
    ) values (
        '${dadosCriterio.descricao}',
        ${dadosCriterio.nota_valida},
        '${dadosCriterio.resultado_desejado}',
        ${dadosCriterio.tipo_critico},
        ${dadosCriterio.id_tarefa}
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

const mdlSelectLastByID = async () => {
    let sql = `select * from tbl_criterio order by id desc limit 1;
    `
    
    let rsCriterio = await prisma.$queryRawUnsafe(sql)

    if (rsCriterio.length > 0) {
        return rsCriterio
    } else {
        return false
    }
}


module.exports = {
    mdlSelectAllCriterio,
    mdlSelectCriterioByID,
    mdlSelectCriterioByIdTarefa,
    mdlSelectLastByID,
    mdlInsertCriterio
}