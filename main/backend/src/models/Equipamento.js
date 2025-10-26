// gestor-backend/src/models/Equipamento.js

const mongoose = require('mongoose');

const EquipamentoSchema = mongoose.Schema(
  {
    tipoDeEquipamento: {
      type: String,
      required: [true, 'O nome do equipamento é obrigatório.'],
      trim: true,
    },
    numSerie: {
      type: String,
      required: [true, 'O número de série é obrigatório.'],
      unique: true, // O número de série deve ser único para identificação
      trim: true,
    },
    modelo: {
        type: String,
        required: [true, 'O modelo é obrigatório.'],
        trim: true,
    },
    marca: {
        type: String,
        required: [true, 'A marca é obrigatória.'],
        trim: true,
    },
    status: {
      type: String,
      enum: ['Em Operação', 'Em Manutenção', 'Desativado', 'Aguardando Peça'],
      default: 'Em Operação',
    },
    // Chave estrangeira que referencia o Cliente
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente', // Aponta para o Model Cliente
      required: [true, 'O equipamento deve estar associado a um cliente.'],
    },
  },
  {
    timestamps: true, // Adiciona campos createdAt e updatedAt
  }
);

module.exports = mongoose.model('Equipamento', EquipamentoSchema);