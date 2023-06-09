/**************************************************************************************
 *  Objetivo: API para integração entre back e banco de dados (GET, POST, PUT, DELETE)
 *  Autor: Muryllo, Luiz, Millena, Bianca, Marcelo
 *  Data: 20/05/2023
 *  Versão: 1.0
 **************************************************************************************/

/**
 * Express - dependencia para realizar requisições de API pelo protocolo HTTP 
 *      npm install express --save
 * 
 *  Cors - dependencia para gerenciar permissões de requisição da API
 *      npm install cors --save
 * 
 *  Body-Parser - dependencia que gerencia o corpo das resquisições 
 *      npm install body-parser --save
 **/

//Dependencia para criar as requisições de API
const express = require('express');

//Dependencia para gerenciar as permissões da API
const cors = require('cors');

//Dependencia para gerenciar o corpo das requisições da API
const bodyParser = require('body-parser');

//Cria o objeto app conforme a classe do express
const app = express()

app.use((request, response, next) => {
    //Define quem poderá acessar a api(* - Todos)
    response.header('Acess-Control-Allow-Origin', '*')

    //Define quais metodos serão utilizados na api
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    //Atribui as permissões ao cors
    app.use(cors())

    next()
})

//CRUD (Create, Read, Update e Delete)

/*****************************************************************************************************************
* Objetivo: API de controle de ALUNOS
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

/*
Instalação do PRISMA no projeto (biblioteca para conexão com Banco de Dados)
    npm install prisma --save
    npx prisma
    npx prisma init
    npm install @prisma/client --save

    npx prisma migrate dev  ###Serve para realizar o sincronismo entre o prisma e o Banco de Dados
*/

//Define que os dados que irão chegar no body da requisição será no padrao JSON
const bodyParserJson = bodyParser.json();

//Import do arquivo de configuração das variaveis, constantes e funções globais
var message = require('./controller/modulo/config.js')

var controllerAluno = require('./controller/controller_aluno.js')

//EndPoint: Retorna todos os dados de alunos
app.get('/v1/projeto-usinagem/aluno', cors(), async function (request, response) {

    //Recebe os dados da controller do aluno
    let dadosAluno = await controllerAluno.getAlunos();

    response.status(dadosAluno.status);
    response.json(dadosAluno);
})

//EndPoint: Retorna todos os dados de alunos
app.get('/v1/projeto-usinagem/aluno', cors(), async function (request, response) {

    //Recebe os dados da controller do aluno
    let dadosAluno = await controllerAluno.getAlunos();

    response.status(dadosAluno.status);
    response.json(dadosAluno);

})

//EndPoint: Retorna o aluno filtrando pelo ID
app.get('/v1/projeto-usinagem/aluno/:id', cors(), async function (request, response) {

    let idAluno = request.params.id;

    //Recebe os dados da controller do aluno
    let dadosAluno = await controllerAluno.getBuscarAlunoID(idAluno);

    response.status(dadosAluno.status);
    response.json(dadosAluno)

})

