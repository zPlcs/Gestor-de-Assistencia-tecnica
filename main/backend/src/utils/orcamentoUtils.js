// gestor-backend/src/utils/orcamentoUtils.js (VERSÃO FINAL E CORRIGIDA)

const ItemOrcamento = require('../models/ItemOrcamento');
const Orcamento = require('../models/Orcamento');
const mongoose = require('mongoose'); // 🚨 CORREÇÃO: Mongoose importado aqui!

// Função para recalcular o valor total de um orçamento, incluindo a taxa de serviço
const recalcularOrcamentoTotal = async (orcamentoId) => {
    try {
        // 1. Soma todos os subtotais dos itens associados a este orçamento
        const resultadoSomaItens = await ItemOrcamento.aggregate([
            // 🚨 CORREÇÃO: Usar new mongoose.Types.ObjectId() para garantir que a agregação funcione
            { $match: { orcamento: new mongoose.Types.ObjectId(orcamentoId) } }, 
            { $group: { _id: null, totalItens: { $sum: '$subtotal' } } }
        ]);

        const somaItens = resultadoSomaItens.length > 0 ? resultadoSomaItens[0].totalItens : 0;

        // 2. Busca o Orçamento para obter a taxa de serviço atual
        const orcamentoAtual = await Orcamento.findById(orcamentoId).select('taxaServico');

        if (!orcamentoAtual) {
             console.error(`Orçamento ${orcamentoId} não encontrado durante o recálculo.`);
             return 0;
        }

        const taxaServico = orcamentoAtual.taxaServico || 0;

        // 3. Calcula o Novo Total: Soma dos Itens + Taxa de Serviço
        const novoTotal = somaItens + taxaServico;

        // 4. Atualiza o valorTotal no Model Orcamento
        await Orcamento.findByIdAndUpdate(
            orcamentoId,
            { valorTotal: novoTotal },
            { new: true }
        );

        return novoTotal;
        
    } catch (error) {
        console.error(`Erro ao recalcular total do Orçamento ${orcamentoId}:`, error);
        // Não lançamos erro aqui, apenas logamos, para não quebrar o fluxo principal
        return -1; 
    }
};

module.exports = { recalcularOrcamentoTotal };