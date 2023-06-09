/************************************************************************************************
 * Objetivo: Responsável pea manipulação de dados de REGISTRO DE TEMPO no Banco de Dados
 * Autor: Luiz Gustavo e Muryllo Vieira
 * Data: 08/06/2023
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

//Retorna a lista de todas as RegistroTempo
const mdlSelectAllRegistroTempo = async function () {

    //Script para buscar todos os itens no BD
    let sql = `select tbl_registro_tempo.id,
        date_format(tbl_registro_tempo.data_inicio, '%d/%m') as data_inicio, 
        time_format(tbl_registro_tempo.duracao_inicio, '%H:%i') as duracao_inicio,
        time_format(tbl_registro_tempo.duracao_termino, '%H:%i') as duracao_termino,
        time_format(tbl_registro_tempo.desconto, '%H:%i') as desconto,
        time_format(tbl_registro_tempo.liquido, '%H:%i') as liquido,
        time_format(tbl_registro_tempo.tempo_geral, '%H:%i') as tempo_geral,
        tbl_registro_tempo.id_tarefa,
        tbl_registro_tempo.id_matricula
    from tbl_registro_tempo;`;

    //$queryRawUnsafe(sql) - permite interpretar uma variavel como sendo um sriptSQL
    //queryRaw('select * from tbl_registro_tempo') - permite interpretar o scriptSQL direto no metodo
    let rsRegistroTempo = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsRegistroTempo.length > 0) {
        return rsRegistroTempo
    } else {
        return false;
    }
}

//Retorna a RegistroTempo filtrando pelo ID
const mdlSelectByIdRegistroTempo = async function (id) {

    let idRegistroTempo = id

    //Script para buscar uma RegistroTempo filtrando pelo ID
    let sql = `select date_format(tbl_registro_tempo.data_inicio, '%d/%m') as data_inicio, 
                    time_format(tbl_registro_tempo.duracao_inicio, '%H:%i') as duracao_inicio,
                    time_format(tbl_registro_tempo.duracao_termino, '%H:%i') as duracao_termino,
                    time_format(tbl_registro_tempo.desconto, '%H:%i') as desconto,
                    time_format(tbl_registro_tempo.liquido, '%H:%i') as liquido,
                    time_format(tbl_registro_tempo.tempo_geral, '%H:%i') as tempo_geral,
                    tbl_registro_tempo.id_tarefa,
                    tbl_registro_tempo.id_matricula
                from tbl_registro_tempo where id = ${idRegistroTempo}`;

    //console.log(sql);
    let rsRegistroTempo = await prisma.$queryRawUnsafe(sql)

    //Valida de o Banco de Dados retornou algum registro
    if (rsRegistroTempo.length > 0) {
        return rsRegistroTempo
    } else {
        return false;
    }
}

//Inserir dados de RegistroTempo no Banco de dados
const mdlInsertRegistroTempo = async function (dadosRegistroTempo) {

    let sql = `insert into tbl_registro_tempo(data_inicio,
                    duracao_inicio,
                    duracao_termino,
                    desconto,
                    liquido,
                    tempo_geral,
                    id_tarefa,
                    id_matricula
                ) values (
                    '${dadosRegistroTempo.data_inicio}',
                    time_format('${dadosRegistroTempo.duracao_inicio}', '%H:%i'),
                    time_format('${dadosRegistroTempo.duracao_termino}', '%H:%i'),
                    time_format('${dadosRegistroTempo.desconto}', '%H:%i'),
                    time_format('${dadosRegistroTempo.liquido}', '%H:%i'),
                    time_format('${dadosRegistroTempo.tempo_geral}', '%H:%i'),
                    ${dadosRegistroTempo.id_tarefa},
                    ${dadosRegistroTempo.id_matricula}
                    );`
                

    //Executa o scriptSQL no banco de dados
    console.log(sql);
    let resultStatus = await prisma.$executeRawUnsafe(sql);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Atualizar uma RegistroTempo existente 
const mdlUpdateRegistroTempo = async function (dadosRegistroTempo) {

    let sql = `update tbl_registro_tempo
    set data_inicio = '${dadosRegistroTempo.data_inicio}',
        duracao_inicio = '${dadosRegistroTempo.duracao_inicio}',
        duracao_termino = '${dadosRegistroTempo.duracao_termino}',
        desconto = '${dadosRegistroTempo.desconto}',
        liquido = '${dadosRegistroTempo.liquido}',
        tempo_geral = '${dadosRegistroTempo.tempo_geral}',
        id_tarefa = ${dadosRegistroTempo.id_tarefa},
        id_matricula = ${dadosRegistroTempo.id_matricula}
    where id = ${dadosRegistroTempo.id};
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

    let sql = 'select * from tbl_registro_tempo order by id desc limit 1'

    let rsRegistroTempo = await prisma.$queryRawUnsafe(sql);

    if (rsRegistroTempo.length > 0) {
        return rsRegistroTempo;
    } else {
        return false;
    }
}

//Excluir uma RegistroTempo existente
const mdlDeleteRegistroTempo = async function (id) {

    let sql = `delete from tbl_registro_tempo where id = ${id}`

    let resultStatus = await prisma.$queryRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}

module.exports = {
    mdlSelectAllRegistroTempo,
    mdlSelectByIdRegistroTempo,
    mdlInsertRegistroTempo,
    mdlUpdateRegistroTempo,
    mdlSelectLastId,
    mdlDeleteRegistroTempo
}