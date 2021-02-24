/*
    Obs.: este não é o padrão de módulos do ecma script
    -> Padrão de módulos do NODE.js
         - Cada arquivo do NODE.js é um módulo
*/

const config = require('../knexfile.js');
const knex = require('knex')(config);

// -- Processo de migrações 
// -- Cria as tabelas do banco de dados
// -- Pode ser substituído pelo comando: "yarn knex migrate:latest"
knex.migrate.latest([config]);

module.exports = knex;