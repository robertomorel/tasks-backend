exports.up = function (knex, Promise) {

    // -- Cria os campos da tabela 'users'
    const fields = table => {
        table.increments('id').primary();
        table.string('name').notNull();
        table.string('email').notNull().unique();
        table.string('password').notNull();
    }

    // -- Cria a tabela 'users'
    return knex.schema.createTable('users', fields);

};

exports.down = function (knex, Promise) {

    // -- Deleta a tabela 'users'
    return knex.schema.dropTable('users');

};