// -- Chave de autenticação necessária para assinatura do token
const { authSecret } = require('../.env');

const passport = require('passport');

const passportJwt = require('passport-jwt');
// -- ExtractJwt: extrai de informações de dentro do cabeçalho da requisição
// -- Strategy para fazer validações baseadas em JWT
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {

    const params = {
        // -- O segredo para assinatura do token
        secretOrKey: authSecret,
        // -- Onde está o jwt a partir do req? (query? header?)
        // -- O jwt virá no Authorization do header da req.
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    /*
        O token é formado de 2 partes:
        1. payload: conteúdo;
        2. authSecret: segredo para a assinatura
    */

    const validate = (payload, done) => {

        // -- Consulta o usuário pelo id do payload
        // -- Acessa a tabela 'users'
        app.db('users')
            // -- Onde o id é o id vindo do payload .:. lembrando que o contaúdo do payload é justamente o id
            .where({ id: payload.id })
            .first()

            .then(user => {
                if (user) {
                    // -- Caso encontre um usuário, joga dentro do request as informações do usuário
                    done(null, { id: user.id, email: user.email });
                } else {
                    // -- Usuário não foi autenticado
                    done(null, false);
                }
            })
            .catch(err => done(err, false)); // -- Erro caso o banco não possa ser acessado 

    }

    const strategy = new Strategy(params, validate);

    passport.use(strategy);

    return {
        // -- Atributos para inicialização e autenticação a partir da estratégia criada
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt' /* Estratégia baseada em jwt */, { session: false /* Sem controle de sessão */ }),
    };

}