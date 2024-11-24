const mongoose = require('mongoose');
const Leader = require('../models/leader.js');
const isProduction = process.env.NODE_ENV === 'production';

// Função para criar um novo líder
exports.createLeader = async (req, res) => {
  try {
    // Log dos dados recebidos para ajudar a diagnosticar
    console.log('Dados recebidos para criação:', req.body);

    const { nome, matricula, funcao, especialidade } = req.body;

    // Verificando se todos os campos obrigatórios estão presentes
    if (!nome || !matricula || !funcao || !especialidade) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // Validação adicional: verificar se a matrícula é numérica
    if (isNaN(matricula)) {
      return res.status(400).json({ message: 'A matrícula deve ser numérica.' });
    }

    // Verificando se já existe um líder com a mesma matrícula
    const existingLeader = await Leader.findOne({ matricula });
    if (existingLeader) {
      return res.status(400).json({ message: 'Matrícula já cadastrada.' });
    }

    // Verifica se os dados estão sendo recebidos corretamente
    console.log("Dados recebidos no servidor:", req.body);

    // Criando e salvando o novo líder
    const leader = new Leader({ nome, matricula, funcao, especialidade });
    
    await leader.save();
    res.status(201).json({ message: 'Líder cadastrado com sucesso!', leader });
  } catch (error) {
    console.error('Erro ao cadastrar líder:', error);
    res.status(500).json({
      message: 'Erro ao cadastrar líder.',
      error: isProduction ? undefined : error.message,
    });
  }
};

// Função para obter todos os líderes
exports.getAllLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find();

    if (leaders.length === 0) {
      return res.status(404).json({ message: 'Nenhum líder encontrado.' });
    }

    res.status(200).json(leaders);

  } catch (error) {
    console.error('Erro ao obter líderes:', error);
    res.status(500).json({
      message: 'Erro ao obter líderes.',
      error: isProduction ? undefined : error.message,
    });
  }
};

// Função para obter todos os líderes com paginação
exports.getAllLeadersWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Padrão para página 1
    const limit = parseInt(req.query.limit) || 10;  // Padrão para 10 líderes por página
    const skip = (page - 1) * limit;

    const leaders = await Leader.find().skip(skip).limit(limit);
    const totalLeaders = await Leader.countDocuments();

    res.status(200).json({
      data: leaders,
      total: totalLeaders,
      page,
      totalPages: Math.ceil(totalLeaders / limit),
    });
  } catch (error) {
    console.error('Erro ao obter líderes:', error);
    res.status(500).json({
      message: 'Erro ao obter líderes.',
      error: isProduction ? undefined : error.message,
    });
  }
};

// Função para atualizar um líder
exports.updateLeader = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const { nome, matricula, funcao, especialidade } = req.body;

    if (!nome || !matricula || !funcao || !especialidade) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const existingLeader = await Leader.findOne({ matricula, _id: { $ne: id } });
    if (existingLeader) {
      return res.status(400).json({ message: 'Matrícula já cadastrada.' });
    }

    const leader = await Leader.findByIdAndUpdate(id, { nome, matricula, funcao, especialidade }, { new: true });

    if (!leader) {
      return res.status(404).json({ message: 'Líder não encontrado.' });
    }

    res.status(200).json({ message: 'Líder atualizado com sucesso!', leader });

  } catch (error) {
    console.error('Erro ao atualizar líder:', error);
    res.status(500).json({
      message: 'Erro ao atualizar líder.',
      error: isProduction ? undefined : error.message,
    });
  }
};

// Função para deletar um líder
exports.deleteLeader = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const leader = await Leader.findByIdAndDelete(id);

    if (!leader) {
      return res.status(404).json({ message: 'Líder não encontrado.' });
    }

    res.status(200).json({ message: 'Líder excluído com sucesso!' });

  } catch (error) {
    console.error('Erro ao excluir líder:', error);
    res.status(500).json({
      message: 'Erro ao excluir líder.',
      error: isProduction ? undefined : error.message,
    });
  }
};
