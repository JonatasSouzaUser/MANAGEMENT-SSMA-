const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');

// Rota para criar um novo usuário
router.post('/register', UserController.register);

// Rota para login
router.post('/login', UserController.login);

// Rota para listar todos os usuários
router.get('/', UserController.getAllUsers);

// Rota para buscar um usuário por ID
router.get('/:id', UserController.getUserById);

// Rota para atualizar um usuário
router.put('/:id', UserController.updateUser);

// Rota para deletar um usuário
router.delete('/:id', UserController.deleteUser);

module.exports = router;
