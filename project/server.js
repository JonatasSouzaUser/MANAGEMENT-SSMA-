const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/projectDB')
  .then(() => console.log("MongoDB conectado"))
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err.message);
    process.exit(1); // Finaliza o processo se a conexão falhar
  });

// Configuração do middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Roteamento de páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get('/ddsma', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ddsma.html'));
});

app.get('/auditoria-pt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auditoria-pt.html'));
});

app.get('/inspecao-sms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inspecao-sms.html'));
});

app.get('/var', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'var.html'));
});

app.get('/cadastro-lideres', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro-lideres.html'));
});

// Importa as rotas de usuário
const userRoutes = require('../project/routes/userRoutes');
app.use('/users', userRoutes);

// Importa as rotas de líderes
const leaderRoutes = require('../project/routes/leaderRoutes');
app.use('/leaders', leaderRoutes); // Certifique-se de que o nome é consistente.

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
