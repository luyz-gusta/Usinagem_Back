/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados de TAREFA no Banco de Dados
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

//Retorna a lista de todas as tarefas
const mdlSelectAllTarefas = async function () {

    //Script para buscar todos os itens no BD
    let sql = `
    select tarefa.id , tarefa.nome as nome_tarefa, 
        time_format(tarefa.tempo_previsto, '%H:%i') as tempo_previsto_tarefa, 
        tarefa.numero as numero_tarefa, tarefa.foto_peca, 
        tarefa.id_tipo_tarefa,
        tipo_tarefa.nome as nome_tipo_tarefa
    from tbl_tarefa as tarefa
	    inner join tbl_tipo_tarefa as tipo_tarefa
		    on tipo_tarefa.id = tarefa.id_tipo_tarefa;
    `;

    //$queryRawUnsafe(sql) - permite interpretar uma variavel como sendo um sriptSQL
    //queryRaw('select * from tbl_tarefa') - permite interpretar o scriptSQL direto no metodo
    let rsTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTarefa.length > 0) {
        return rsTarefa
    } else {
        return false;
    }
}

//Retorna a Tarefa filtrando pelo ID
const mdlSelectByIdTarefa = async function (id) {

    //Script para buscar uma Tarefa filtrando pelo ID
    let sql = `
    select tarefa.id , tarefa.nome as nome_tarefa, 
        tarefa.tempo_previsto as tempo_previsto_tarefa, 
        tarefa.numero as numero_tarefa, tarefa.foto_peca, 
        tarefa.id_tipo_tarefa,
        tipo_tarefa.nome as nome_tipo_tarefa
    from tbl_tarefa as tarefa
	    inner join tbl_tipo_tarefa as tipo_tarefa
		    on tipo_tarefa.id = tarefa.id_tipo_tarefa
    where tarefa.id = ${id}
    `;

    //console.log(sql);
    let rsTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTarefa.length > 0) {
        return rsTarefa
    } else {
        return false;
    }
}

//Retorna a Tarefa filtrando pelo nome
const mdlSelectByNameTarefa = async function (nome) {

    //Script para buscar uma Tarefa filtrando pelo nome
    let sql = `
    select tarefa.id , tarefa.nome as nome_tarefa, 
        time_format(tarefa.tempo_previsto, '%H:%i') as tempo_previsto_tarefa, 
        tarefa.numero as numero_tarefa, tarefa.foto_peca, 
        tarefa.id_tipo_tarefa,
        tipo_tarefa.nome as nome_tipo_tarefa
    from tbl_tarefa as tarefa
	    inner join tbl_tipo_tarefa as tipo_tarefa
		    on tipo_tarefa.id = tarefa.id_tipo_tarefa
    where tarefa.nome like '%${nome}%'
    `;

    let rsTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTarefa.length > 0) {
        return rsTarefa
    } else {
        return false;
    }
}

const mdlSelectByTipoTarefa = async (idTipoTarefa) => {
    //Script para buscar uma Tarefa filtrando pelo id_itpo_tarefa
    let sql = `
    select tarefa.id , tarefa.nome as nome_tarefa, 
        time_format(tarefa.tempo_previsto, '%H:%i') as tempo_previsto_tarefa, 
        tarefa.numero as numero_tarefa, tarefa.foto_peca, 
        tarefa.id_tipo_tarefa,
        tipo_tarefa.nome as nome_tipo_tarefa
    from tbl_tarefa as tarefa
	    inner join tbl_tipo_tarefa as tipo_tarefa
		    on tipo_tarefa.id = tarefa.id_tipo_tarefa
    where tarefa.id_tipo_tarefa = ${idTipoTarefa}'
    `;

    let rsTarefa = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsTarefa.length > 0) {
        return rsTarefa
    } else {
        return false;
    }


}

//Inserir dados de  tarefa no Banco de dados
const mdlInsertTarefa = async function (dadosTarefa) {
    let sql = `
    insert into tbl_tarefa(
        nome,
        tempo_previsto,
        numero,
        foto_peca,
        id_tipo_tarefa
    ) values (
        '${dadosTarefa.nome}',
        time_format("${dadosTarefa.tempo_previsto}", '%H:%i'),
        ${dadosTarefa.numero},
        '${dadosTarefa.foto_peca}',
        ${dadosTarefa.id_tipo_tarefa}
    );`

    //Executa o scriptSQL no banco de dados
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Atualizar uma Tarefa existente 
const mdlUpdateTarefa = async function (dadosTarefa) {
    let sql = `update tbl_tarefa
    set nome = '${dadosTarefa.nome}',
        tempo_previsto = '${dadosTarefa.tempo_previsto}',
        numero = ${dadosTarefa.numero},
        foto_peca = '${dadosTarefa.foto_peca}',
        id_tipo_tarefa = ${dadosTarefa.id_tipo_tarefa}
    where id = ${dadosTarefa.id};
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

    let sql = 'select * from tbl_tarefa order by id desc limit 1'

    let rsTarefa = await prisma.$queryRawUnsafe(sql);

    if (rsTarefa.length > 0) {
        return rsTarefa;
    } else {
        return false;
    }
}

//Excluir uma tarefa existente
const mdlDeleteTarefa = async function (id) {

    let sql = `delete from tbl_tarefa where id = ${id}`

    let resultStatus = await prisma.$queryRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

module.exports = {
    mdlSelectAllTarefas,
    mdlSelectByIdTarefa,
    mdlSelectByNameTarefa,
    mdlSelectByTipoTarefa,
    mdlSelectLastId,
    mdlInsertTarefa,
    mdlUpdateTarefa,
    mdlDeleteTarefa
}