//EndPoint: Retorna o aluno filtrando pelo nome
app.get('/v1/projeto-usinagem/aluno/nome/:nome', cors(), async function (request, response) {

    let nome = request.params.nome;

    //Import do arquivo da controller que irá solicitar a model os dados do BD
    let controllerAluno = require('./controller/controller_aluno.js')

    //Recebe os dados da controller do aluno
    let dadosAluno = await controllerAluno.getBuscarAlunoNome(nome);

    if (dadosAluno) {
        response.json(dadosAluno);
        response.status(200);
    } else {
        response.json();
        response.status(404);
    }
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/aluno', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosAluno = await controllerAluno.inserirAluno(dadosBody)

        response.status(resultDadosAluno.status)
        response.json(resultDadosAluno)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Atualiza um aluno existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/aluno/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idAluno = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosAluno = await controllerAluno.atualizarAlunoPeloID(dadosBody, idAluno);

        response.status(resultDadosAluno.status);
        response.json(resultDadosAluno);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Exclui um aluno, filtrando pelo ID
app.delete('/v1/projeto-usinagem/aluno/:id', cors(), async function (request, response) {

    // Recebe o ID do aluno pelo parametro
    let idAluno = request.params.id

    // Encaminha os dados para a controller
    let resultDadosAluno = await controllerAluno.deletarAlunoPeloID(idAluno)

    if (resultDadosAluno.length != 0) {
        response.status(resultDadosAluno.status)
        response.json(resultDadosAluno)
    } else {
        message.ERROR_INVALID_ID
    }
})



/*****************************************************************************************************************
* Objetivo: API de controle de PROFESSORES
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

var controllerProfessor = require('./controller/controller_professor.js')

//EndPoint: Retorna todos os dados de professores
app.get('/v1/projeto-usinagem/professor', cors(), async function (request, response) {
    let dadosProfessor = await controllerProfessor.ctlGetProfessores()

    response.status(dadosProfessor.status)
    response.json(dadosProfessor)
})

//EndPoint: Retorna o professores filtrando pelo ID
app.get('/v1/projeto-usinagem/professor/:id', cors(), async function (request, response) {
    let idProfessor = request.params.id

    let dadosProfessor = await controllerProfessor.ctlGetBuscarProfessorID(idProfessor)

    response.status(dadosProfessor.status)
    response.json(dadosProfessor)
})

//EndPoint: Retorna o professor filtrando pelo nome
app.get('/v1/projeto-usinagem/professor/nome/:nome', cors(), async function (request, response) {
    let nomeProfessor = request.params.nome

    let dadosProfessor = await controllerProfessor.ctlGetBuscarProfessorNome(nomeProfessor)

    response.status(dadosProfessor.status)
    response.json(dadosProfessor)
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/professor', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body

        let resultDadosProfessor = await controllerProfessor.ctlInserirProfessor(dadosBody)

        response.status(resultDadosProfessor.status)
        response.json(resultDadosProfessor)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Atualiza um professor existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/professor/:id', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idProfessor = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosProfessor = await controllerProfessor.ctlAtualizarProfessor(dadosBody, idProfessor)

        response.status(resultDadosProfessor.status)
        response.json(resultDadosProfessor)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Exclui um professor, filtrando pelo ID
app.delete('/v1/projeto-usinagem/professor/:id', cors(), async function (request, response) {
    let idProfessor = request.params.id

    let dadosProfessor = await controllerProfessor.ctlDeletarProfessor(idProfessor)

    response.status(dadosProfessor.status)
    response.json(dadosProfessor)
})

/*****************************************************************************************************************
* Objetivo: API de controle de USUARIO
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

var controllerUsuario = require('./controller/controller_usuario.js')

//EndPoint: Retorna todos os dados de usuario
app.get('/v1/projeto-usinagem/usuario', cors(), async function (request, response) {
    let nivelUsuario = request.query.nivel

    if (nivelUsuario != undefined) {
        let dadosUsuariosJSON = await controllerUsuario.ctlGetUsuarioNivel(nivelUsuario)

        response.status(dadosUsuariosJSON.status)
        response.json(dadosUsuariosJSON)
    } else {
        let dadosUsuario = await controllerUsuario.ctlGetUsuarios()

        response.status(dadosUsuario.status)
        response.json(dadosUsuario)
    }
})

//EndPoint: Retorna o usuario filtrando pelo ID
app.get('/v1/projeto-usinagem/usuario/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id

    let dadosUsuariosJSON = await controllerUsuario.ctlGetUsuarioID(idUsuario)

    response.status(dadosUsuariosJSON.status)
    response.json(dadosUsuariosJSON)
})

//EndPoint: Retorna o usuario filtrando pelo Email e Senha
app.get('/v1/projeto-usinagem/usuario/email/senha/:email', cors(), async function (request, response) {
    let emailUsuario = request.params.email

    let senhaUsuario = request.query.senha

    let dadosUsuariosJSON = await controllerUsuario.ctlGetUsuarioEmailSenha(emailUsuario, senhaUsuario)

    response.status(dadosUsuariosJSON.status)
    response.json(dadosUsuariosJSON)
})

//EndPoint: Retorna o usuario filtrando pelo Email
app.get('/v1/projeto-usinagem/usuario/email/:email', cors(), async function (request, response) {
    let emailUsuario = request.params.email

    let dadosUsuariosJSON = await controllerUsuario.ctlGetUsuarioEmail(emailUsuario)

    response.status(dadosUsuariosJSON.status)
    response.json(dadosUsuariosJSON)
})

//EndPoint: Retorna o usuario filtrando pelo nivel
app.get('/v1/projeto-usinagem/usuario/nivel/:nivel', cors(), async function (request, response) {
    let nivelUsuario = request.params.nivel

    let dadosUsuariosJSON = await controllerUsuario.ctlGetUsuarioNivel(nivelUsuario)

    response.status(dadosUsuariosJSON.status)
    response.json(dadosUsuariosJSON)
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/usuario', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body

        let resultDadosUsuario = await controllerUsuario.ctlInserirUsuario(dadosBody)

        response.status(resultDadosUsuario.status)
        response.json(resultDadosUsuario)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Atualiza um usuario existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/usuario/:id', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idUsuario = request.params.id;

        //Recebe os dados dos aluno encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosAlunos = await controllerUsuario.ctlAtualizarUsuario(dadosBody, idUsuario)

        response.status(resultDadosAlunos.status)
        response.json(resultDadosAlunos)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Exclui um usuario, filtrando pelo ID
app.delete('/v1/projeto-usinagem/usuario/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id;

    let resultDadosUsuario = await controllerUsuario.ctlExcluirUsuario(idUsuario)

    response.status(resultDadosUsuario.status)
    response.json(resultDadosUsuario)
})

/*****************************************************************************************************************
* Objetivo: API de controle de STATUS DE USUARIO
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

//Import do arquivo da controller que irá solicitar a model os dados do BD
var controllerStatusUsuario = require('./controller/controller_status-usuario.js')

//EndPoint: Retorna todos os dados de status de usuario
app.get('/v1/projeto-usinagem/status-usuario', cors(), async function (request, response) {

    //Recebe os dados da controller do status de usuario    
    let dadosStatusUsuario = await controllerStatusUsuario.ctlGetStatusUsuario();

    response.status(dadosStatusUsuario.status);
    response.json(dadosStatusUsuario);
})

//EndPoint: Retorna o status de usuario filtrando pelo ID
app.get('/v1/projeto-usinagem/status-usuario/:id', cors(), async function (request, response) {

    let idStatus = request.params.id;

    //Recebe os dados da controller do status de usuario    
    let dadosStatusUsuario = await controllerStatusUsuario.ctlGetBuscarStatusUsuarioID(idStatus);

    response.status(dadosStatusUsuario.status);
    response.json(dadosStatusUsuario);
})

//EndPoint: Retorna o status de usuario filtrando pelo NOME
app.get('/v1/projeto-usinagem/status-usuario/nome/:nome', cors(), async function (request, response) {

    let nomeStatus = request.params.nome;

    //Recebe os dados da controller do status de usuario    
    let dadosStatusUsuario = await controllerStatusUsuario.ctlGetBuscarStatusUsuarioNome(nomeStatus);

    response.status(dadosStatusUsuario.status);
    response.json(dadosStatusUsuario);
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/status-usuario', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosStatusUsuario = await controllerStatusUsuario.ctlInsertStatusUsuario(dadosBody)

        response.status(resultDadosStatusUsuario.status)
        response.json(resultDadosStatusUsuario)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Atualiza um status de usuario existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/status-usuario/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idStatus = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosStatusUsuario = await controllerStatusUsuario.ctlAtualizarStatusUsuarioID(dadosBody, idStatus);

        response.status(resultDadosStatusUsuario.status);
        response.json(resultDadosStatusUsuario);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Exclui um status de usuario, filtrando pelo ID
app.delete('/v1/projeto-usinagem/status-usuario/:id', cors(), async function (request, response) {

    // Recebe o ID do status de usuario pelo parametro
    let idStatus = request.params.id

    // Encaminha os dados para a controller
    let resultDadosStatusUsuario = await controllerStatusUsuario.ctlDeletarStatusUsuario(idStatus)

    if (resultDadosStatusUsuario.length != 0) {
        response.status(resultDadosStatusUsuario.status)
        response.json(resultDadosStatusUsuario)
    } else {
        message.ERROR_INVALID_ID
    }

})


/*****************************************************************************************************************
* Objetivo: API de controle de TURMA
* Data: 20/05/2023
* Autor: Luiz, Muryllo e Millena
* Versão: 1.0
******************************************************************************************************************/


var controllerTurmas = require('./controller/controller_turmas.js')

//EndPoint: Retorna todos os dados de turma
app.get('/v1/projeto-usinagem/turma', cors(), async function (request, response) {
    let idCurso = request.query.idCurso

    console.log('app-turma');

    if (idCurso) {
        //Recebe os dados da controller do status de usuario    
        let dadosTurmas = await controllerTurmas.ctlGetTurmasIDCurso(idCurso)

        response.status(dadosTurmas.status);
        response.json(dadosTurmas);
    } else {
        //Recebe os dados da controller do status de usuario    
        let dadosTurmas = await controllerTurmas.ctlGetTurmas()

        response.status(dadosTurmas.status);
        response.json(dadosTurmas);
    }
})

//EndPoint: Retorna a turma filtrando pelo ID
app.get('/v1/projeto-usinagem/turma/:id', cors(), async function (request, response) {
    // Recebe o ID do status de usuario pelo parametro
    let idTurma = request.params.id

    // Encaminha os dados para a controller
    let resultDadosTurmas = await controllerTurmas.ctlGetTurmasID(idTurma)

    if (resultDadosTurmas.length != 0) {
        response.status(resultDadosTurmas.status)
        response.json(resultDadosTurmas)
    } else {
        message.ERROR_INVALID_ID
    }

})

//EndPoint: Retorna a turma filtrando pelo nome
app.get('/v1/projeto-usinagem/turma/nome/:nome', cors(), async function (request, response) {

    // Recebe o ID do status de usuario pelo parametro
    let nomeTurma = request.params.nome

    // Encaminha os dados para a controller
    let resultDadosTurmas = await controllerTurmas.ctlGetTurmasNome(nomeTurma)

    if (resultDadosTurmas.length != 0) {
        response.status(resultDadosTurmas.status)
        response.json(resultDadosTurmas)
    } else {
        message.ERROR_INVALID_ID
    }
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/turma', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosTurmas = await controllerTurmas.ctlGetInserirTurma(dadosBody)

        response.status(resultDadosTurmas.status)
        response.json(resultDadosTurmas)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Atualiza uma turma existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/turma/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        // Recebe o ID do status de usuario pelo parametro
        let idTurma = request.params.id

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosTurmas = await controllerTurmas.ctlAtualizarTurma(dadosBody, idTurma)

        //console.log(resultDadosTurmas);

        response.status(resultDadosTurmas.status)
        response.json(resultDadosTurmas)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Exclui uma turma, filtrando pelo ID
app.delete('/v1/projeto-usinagem/turma/:id', cors(), async function (request, response) {

    // Recebe o ID do status de usuario pelo parametro
    let idTurma = request.params.id

    // Encaminha os dados para a controller
    let resultDadosTurma = await controllerTurmas.ctlDeletarTurma(idTurma)

    if (resultDadosTurma.length != 0) {
        response.status(resultDadosTurma.status)
        response.json(resultDadosTurma)
    } else {
        message.ERROR_INVALID_ID
    }
})



/*****************************************************************************************************************
* Objetivo: API de controle de CURSO
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

//EndPoint: Retorna todos os dados de curso
app.get('/v1/projeto-usinagem/curso', cors(), async function (request, response) {

    //Recebe od dados da controller do curso
    let dadosCurso = await controllerCurso.ctlGetCursos()

    response.status(dadosCurso.status)
    response.json(dadosCurso)

})

//EndPoint: Retorna o curso filtrando pelo ID
app.get('/v1/projeto-usinagem/curso/:id', cors(), async function (request, response) {
    let idCurso = request.params.id

    //Recebe od dados da controller do curso
    let dadosCurso = await controllerCurso.ctlGetCursosID(idCurso)

    response.status(dadosCurso.status)
    response.json(dadosCurso)
})

//EndPoint: Retorna o curso filtrando pelo NOME
app.get('/v1/projeto-usinagem/curso/nome/:nome', cors(), async function (request, response) {
    let nomeCurso = request.params.nome

    let dadosCursoJSON = await controllerCurso.ctlGetCursosNome(nomeCurso)

    response.status(dadosCursoJSON.status)
    response.json(dadosCursoJSON)
})

//EndPoint: Retorna o curso filtrando pela SIGLA
app.get('/v1/projeto-usinagem/curso/sigla/:sigla', cors(), async function (request, response) {
    let siglaCurso = request.params.sigla

    let dadosCursoJSON = await controllerCurso.ctlGetCursosSigla(siglaCurso)

    response.status(dadosCursoJSON.status)
    response.json(dadosCursoJSON)
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/curso', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body

        let resultDadosCurso = await controllerCurso.ctlInserirCurso(dadosBody)

        response.status(resultDadosCurso.status)
        response.json(resultDadosCurso)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Atualiza um curso existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/curso/:id', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do curso pelo parametro
        let idUsuario = request.params.id;

        //Recebe os dados dos curso encaminhado no corpo da requisição
        let dadosBody = request.body

        let resultDadosCurso = await controllerCurso.ctlAtualizarCurso(dadosBody, idUsuario)

        response.status(resultDadosCurso.status)
        response.json(resultDadosCurso)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Exclui um curso, filtrando pelo ID
app.delete('/v1/projeto-usinagem/curso/:id', cors(), async function (request, response) {
    //Recebe o ID do curso pelo parametro
    let idCurso = request.params.id;

    let resultDadosCurso = await controllerCurso.ctlExcluirCursos(idCurso)

    response.status(resultDadosCurso.status)
    response.json(resultDadosCurso)
})

/*****************************************************************************************************************
* Objetivo: API de controle de MATERIA
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

//Import do arquivo da controller que irá solicitar a model os dados do BD
var controllerMateria = require('./controller/controller_materia.js')

//EndPoint: Retorna todos os dados de materia
app.get('/v1/projeto-usinagem/materia', cors(), async function (request, response) {
    let idCurso = request.query.idCurso

    if (idCurso) {
        //Recebe os dados da controller de materia
        let dadosMateria = await controllerMateria.ctlGetBuscarMateriaIdCurso(idCurso);

        response.status(dadosMateria.status);
        response.json(dadosMateria);
    } else {
        //Recebe os dados da controller de materia
        let dadosMateria = await controllerMateria.ctlGetMaterias();

        response.status(dadosMateria.status);
        response.json(dadosMateria);
    }
})

//EndPoint: Retorna a materia filtrando pelo ID
app.get('/v1/projeto-usinagem/materia/:id', cors(), async function (request, response) {

    let idMateria = request.params.id

    let dadosMateria = await controllerMateria.ctlGetMateriaByID(idMateria)

    response.status(dadosMateria.status)
    response.json(dadosMateria)
})

// //EndPoint: Retorna a materia filtrando pelo NOME
// app.get('/v1/projeto-usinagem/materia/nome/:nome', cors(), async function (request, response) {

//     let materia = request.params.nome;

//     //Recebe os dados da controller da materia
//     let dadosMateria = await controllerMateria.ctlGetBuscarMateriaNome(materia);

//     response.status(dadosMateria.status)
//     response.json(dadosMateria)
// })

//EndPoint: Retorna a materia filtrando pela SIGLA
app.get('/v1/projeto-usinagem/materia/sigla/:sigla', cors(), async function (request, response) {

    let materia = request.params.sigla;

    //Recebe os dados da controller da materia
    let dadosMateria = await controllerMateria.ctlGetBuscarMateriaSigla(materia);

    response.status(dadosMateria.status)
    response.json(dadosMateria)

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/materia', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosMateria = await controllerMateria.ctlInserirMateria(dadosBody)

        response.status(resultDadosMateria.status)
        response.json(resultDadosMateria)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Atualiza uma materia existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/materia/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID da materia pelo parametro
        let idMateria = request.params.id;

        let dadosBody = request.body

        let resultDadosMateria = await controllerMateria.ctlAtualizarMateria(dadosBody, idMateria)

        response.status(resultDadosMateria.status)
        response.json(resultDadosMateria)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status)
        response.json(message.ERROR_INVALID_CONTENT_TYPE)
    }
})

//EndPoint: Exclui uma materia, filtrando pelo ID
app.delete('/v1/projeto-usinagem/materia/:id', cors(), async function (request, response) {

    //Recebe o ID da materia pelo parametro
    let idMateria = request.params.id;

    let resultDadosMateria = await controllerMateria.ctlDeletarMateriaPeloID(idMateria)

    response.status(resultDadosMateria.status)
    response.json(resultDadosMateria)

})


/*****************************************************************************************************************
* Objetivo: API de controle de REGISTRO DE TEMPO
* Data: 31/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

var controllerRegistro = require('./controller/controller_registro-tempo.js')

//EndPoint: Retorna todos os dados de REGISTRO DE TEMPO
app.get('/v1/projeto-usinagem/registro-tempo', cors(), async function (request, response) {

    //Recebe os dados da controller do registro de tempo
    let dadosRegistroTempo = await controllerRegistro.ctlGetRegistroTempo();

    response.status(dadosRegistroTempo.status);
    response.json(dadosRegistroTempo);

})

//EndPoint: Retorna o registro de tempo filtrando pelo ID
app.get('/v1/projeto-usinagem/registro-tempo/:id', cors(), async function (request, response) {

    let idRegistroTempo = request.params.id;

    //Recebe os dados da controller do registro de tempo
    let dadosRegistroTempo = await controllerRegistro.ctlGetRegistroTempoByID(idRegistroTempo);

    response.status(dadosRegistroTempo.status);
    response.json(dadosRegistroTempo)

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/registro-tempo', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosRegistroTempo = await controllerRegistro.ctlInserirRegistroTempo(dadosBody)

        response.status(resultDadosRegistroTempo.status)
        response.json(resultDadosRegistroTempo)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Atualiza um registro de tempo existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/registro-tempo/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID de registro de tempo pelo parametro
        let idRegistroTempo = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosRegistroTempo = await controllerRegistro.ctlAtualizarRegistroTempo(dadosBody, idRegistroTempo);

        response.status(resultDadosRegistroTempo.status);
        response.json(resultDadosRegistroTempo);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Exclui um registro de tempo, filtrando pelo ID
app.delete('/v1/projeto-usinagem/registro-tempo/:id', cors(), async function (request, response) {

    //Recebe o ID do curso pelo parametro
    let idRegistroTempo = request.params.id;

    let resultDadosRegistroTempo = await controllerRegistro.ctlDeletarRegistroTempoPeloID(idRegistroTempo)

    response.status(resultDadosRegistroTempo.status)
    response.json(resultDadosRegistroTempo)

})

/*****************************************************************************************************************
* Objetivo: API de controle de CRITERIO
* Data: 20/05/2023
* Autor: Luiz Muryllo
* Versão: 1.0
******************************************************************************************************************/

//Import do arquivo da controller que irá solicitar a model os dados do BD
var controllerCriterio = require('./controller/controller_criterio.js')

//EndPoint: Retorna todos os dados de criterio
app.get('/v1/projeto-usinagem/criterio', cors(), async function (request, response) {
    let idTarefaCriterio = request.query.idTarefa

    if (idTarefaCriterio) {
        //Recebe os dados da controller do aluno
        let dadosCriterio = await controllerCriterio.ctlGetCriterioByIdTarefa(idTarefaCriterio)

        response.status(dadosCriterio.status)
        response.json(dadosCriterio)
    } else {
        //Recebe os dados da controller do aluno
        let dadosCriterio = await controllerCriterio.ctlGetCriterios()

        response.status(dadosCriterio.status)
        response.json(dadosCriterio)
    }
})

//EndPoint: Retorna o criterio filtrando pelo ID
app.get('/v1/projeto-usinagem/criterio/:id', cors(), async function (request, response) {
    let idCriterio = request.params.id

    //Recebe os dados da controller do aluno
    let dadosCriterio = await controllerCriterio.ctlGetCriterioByID(idCriterio)

    response.status(dadosCriterio.status)
    response.json(dadosCriterio)
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/criterio', cors(), bodyParserJson, async function (request, response) {
    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosCriterio = await controllerCriterio.ctlInserirCriterio(dadosBody)

        response.status(resultDadosCriterio.status)
        response.json(resultDadosCriterio)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Atualiza um criterio, filtrando pelo ID
app.put('/v1/projeto-usinagem/criterio/:id', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Exclui um criterio, filtrando pelo ID
app.delete('/v1/projeto-usinagem/criterio/:id', cors(), async function (request, response) {

})

/*****************************************************************************************************************
* Objetivo: API de controle de MARGEM DE ERRO
* Data: 01/06/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

//EndPoint: Retorna todos os dados de Margem_Erro
app.get('/v1/projeto-usinagem/margem-erro', cors(), async function (request, response) {
    let idCriterio = request.query.idCriterio

    if (idCriterio) {
        let dadosMargemErro = await controllerMargemErro.ctlGetMargemErroIdCriterio(idCriterio)

        response.status(dadosMargemErro.status)
        response.json(dadosMargemErro)
    } else {
        let dadosMargemErro = await controllerMargemErro.ctlGetMargemErro()

        response.status(dadosMargemErro.status)
        response.json(dadosMargemErro)
    }
})

//EndPoint: Retorna o margem-erro filtrando pelo ID
app.get('/v1/projeto-usinagem/margem-erro/:id', cors(), async function (request, response) {
    let id = request.params.id;

    let dadosMargemErro = await controllerMargemErro.ctlGetMargemErroID(id)

    response.status(dadosMargemErro.status)
    response.json(dadosMargemErro)
})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/margem-erro', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um resultado-desejado existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/margem-erro/:id', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Exclui um resultado-desejado, filtrando pelo ID
app.delete('/v1/projeto-usinagem/margem-erro/:id', cors(), async function (request, response) {

})

/*****************************************************************************************************************
* Objetivo: API de controle de TAREFA
* Data: 20/05/2023
* Autor: Luiz e Muryllo
* Versão: 1.0
******************************************************************************************************************/

var controllerTarefa = require('./controller/controller_tarefa.js')

//EndPoint: Retorna todos os dados de TAREFA
app.get('/v1/projeto-usinagem/tarefa', cors(), async function (request, response) {

    let idTipoTarefa = request.query.idTipoTarefa

    if (idTipoTarefa) {
        //Recebe os dados da controller de tarefa
        let dadosTarefa = await controllerTarefa.ctlGetBuscarTarefaTipoTarefa(idTipoTarefa)

        response.status(dadosTarefa.status);
        response.json(dadosTarefa);
    } else {
        //Recebe os dados da controller de tarefa
        let dadosTarefa = await controllerTarefa.ctlGetTarefa()

        response.status(dadosTarefa.status);
        response.json(dadosTarefa);
    }
})

//EndPoint: Retorna a tarefa filtrando pelo ID
app.get('/v1/projeto-usinagem/tarefa/:id', cors(), async function (request, response) {

    let id = request.params.id;

    //Recebe os dados da controller da tarefa
    let dadosTarefa = await controllerTarefa.ctlGetTarefaByID(id);

    response.status(dadosTarefa.status)
    response.json(dadosTarefa)

})

//EndPoint: Retorna a tarefa filtrando pelo NOME
app.get('/v1/projeto-usinagem/tarefa/nome/:nome', cors(), async function (request, response) {

    let nome = request.params.nome;

    //Recebe os dados da controller da tarefa
    let dadosTarefa = await controllerTarefa.ctlGetBuscarTarefaNome(nome);

    response.status(dadosTarefa.status)
    response.json(dadosTarefa)

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/tarefa', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosTarefa = await controllerTarefa.ctlInserirTarefa(dadosBody)

        response.status(resultDadosTarefa.status)
        response.json(resultDadosTarefa)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Atualiza uma tarefa existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/tarefa/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID da tarefa pelo parametro
        let idTarefa = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosTarefa = await controllerTarefa.ctlAtualizarTarefa(dadosBody, idTarefa);

        response.status(resultDadosTarefa.status);
        response.json(resultDadosTarefa);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})


//EndPoint: Exclui uma tarefa, filtrando pelo ID
app.delete('/v1/projeto-usinagem/tarefa/:id', cors(), async function (request, response) {
    //Recebe o ID do curso pelo parametro
    let idTarefa = request.params.id;

    let resultDadosTarefa = await controllerTarefa.ctlDeletarTarefaPeloID(idTarefa)

    response.status(resultDadosTarefa.status)
    response.json(resultDadosTarefa)
})

/*****************************************************************************************************************
* Objetivo: API de controle de TIPO DE TAREFA
* Data: 20/05/2023
* Autor: Muryllo
* Versão: 1.0
******************************************************************************************************************/

var controllerTipoTarefa = require('./controller/controller_tipo-tarefa.js')

//EndPoint: Retorna todos os dados de TIPO DE TAREFA
app.get('/v1/projeto-usinagem/tipo-tarefa', cors(), async function (request, response) {

    //Recebe os dados da controller de tipo de tarefa
    let dadosTipoTarefa = await controllerTipoTarefa.ctlGetTipoTarefa()

    response.status(dadosTipoTarefa.status);
    response.json(dadosTipoTarefa);
})

//EndPoint: Retorna o tipo de tarefa filtrando pelo ID
app.get('/v1/projeto-usinagem/tipo-tarefa/:id', cors(), async function (request, response) {

    let id = request.params.id;

    //Recebe os dados da controller da tipo de tarefa
    let dadosTipoTarefa = await controllerTipoTarefa.ctlGetTipoTarefaByID(id);

    response.status(dadosTipoTarefa.status)
    response.json(dadosTipoTarefa)

})

//EndPoint: Retorna o tipo de tarefa filtrando pelo NOME
app.get('/v1/projeto-usinagem/tipo-tarefa/nome/:nome', cors(), async function (request, response) {

    let nome = request.params.nome;

    //Recebe os dados da controller da tipo de tarefa
    let dadosTipoTarefa = await controllerTipoTarefa.ctlGetBuscarTipoTarefaNome(nome);

    response.status(dadosTipoTarefa.status)
    response.json(dadosTipoTarefa)

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/tipo-tarefa', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosTipoTarefa = await controllerTipoTarefa.ctlInserirTipoTarefa(dadosBody)

        response.status(resultDadosTipoTarefa.status)
        response.json(resultDadosTipoTarefa)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Atualiza um tipo de tarefa existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/tipo-tarefa/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idTipoTarefa = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosTipoTarefa = await controllerTipoTarefa.ctlAtualizarTipoTarefa(dadosBody, idTipoTarefa);

        response.status(resultDadosTipoTarefa.status);
        response.json(resultDadosTipoTarefa);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }
})

//EndPoint: Exclui um tipo de tarefa, filtrando pelo ID
app.delete('/v1/projeto-usinagem/tipo-tarefa/:id', cors(), async function (request, response) {

    //Recebe o ID do curso pelo parametro
    let idTipoTarefa = request.params.id;

    let resultDadosTipoTarefa = await controllerTipoTarefa.ctlDeletarTipoTarefaPeloID(idTipoTarefa)

    response.status(resultDadosTipoTarefa.status)
    response.json(resultDadosTipoTarefa)
})


/*****************************************************************************************************************
* Objetivo: API de controle de AVALIAÇÃO_ALUNO   
* Data: 20/05/2023
* Autor: Muryllo
* Versão: 1.0
******************************************************************************************************************/

//EndPoint: Retorna todos os dados de AVALIAÇÃO_ALUNO
app.get('/v1/projeto-usinagem/avaliacao-aluno', cors(), async function (request, response) {

})

//EndPoint: Retorna o avaliação_professor filtrando pelo ID
app.get('/v1/projeto-usinagem/avaliacao-aluno/:id', cors(), async function (request, response) {

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/avaliacao-aluno', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um avaliacao-aluno existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/avaliacao-aluno/:id', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um avaliacao-aluno existente, filtrando pela SIGLA
app.put('/v1/projeto-usinagem/avaliacao-aluno/sigla/:sigla', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Exclui um avaliacao-aluno, filtrando pelo ID
app.delete('/v1/projeto-usinagem/avaliacao-aluno/:id', cors(), async function (request, response) {

})

//EndPoint: Exclui um avaliacao-aluno, filtrando pelo SIGLA
app.delete('/v1/projeto-usinagem/avaliacao-aluno/sigla/:sigla', cors(), async function (request, response) {

})

/*****************************************************************************************************************
* Objetivo: API de controle de AVALIAÇÃO_PROFESSOR 
* Data: 20/05/2023
* Autor: Muryllo
* Versão: 1.0
******************************************************************************************************************/

//EndPoint: Retorna todos os dados de AVALIAÇÃO_PROFESSOR
app.get('/v1/projeto-usinagem/avaliacao-professor', cors(), async function (request, response) {

})

//EndPoint: Retorna o avaliacao-professor filtrando pelo ID
app.get('/v1/projeto-usinagem/avaliacao-professor/:id', cors(), async function (request, response) {

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/avaliacao-professor', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um avaliacao-professor existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/avaliacao-professor/:id', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um avaliacao-professor existente, filtrando pela SIGLA
app.put('/v1/projeto-usinagem/avaliacao-professor/sigla/:sigla', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Exclui um avaliacao-professor, filtrando pelo ID
app.delete('/v1/projeto-usinagem/avaliacao-professor/:id', cors(), async function (request, response) {

})

//EndPoint: Exclui um avaliacao-professor, filtrando pelo SIGLA
app.delete('/v1/projeto-usinagem/avaliacao-professor/sigla/:sigla', cors(), async function (request, response) {

})

/*****************************************************************************************************************
* Objetivo: API de controle de MATRICULA
* Data: 05/06/2023
* Autor: Muryllo, Luiz e Millena
* Versão: 1.0
******************************************************************************************************************/

var controllerMatricula = require('./controller/controller_matricula.js')

//EndPoint: Retorna todos os dados de Matricula
app.get('/v1/projeto-usinagem/matricula', cors(), async function (request, response) {

    //Recebe os dados da controller do matricula
    let dadosMatricula = await controllerMatricula.ctlGetMatriculas();

    response.status(dadosMatricula.status);
    response.json(dadosMatricula);

})

//EndPoint: Retorna a matricula filtrando pelo ID
app.get('/v1/projeto-usinagem/matricula/:id', cors(), async function (request, response) {

    let idMatricula = request.params.id;

    //Recebe os dados da controller da matricula
    let dadosMatricula = await controllerMatricula.ctlGetBuscarMatriculaID(idMatricula);

    response.status(dadosMatricula.status);
    response.json(dadosMatricula);

})

//EndPoint: Retorna a matricula filtrando pelo numero da matricula
app.get('/v1/projeto-usinagem/matricula/numero/:numero', cors(), async function (request, response) {

    let numeroMatricula = request.params.numero;

    //Recebe os dados da controller da matricula
    let dadosMatricula = await controllerMatricula.ctlGetBuscarMatriculaNumero(numeroMatricula);

    response.status(dadosMatricula.status);
    response.json(dadosMatricula);

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/matricula', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosMatricula = await controllerMatricula.ctlInserirMatricula(dadosBody)

        response.status(resultDadosMatricula.status)
        response.json(resultDadosMatricula)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Atualiza um matricula existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/matricula/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idMatricula = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosMatricula = await controllerMatricula.ctlAtualizarMatriculaPeloID(dadosBody, idMatricula);

        response.status(resultDadosMatricula.status);
        response.json(resultDadosMatricula);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})


//EndPoint: Exclui um matricula, filtrando pelo ID
app.delete('/v1/projeto-usinagem/matricula/:id', cors(), async function (request, response) {

    let id = request.params.id;

    //Recebe os dados da controller da matricula
    let dadosMatricula = await controllerMatricula.ctlDeletarMatriculaPeloID(id);

    response.status(dadosMatricula.status)
    response.json(dadosMatricula)

})

/*****************************************************************************************************************
* Objetivo: API de controle de STATUS DA MATRICULA
* Data: 05/06/2023
* Autor: Muryllo, Luiz e Millena
* Versão: 1.0
******************************************************************************************************************/

var controllerStatusMatricula = require('./controller/controller_status-matricula.js')

//EndPoint: Retorna todos os dados de status da Matricula
app.get('/v1/projeto-usinagem/status-matricula', cors(), async function (request, response) {

    //Recebe os dados da controller de status da matricula
    let dadosStatusMatricula = await controllerStatusMatricula.ctlGetStatusMatricula()

    response.status(dadosStatusMatricula.status);
    response.json(dadosStatusMatricula);

})

//EndPoint: Retorna a status da matricula filtrando pelo ID
app.get('/v1/projeto-usinagem/status-matricula/:id', cors(), async function (request, response) {

    let id = request.params.id;

    //Recebe os dados da controller da status da matricula
    let dadosStatusMatricula = await controllerStatusMatricula.ctlGetStatusMatriculaByID(id);

    response.status(dadosStatusMatricula.status)
    response.json(dadosStatusMatricula)

})

//EndPoint: Retorna a status da matricula filtrando pelo nome do status da matricula
app.get('/v1/projeto-usinagem/status-matricula/nome/:nome', cors(), async function (request, response) {

    let nome = request.params.nome;

    //Recebe os dados da controller da status da matricula
    let dadosStatusMatricula = await controllerStatusMatricula.ctlGetStatusMatriculaByName(nome);

    response.status(dadosStatusMatricula.status)
    response.json(dadosStatusMatricula)

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/status-matricula', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    if (String(contentType).toLowerCase() == 'application/json') {

        //Recebe os dados encaminhados na requisição
        let dadosBody = request.body;

        let resultDadosStatusMatricula = await controllerStatusMatricula.ctlInserirStatusMatricula(dadosBody)

        response.status(resultDadosStatusMatricula.status)
        response.json(resultDadosStatusMatricula)
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})

//EndPoint: Atualiza um status da matricula existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/status-matricula/:id', cors(), bodyParserJson, async function (request, response) {

    //Recebe o content-type da requisição
    let contentType = request.headers['content-type'];

    //Validação para receber dados apenas no formato JSON
    if (String(contentType).toLowerCase() == 'application/json') {
        //Recebe o ID do aluno pelo parametro
        let idStatusMatricula = request.params.id;

        //Recebe os dados encaminhados no corpo da requisição
        let dadosBody = request.body;

        //Encaminha os dados para a controller
        let resultDadosStatusMatricula = await controllerStatusMatricula.ctlAtualizarStatusMatricula(dadosBody, idStatusMatricula);

        response.status(resultDadosStatusMatricula.status);
        response.json(resultDadosStatusMatricula);
    } else {
        response.status(message.ERROR_INVALID_CONTENT_TYPE.status);
        response.json(message.ERROR_INVALID_CONTENT_TYPE);
    }

})


//EndPoint: Exclui um status da matricula, filtrando pelo ID
app.delete('/v1/projeto-usinagem/status-matricula/:id', cors(), async function (request, response) {

    let id = request.params.id;

    //Recebe os dados da controller da status da matricula
    let dadosStatusMatricula = await controllerStatusMatricula.ctlDeletarStatusMatriculaPeloID(id);

    response.status(dadosStatusMatricula.status)
    response.json(dadosStatusMatricula)

})

/*****************************************************************************************************************
* Objetivo: API de controle de RESULTADO DESEJADO
* Data: 05/06/2023
* Autor: Muryllo, Luiz e Millena
* Versão: 1.0
******************************************************************************************************************/

//EndPoint: Retorna todos os dados de resultado desejado
app.get('/v1/projeto-usinagem/resultado-desejado', cors(), async function (request, response) {

})

//EndPoint: Retorna o resultado desejado filtrando pelo ID
app.get('/v1/projeto-usinagem/resultado-desejado/:id', cors(), async function (request, response) {

})

//EndPoint: Retorna o resultado desejado filtrando pelo valor do resultado desejado
app.get('/v1/projeto-usinagem/resultado-desejado/valor/:valor', cors(), async function (request, response) {

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/resultado-desejado', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um resultado desejado existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/resultado-desejado/:id', cors(), bodyParserJson, async function (request, response) {

})


//EndPoint: Exclui um resultado desejado, filtrando pelo ID
app.delete('/v1/projeto-usinagem/resultado-desejado/:id', cors(), async function (request, response) {

})

/*****************************************************************************************************************
* Objetivo: API de controle de TURMA MATRICULA
* Data: 05/06/2023
* Autor: Muryllo, Luiz e Millena
* Versão: 1.0
******************************************************************************************************************/


//EndPoint: Retorna todos os dados de turma-matricula
app.get('/v1/projeto-usinagem/turma-matricula', cors(), async function (request, response) {

})

//EndPoint: Retorna o turma-matricula filtrando pelo ID
app.get('/v1/projeto-usinagem/turma-matricula/:id', cors(), async function (request, response) {

})

//EndPoint: Retorna o turma-matricula filtrando pelo valor do turma-matricula
app.get('/v1/projeto-usinagem/turma-matricula/valor/:valor', cors(), async function (request, response) {

})

//EndPoint: Insere um dado novo 
app.post('/v1/projeto-usinagem/turma-matricula', cors(), bodyParserJson, async function (request, response) {

})

//EndPoint: Atualiza um turma-matricula existente, filtrando pelo ID
app.put('/v1/projeto-usinagem/turma-matricula/:id', cors(), bodyParserJson, async function (request, response) {

})


//EndPoint: Exclui um turma-matricula, filtrando pelo ID
app.delete('/v1/projeto-usinagem/turma-matricula/:id', cors(), async function (request, response) {

})

app.listen(8080, () => console.log('Servidor aguardando requisições na porta 8080.'))
