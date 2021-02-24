exports.up = function (knex, Promise) {

    /*
        Bancos não relacionais não são case sensitive, ainda que esteja sendo usado
        aqui. Será apenas por estética.
    */

    // -- Cria os campos da tabela 'users'
    const fields = table => {
        table.increments('id').primary();
        table.string('desc').notNull();
        table.datetime('estimateAt');
        table.datetime('doneAt');
        // -- Campo que faz um relacionamento com a tabela users
        table.integer('userId').references('id')
            .inTable('users').notNull();
    }

    // -- Cria a tabela 'users'
    return knex.schema.createTable('tasks', fields);

};

exports.down = function (knex, Promise) {

    // -- Deleta a tabela 'users'
    return knex.schema.dropTable('tasks');

};
