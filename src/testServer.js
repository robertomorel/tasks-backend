// -- Importar o express com a dependencia externa "express"
const express = require('express');
const hello = require('../Util/middlewareEx');
const bodyParser = require('body-parser');
const usuarioApi = require('../api/usuTeste');
const produtoApi = require('../api/prodTeste');

const app = express();

// -- Exemplo de comunicação entre módulos
app.post('/usuario', usuarioApi.salvar);
app.get('/usuario', usuarioApi.obter);
produtoApi(app, "com param");
//require('../api/prodTeste')(app, "com param");

// -- Params:
//    1º Rota do usuário: "/" (localhost) ou "/teste" (localhost/teste)
//    2º Função de forma reduzida, que recebe dois parâmetros
//        req: parâmetro que o usuário está enviando para a requisição
//        res: parâmetro que devolver uma resposta para a requisição

// -- Métodos: GET    | Buscar uma informação do backend
//                  -> params está na URL
//             POST   | Criar uma nova informação do backend
//                  -> Não consegue executar no navegador, pq sempre executa o método get
//                  -> params está no corpo da requisição
//             PUT    | Editar alguma informação do backend
//             DELETE | Deletar uma informação do backend

/*
app.get("/HelloWorld", (req, res) => {
    res.status(200).send("HelloWorld");
})
*/

/*
app.get("/HelloWorld", (req, res) => {
    return res.send("Hello World!!");
    //return res.json({message: "Hello World!"});
})
*/

/*
app.use((req, res, next) => {
    res.send('Hello World!');
});
*/

/*
app.use('/pag2', (req, res, next) => {
    res.send('Hello World! <b>Pag2</b>!');
});
*/

/*
app.get('/pag2', (req, res, next) => {
    //res.send('<h1>Hello World!</h1> <br><br> <h2><b>Pagina 2!</b></h2>');
    return res.json({
        message: "Hello World!",
        text: "Este é um json",
        version: "1.0",
        date: "17/12/2019"
    });
});
*/

/*
app.get('/pag2', (req, res, next) => {
    return res.json([{
        message: "Hello World!",
        text: "Este é um json",
        version: "1.0",
        date: "17/12/2019"
    }, {
        message: "Hello World2!",
        text: "Este é um json2",
        version: "2.0",
        date: "17/12/2019"
    }, {
        message: "Hello World3!",
        text: "Este é um json3",
        version: "3.0",
        date: "17/12/2019"
    }]);
});
*/

/*
    O express trabalha com um padrão chamado de cadeia de responsabildiades.
    Nisto existe um objeto que é a cadeia. Esta cadeia chama a próxima função em 
    tempo de execução que possuir a mesma url. Para isso, usualmente temos o param 'next'
*/

// -- Estas linhas indicam que qualquer coisa que exista no corpo da requisição será interpretado...
// -----
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// -----


app.use(hello('Roberto'));

/*
    Se eu não especificar a url ( "/pag" ), quero dizer que todas as requisições,
    independente de rota, irão chamar este get.
*/
app.use((req, res, next) => {
    //app.use('/pag', (req, res, next) => {

    console.log('Será que serei chamado antes?');
    // -- Middleware: Pula para o próximo get com a mesm url
    return next();

});

// -- Lendo dados da requisição
// -- /clientes/relatorio?completo=true&ano=2019
app.get('/clientes/relatorio', (req, res, next) => {

    res.send(`Clientes relatório: completo = ${req.query.completo ? 'Sim' : 'Não'}; ano = ${req.query.ano}`)
    return next();

});

// -- Enviando dados da requisição
// -- /corpo -> preencher alguma coisa no body
/*
Body - JSON
[
	{
		"id": 1,
		"nome": "Maria"
	},
	{
		"id": 2,
		"nome": "Pedro"
	}
]
*/
app.post('/corpo', (req, res, next) => {

    /*
    // -- Sem usar o body-parse
    let corpo = '';

    // -- Quando tiver chegando dados a partir do corpo da requisição
    // -- 'parte' são os dados que estão chegando
    req.on('data', function(parte){
        corpo += parte;
    })

    // -- Quando terminar a requisição, manda de volta o que recebeu
    req.on('end', () => {
        return res.json(JSON.parse(corpo));    
        //return res.send(corpo);
    });
    */
    // -- Usando o body-parse
    res.send(req.body);

});

// -- Lendo dados da requisição pela URL
// -- http://localhost/clientes/Morel
// -- http://localhost/clientes/2
// -- http://localhost/clientes/Teste
app.get('/clientes/:id', (req, res) => {

    return res.send(`Cliente ${req.params.id} selecionado!`)

});

app.get('/pag', (req, res, next) => {
    res.json({
        data: [
            { id: 1, name: 'Mariana', position: 0 },
            { id: 2, name: 'Mario', position: 1 },
            { id: 3, name: 'Pedro', position: 2 }
        ],
        count: 30,
        skip: 0,
        limit: 3,
        status: 200
    });
    // -- Middleware: Pula para o próximo get com a mesm url
    return next();
});

app.use('/pag', (req, res) => {

    console.log('Será que serei chamado depois?');

});

app.listen(3000,
    () => {
        console.log('Backend executando...');
    }); 