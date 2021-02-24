// -- Chave de autenticação necessária para assinatura do token
const { authSecret } = require('../.env');
// -- 
const jwt = require('jwt-simple')
// -- Para criptografia de senha
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const signin = async (req, res) => {

        console.log(`Dado: ${req.body.password}`);

        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos');
        }

        /* 
          O "await" faz com que só passe para a próxima linha de execução quando
          esta função terminar de rodar
        */
        /*
        const user = await app.db('users')
            .where({ email: req.body.email })
             .first()
         */
        // -- Busca o usuário pelo email
        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first() // -- Pega o primeiro usuário com este email (só para reforçar, pq só deve vir um)
        // -- whereRaw -> where cru. Quando queremos usar SQL puro em umaa sprint. 

        if (user) {

            // -- Compara o email passado com aquele encontrado
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {

                // -- Se deu erro, ou não deu 'match'...
                if (err || !isMatch) {
                    return res.status(401).send("A senha informada é inválida!");
                }

                // -- payload é um valor que será armazenado dentro do token
                // -- O token possui dentro dele o payload. É auto assinado, gerado a partir do segredo do authSecred
                const payload = { id: user.id };
                // -- Gerar um token encodificado com o jwt com o payload e assinado com o authSecret
                // -- Este token será gerado no login e será informado no header de qlqr nova requisição
                /*
                    Authorization = valor_do_token
                */
                const token = jwt.encode(payload, authSecret);

                res.json({
                    name: user.name,
                    email: user.email,
                    token
                });

            })

        } else {
            return res.status(400).send('Usuário não cadastrado!');
        }
    }

    return { signin }
}