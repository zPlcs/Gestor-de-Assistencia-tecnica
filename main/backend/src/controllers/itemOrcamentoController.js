// gestor-backend/src/controllers/itemOrcamentoController.js

const ItemOrcamento = require('../models/ItemOrcamento');
// 🚨 Importação do utilitário de recálculo (necessário que o caminho esteja correto)
const { recalcularOrcamentoTotal } = require('../utils/orcamentoUtils');

// @desc    Listar todos os Itens de um Orçamento
// @route   GET /api/orcamentos/:orcamentoId/itens
const listarItens = async (req, res) => {
    const { orcamentoId } = req.params;
    try {
        const itens = await ItemOrcamento.find({ orcamento: orcamentoId }).sort({ createdAt: 1 });
        res.status(200).json(itens);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar itens.', error: error.message });
    }
};

// @desc    Adicionar um novo Item a um Orçamento
// @route   POST /api/orcamentos/:orcamentoId/itens
const criarItem = async (req, res) => {
    const { orcamentoId } = req.params;

    // Adiciona o ID do orçamento ao corpo da requisição
    const itemData = { ...req.body, orcamento: orcamentoId };

    try {
        // 1. Tenta criar o item (o Mongoose middleware calcula o subtotal)
        const novoItem = await ItemOrcamento.create(itemData);

        // 2. CHAMA O RECÁLCULO e espera a atualização do valorTotal no Orcamento
        await recalcularOrcamentoTotal(orcamentoId);

        res.status(201).json(novoItem);
    } catch (error) {
        // 🚨 Melhor tratamento para erros de validação do Mongoose
        res.status(400).json({
            message: `Falha ao criar item. ${error.message.includes('validation failed') ? 'Verifique campos obrigatórios ou valores mínimos.' : 'Erro interno.'}`,
            error: error.message
        });
    }
};

// @desc    Atualizar um Item existente
// @route   PUT /api/orcamentos/:orcamentoId/itens/:itemId
const atualizarItem = async (req, res) => {
    const { itemId, orcamentoId } = req.params;
    try {
        // 1. Atualiza o item (Middleware recalcula o subtotal)
        const itemAtualizado = await ItemOrcamento.findByIdAndUpdate(
            itemId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!itemAtualizado) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        // 2. CHAMA O RECÁLCULO
        await recalcularOrcamentoTotal(orcamentoId);

        res.status(200).json(itemAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar item.', error: error.message });
    }
};

// @desc    Deletar um Item
// @route   DELETE /api/orcamentos/:orcamentoId/itens/:itemId
const deletarItem = async (req, res) => {
    const { itemId, orcamentoId } = req.params;
    try {
        const itemDeletado = await ItemOrcamento.findByIdAndDelete(itemId);

        if (!itemDeletado) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }

        // CHAMA O RECÁLCULO
        await recalcularOrcamentoTotal(orcamentoId);

        res.status(200).json({ message: 'Item deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar item.', error: error.message });
    }
};

module.exports = {
    listarItens,
    criarItem,
    atualizarItem,
    deletarItem,
};