const express = require('express');
const router = express.Router();
const createModel = require('../models/modelFactory');

// Cria um modelo específico para a tabela 'novohorizonte'
const modelNovoHorizonte = createModel('novohorizonte');

// Middleware para analisar o corpo da requisição como JSON
router.use(express.json()); // Certifique-se de que isso esteja presente em seu servidor principal

// Rota para obter todos os registros
router.get('/', async (req, res) => {
    try {
        const records = await modelNovoHorizonte.getAll();
        res.json(records);
    } catch (err) {
        console.error('Erro ao obter registros:', err); // Adiciona log para depuração
        res.status(500).json({ error: err.message });
    }
});

// Rota para obter um registro pelo ID
router.get('/:id', async (req, res) => {
    try {
        const record = await modelNovoHorizonte.getById(req.params.id);
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: 'Registro não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao obter registro:', err); // Adiciona log para depuração
        res.status(500).json({ error: err.message });
    }
});

// Rota para criar um novo registro
router.post('/', async (req, res) => {
    try {
        const { pesquisa1, pesquisa2, pesquisa3, comentario } = req.body;

        // Validação dos campos recebidos
        if (pesquisa1 === undefined || pesquisa2 === undefined || pesquisa3 === undefined) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        console.log('Dados recebidos:', { pesquisa1, pesquisa2, pesquisa3, comentario }); // Log dos dados recebidos

        const newRecord = await modelNovoHorizonte.create(pesquisa1, pesquisa2, pesquisa3, comentario);
        res.status(201).json(newRecord);
    } catch (err) {
        console.error('Erro ao criar registro:', err); // Adiciona log para depuração
        res.status(500).json({ error: err.message });
    }
});

// Rota para atualizar um registro existente
router.put('/:id', async (req, res) => {
    try {
        const { pesquisa1, pesquisa2, pesquisa3, comentario } = req.body;

        // Validação dos campos recebidos
        if (pesquisa1 === undefined || pesquisa2 === undefined || pesquisa3 === undefined) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        const updatedRecord = await modelNovoHorizonte.update(req.params.id, pesquisa1, pesquisa2, pesquisa3, comentario);
        if (updatedRecord) {
            res.json(updatedRecord);
        } else {
            res.status(404).json({ error: 'Registro não encontrado' });
        }
    } catch (err) {
        console.error('Erro ao atualizar registro:', err); // Adiciona log para depuração
        res.status(500).json({ error: err.message });
    }
});

// Rota para deletar um registro
router.delete('/:id', async (req, res) => {
    try {
        await modelNovoHorizonte.remove(req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error('Erro ao deletar registro:', err); // Adiciona log para depuração
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
