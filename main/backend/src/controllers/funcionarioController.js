// gestor-backend/src/controllers/funcionarioController.js

const Funcionario = require('../models/Funcionario');

// @desc    Criar novo Funcionário
// @route   POST /api/funcionarios
const criarFuncionario = async (req, res) => {
    try {
        // A senha será criptografada automaticamente pelo middleware do Model
        const novoFuncionario = await Funcionario.create(req.body);
        
        // Retorna o objeto sem a senha para o Frontend
        res.status(201).json({
            _id: novoFuncionario._id,
            nome: novoFuncionario.nome,
            email: novoFuncionario.email,
            cargo: novoFuncionario.cargo,
            status: novoFuncionario.status,
        });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar funcionário.', error: error.message });
    }
};

// @desc    Listar todos os Funcionários (excluindo a senha)
// @route   GET /api/funcionarios
const listarFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.find({}).select('-senha -__v'); // Exclui senha e versão
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar funcionários.', error: error.message });
    }
};

// @desc    Atualizar Funcionário
// @route   PUT /api/funcionarios/:id
const atualizarFuncionario = async (req, res) => {
    try {
        // Não permite atualizar a senha por esta rota PUT simples.
        if (req.body.senha) {
            return res.status(400).json({ message: 'Use uma rota específica para atualizar a senha.' });
        }
        
        const funcionarioAtualizado = await Funcionario.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        ).select('-senha -__v'); // Retorna sem a senha

        if (!funcionarioAtualizado) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }

        res.status(200).json(funcionarioAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido ou erro de atualização.', error: error.message });
    }
};

// @desc    Deletar Funcionário
// @route   DELETE /api/funcionarios/:id
const deletarFuncionario = async (req, res) => {
    try {
        const funcionarioDeletado = await Funcionario.findByIdAndDelete(req.params.id);

        if (!funcionarioDeletado) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
        }

        res.status(200).json({ message: 'Funcionário deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar funcionário.', error: error.message });
    }
};

module.exports = {
    criarFuncionario,
    listarFuncionarios,
    atualizarFuncionario,
    deletarFuncionario,
};