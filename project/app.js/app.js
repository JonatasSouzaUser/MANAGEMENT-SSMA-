const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Corrigido: Importação do módulo 'path'

const app = express();
const PORT = 3000;

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/projectDB')
  .then(() => console.log("MongoDB conectado"))
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err.message);
    process.exit(1); // Finaliza o processo se a conexão falhar
  });

// Configurando o body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurando as rotas
console.log("Iniciando app.js");

const userRoutes = require('../routes/userRoutes'); // Corrigido para caminho relativo correto
app.use('/users', userRoutes);

const leaderRoutes = require('../routes/leaderRoutes'); // Corrigido para caminho relativo correto
app.use('/leaders', leaderRoutes);


// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); // Certificado que o 'path' está importado

// Configuração do servidor
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Erro ao iniciar o servidor: ${err.message}`);
  } else {
    console.log(`Servidor rodando na porta ${PORT}`);
  }
});
