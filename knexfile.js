/*
  Arquivos de conexão com o banco de dados
*/

module.exports = {

  client: 'postgresql',
  connection: {
    host : '127.0.0.1',
    database: 'tasks',
    user: 'postgres',
    password: 'pgsql'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }

}
