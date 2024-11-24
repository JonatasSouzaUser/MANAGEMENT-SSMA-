const mongoose = require('mongoose');

// Estrutura do modelo de Líder
const leaderSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true, 
    maxlength: 50,
    validate: {
      validator: (v) => /^[a-zA-Z\s]+$/.test(v),
      message: props => `${props.value} não é um nome válido!`
    }
  },
  matricula: { 
    type: String, // Alterado para String para permitir validação com regex
    required: true, 
    unique: true, 
    maxlength: 7, 
    validate: {
      validator: (v) => /^[0-9]{5,10}$/.test(v),
      message: props => `${props.value} não é uma matrícula válida!`
    }
  },
  funcao: { type: String, required: true },
  especialidade: { 
    type: String, 
    required: true, 
    enum: ['Andaime', 'Pintura', 'Isolamento', 'Complementar', 'SSMA', 'Qualidade', 'Coordenação', 'Gestão', 'Planejamento', 'Outro'] 
  },
}, { timestamps: true }); // Adiciona createdAt e updatedAt

// Garante que o índice único seja criado
leaderSchema.index({ matricula: 1 }, { unique: true });

module.exports = mongoose.model('Leader', leaderSchema); // Corrigido de LeaderSchema para leaderSchema
