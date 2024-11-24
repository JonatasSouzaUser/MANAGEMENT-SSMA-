const mongoose = require('mongoose'); // Importa o mongoose (biblioteca para modelar dados do MongoDB).

// Define o esquema de usuário (estrutura dos dados de usuário no banco de dados).
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Campo 'username' é uma string, obrigatório e deve ser único.
  password: { type: String, required: true } // Campo 'password' é uma string e obrigatório.
});

// Exporta o modelo 'User' baseado no esquema 'UserSchema' para ser usado em outras partes da aplicação.
module.exports = mongoose.model('User', UserSchema);

