// gestor-backend/src/models/Cliente.js

const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do cliente é obrigatório.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório.'],
      unique: true, // Garante que não haja dois clientes com o mesmo email
      trim: true,
    },
    telefone: {
      type: String,
      trim: true,
    },
    endereco: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
  }
);

module.exports = mongoose.model('Cliente', ClienteSchema);