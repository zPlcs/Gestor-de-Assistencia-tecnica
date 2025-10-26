// gestor-backend/src/controllers/equipamentoController.js

const Equipamento = require('../models/Equipamento');

// @desc    Criar novo Equipamento
// @route   POST /api/equipamentos
const criarEquipamento = async (req, res) => {
    try {
        const novoEquipamento = await Equipamento.create(req.body);
        res.status(201).json(novoEquipamento);
    } catch (error) {
        // 🚨 NOVO: Loga o erro completo no console do Node.js
        console.error('Erro de Validação Mongoose:', error.message);

        res.status(400).json({
            message: 'Erro ao criar equipamento. Verifique os dados e se o número de série é único.',
            // 🚨 NOVO: Retorne uma parte do erro para o frontend se for erro de validação
            error: error.message
        });
    }
};

// @desc    Listar todos os Equipamentos (com dados do Cliente)
// @route   GET /api/equipamentos
const listarEquipamentos = async (req, res) => {
    try {
        // CORREÇÃO: Altere os campos no .populate() para corresponderem ao Model Cliente
        const equipamentos = await Equipamento.find({})
            // Se o seu Model Cliente só tem 'nome' e '_id', use:
            .populate('clienteId', 'nome'); // <-- Popula APENAS o campo 'nome'

        res.status(200).json(equipamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar equipamentos.', error: error.message });
    }
};

// @desc    Atualizar Equipamento
// @route   PUT /api/equipamentos/:id
const atualizarEquipamento = async (req, res) => {
    try {
        const equipamentoAtualizado = await Equipamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('clienteId', 'nome'); // <-- CORRIGIDO AQUI TAMBÉM

        if (!equipamentoAtualizado) {
            return res.status(404).json({ message: 'Equipamento não encontrado.' });
        }

        res.status(200).json(equipamentoAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido ou erro de atualização.', error: error.message });
    }
};

// @desc    Deletar Equipamento
// @route   DELETE /api/equipamentos/:id
const deletarEquipamento = async (req, res) => {
    try {
        const equipamentoDeletado = await Equipamento.findByIdAndDelete(req.params.id);

        if (!equipamentoDeletado) {
            return res.status(404).json({ message: 'Equipamento não encontrado.' });
        }

        res.status(200).json({ message: 'Equipamento deletado com sucesso!', _id: equipamentoDeletado._id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar equipamento.', error: error.message });
    }
};

module.exports = {
    criarEquipamento,
    listarEquipamentos,
    atualizarEquipamento,
    deletarEquipamento,
};