const express = require('express');
const app = express();

const db = require('../config/db');
const consign = require('consign');

const cors = require('cors');

app.use(cors());

// -- Para auxiliar a carregar todos os módulos do NODE.js
// -- Sempre vai passar app como param para todos os módulos que serão carregados
// -- Podemos passar arquivos específicos no 'then', ou uma pasta

/*
.include('./config/passport')     --> Middleware para autenticação do usuário
.then('./config/middlewares.js')  --> Módulo carregado 
.then('./api')                    --> Pasta de módulos carregada
.then('./config/routes.js')       --> Módulo carregado
.into(app);                       --> Param passado
*/
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

// -- Para podermos mexer no banco a partir do app    
app.db = db;

app.listen(8080,
    () => {
        console.log('Backend executando...');
    }); 