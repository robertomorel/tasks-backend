module.exports = app => {

    /*
    console.log(app.api);
    console.log(app.config.passport);
    */

    app.post('/signup', app.api.user.save);
    app.post('/signin', app.api.auth.signin);

    app.get('/users', app.api.user.getAllUsers);
    app.delete('/users/:id', app.api.user.remove);

    app.get('/tasksList', app.api.task.index);

    app.route('/tasks')
        .all(app.config.passport.authenticate()) // -- Autenticar todas as rotas de tasks antes de chamar qlqr uma
        .get(app.api.task.getTasks)
        .post(app.api.task.save);

    app.route('/tasks/:id')
        .all(app.config.passport.authenticate()) // -- Autenticar todas as rotas de tasks/:id antes de chamar qlqr uma
        .delete(app.api.task.remove);

    app.route('/tasks/:id/toggle') // -- Autenticar todas as rotas de tasks/:id/toggle antes de chamar qlqr uma
        .all(app.config.passport.authenticate())
        .put(app.api.task.toggleTask);

}