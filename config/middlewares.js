const bodyParser = require('body-parser');
// -- Para que qlqr aplicação possa consumir a api
const cors = require('cors');

/*
    Consign: auxilia no carregamento e compartilhamento de arquivos com o app entre os multiplos
    módulos do NODE.
    App será um estado global da aplicação
*/

module.exports = app => {

    // -- Indica que qualquer coisa que exista no corpo da requisição será interpretada
    app.use(bodyParser.json());
    // -- Para que a aplicação permita qualquer origem
    app.use(cors({
        origin: '*'
    }));

};


