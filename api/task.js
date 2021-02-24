const moment = require('moment');

module.exports = app => {

    const index = (req, res) => {

        const tasks = app.db('tasks') 
            .then(tasks => res.json(tasks)) 
            .catch(err => res.status(500).json(err)); 

    }

    // -- Espera receber uma data na requisição.
    // -- Se não receber, pega a data de hoje, no final do dia
    const getTasks = (req, res) => {

        //console.log(req);

        const date = req.query.date ? req.query.date
            : moment().endOf('day').toDate();

        app.db('tasks') // -- Select * from tasks
            .where({ userId: req.user.id }) // Where id = req.user.id
            .where('estimateAt', '<=', date) // And estimatedAt <= date
            .orderBy('estimateAt') // Order by estimatedAt
            .then(tasks => res.json(tasks)) // Retorna um json com as tasks encontradas
            .catch(err => res.status(500).json(err)); // Caso haja falha na conexão com o banco, gera erro

    }

    /*
        Status 500 - erro do lado do servidor
            - Servidor inoperante
            - Falha na comunicação
        Status 400 - erro do lado do cliente
            - Não mandou nome
            - Email inválido
            - Data inválida
        Status 204 - Deu certo, porém, não existe conteúdo para resposta    
    */

    const save = (req, res) => {

        if (!req.body.desc.trim()) {
            return res.status(400).send('Descrição é um campo obrigatório');
        }

        req.body.userId = req.user.id;

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err));

    }

    const remove = (req, res) => {

        // --  req.params = params da URL

        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    // -- Se a quantidade de linhas deletadas for maior que 0, sucesso!
                    res.status(204).send()
                } else {
                    // -- Senão, gera um erro do lado cliente
                    const msg = `Não foi encontrada task com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            }) 
            .catch(err => res.status(400).json(err)) // Caso haja falha na conexão com o banco, gera erro
    }

    // -- Alterar o estado doneAt da task
    const updateTaskDoneAt = (req, res, doneAt) => {

        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ doneAt })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err));

    }

    const toggleTask = (req, res) => {

        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {

                if (!task) {
                    const msg = `Task com id ${req.params.id} não encontrada.`;
                    return res.status(400).send(msg);
                }

                const doneAt = task.doneAt ? null : new Date();
                updateTaskDoneAt(req, res, doneAt);

            })
            .catch(err => res.status(400).json(err))
    }

    return { index, getTasks, save, remove, toggleTask }
}