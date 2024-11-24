const express = require('express');
const router = express.Router();
const leaderController = require('../controllers/leaderController');
const { body, param, validationResult } = require('express-validator');

// Middleware de validação para entrada de dados
const validateLeader = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('matricula').isNumeric().withMessage('Matrícula deve ser numérica'),
  body('funcao').notEmpty().withMessage('Função é obrigatória'),
  body('especialidade').notEmpty().withMessage('Especialidade é obrigatória'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Rota para criar um novo líder
router.post('/', async (req, res) => {
  try {
    const newLeader = new Leader(req.body);
    await newLeader.save();
    res.status(201).json(newLeader);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar o líder', error: err });
  }
});

// Rota para obter todos os líderes (com paginação sugerida no controller)
router.get('/', leaderController.getAllLeadersWithPagination);
// Rota para atualizar um líder
router.put('/:id', validateLeader, leaderController.updateLeader);
// Rota para deletar um líder
router.delete('/:id', leaderController.deleteLeader);

module.exports = router;
