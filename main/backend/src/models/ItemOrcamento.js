const mongoose = require('mongoose');

const ItemOrcamentoSchema = new mongoose.Schema(
  {
    // 1. REFERÊNCIA CRUCIAL AO ORÇAMENTO PAI (Vínculo N:1)
    orcamento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orcamento', // Referência ao Model de Orçamento
      required: [true, 'O item deve estar vinculado a um Orçamento.']
    },

    // 2. DESCRIÇÃO E TIPO
    descricao: {
      type: String,
      required: [true, 'A descrição do item é obrigatória.'],
      trim: true
    },
    tipoItem: {
      type: String,
      enum: ['Serviço', 'Peça', 'Outros'],
      default: 'Serviço'
    },
    
    // 🚨 CAMPO ADICIONAL DO PROJETO: Link para compra da peça
    linkCompra: {
        type: String,
        trim: true,
    },

    // 3. VALORES E QUANTIDADE
    quantidade: {
      type: Number,
      required: [true, 'A quantidade é obrigatória.'],
      min: [1, 'A quantidade deve ser de pelo menos 1.']
    },
    valorUnitario: {
      type: Number,
      required: [true, 'O valor unitário é obrigatório.'],
      min: [0, 'O valor unitário não pode ser negativo.']
    },

    // 4. SUBTOTAL DO ITEM (Calculado pelo middleware)
    subtotal: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// 🚨 MIDDLEWARE: Calcula o subtotal (quantidade * valorUnitario) antes de salvar
ItemOrcamentoSchema.pre('save', function (next) {
    if (this.isModified('quantidade') || this.isModified('valorUnitario')) {
        this.subtotal = this.quantidade * this.valorUnitario;
    }
    next();
});

module.exports = mongoose.model('ItemOrcamento', ItemOrcamentoSchema);