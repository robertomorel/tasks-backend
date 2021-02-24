// -- Para criptografar a senha
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {

    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = (req, res) => {

        //console.log("Entrou aqui!"); 
        console.log(req);    
        console.log(`Name: ${req.body.name}, Email: ${req.body.email}, Senha: ${req.body.password}`);

        obterHash(req.body.password, hash => {
            // -- Para que a senha salva não seja a crua, mas o hash calculado com o bcrypt
            const password = hash;

            //console.log(`Senha: ${password}`);

            app.db('users')
                .insert({ name: req.body.name, email: req.body.email, password })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).json(err))
        })

    }

    const getAllUsers = (req, res) => {

        const users = app.db('users') // -- Select * from users
            .then(users => res.json(users)) // Retorna um json com os users encontradas
            .catch(err => res.status(500).json(err)); // Caso haja falha na conexão com o banco, gera erro

    }

    const remove = (req, res) => {

        app.db('users')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    // -- Se a quantidade de linhas deletadas for maior que 0, sucesso!
                    res.status(204).send()
                } else {
                    // -- Senão, gera um erro do lado cliente
                    const msg = `Não foi encontrado user com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            }) 
            .catch(err => res.status(400).json(err)) // Caso haja falha na conexão com o banco, gera erro
    }

    return { save, getAllUsers, remove }
}