const mongoose = require('mongoose');

const OrcamentoSchema = new mongoose.Schema(
  {
    // 1. REFERÊNCIA CRUCIAL À ORDEM DE SERVIÇO (Vínculo 1:1)
    // O 'unique: true' garante que uma OS só pode ter UM orçamento.
    ordemServico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrdemServico',
      required: [true, 'O orçamento deve estar vinculado a uma Ordem de Serviço.'],
      unique: true // Impede orçamentos duplicados para a mesma OS
    },

    // 2. TIPO DE ORÇAMENTO (Para categorizar o serviço)
    tipoOrcamento: {
      type: String,
      enum: ['Reparo', 'Montagem', 'Revisão/Manutenção'],
      required: [true, 'O tipo de orçamento é obrigatório.']
    },

    // 3. TAXA DE SERVIÇO (Mão de Obra)
    taxaServico: {
        type: Number,
        default: 0,
        min: 0
    },

    // 4. VALOR TOTAL (Será calculado e atualizado pelo Controller de Itens)
    valorTotal: {
      type: Number,
      default: 0,
      min: 0
    },

    // 5. STATUS DE APROVAÇÃO
    statusAprovacao: {
      type: String,
      enum: ['Pendente', 'Aprovado', 'Rejeitado'],
      default: 'Pendente'
    },

    // 6. OBSERVAÇÕES
    observacoes: {
      type: String,
      trim: true
    },
    
    // dataCriacao: O campo 'createdAt' (gerado pelo timestamps) será usado para isto.
  },
  {
    timestamps: true, // Adiciona createdAt (data de criação) e updatedAt
  }
);

module.exports = mongoose.model('Orcamento', OrcamentoSchema);