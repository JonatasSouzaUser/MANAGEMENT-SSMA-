const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); // Certifique-se de que o modelo do usuário esteja correto

// Função para realizar o login do usuário
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "Usuário não encontrado!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "Senha inválida!" });

    const token = jwt.sign({ id: user._id }, 'seu_segredo', { expiresIn: '1h' });

    res.status(200).json({ 
      message: "Login realizado com sucesso!", 
      token: token, 
      redirect: "/telacentral.html" 
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Função para registrar um novo usuário
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria um novo usuário
    const user = new User({
      username,
      password: hashedPassword,
    });

    // Salva o novo usuário no banco de dados
    await user.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Outras funções (listar usuários, etc.)
const getAllUsers = async (req, res) => {
  // Lógica para listar todos os usuários
};

const getUserById = async (req, res) => {
  // Lógica para buscar usuário por ID
};

const updateUser = async (req, res) => {
  // Lógica para atualizar usuário
};

const deleteUser = async (req, res) => {
  // Lógica para deletar usuário
};

// Exportar todas as funções
module.exports = {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
