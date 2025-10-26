// gestor-backend/src/models/Funcionario.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const FuncionarioSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome do funcionário é obrigatório.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório para login.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória.'],
      minlength: 6,
    },
    cargo: {
      type: String,
      enum: ['Administrador', 'Técnico Sênior', 'Técnico Júnior', 'Suporte'],
      default: 'Técnico Júnior',
    },
    status: {
        type: String,
        enum: ['Ativo', 'Inativo'],
        default: 'Ativo',
    },
    // Aqui você pode adicionar um array de referências para tarefas/OS futuras
    osAtribuidas: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrdemServico',
    }],
  },
  {
    timestamps: true,
  }
);

// Middleware do Mongoose: Criptografa a senha antes de salvar
FuncionarioSchema.pre('save', async function (next) {
  // Apenas roda se a senha foi modificada (ou é um novo funcionário)
  if (!this.isModified('senha')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método de comparação de senha (usado no login)
FuncionarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.senha);
};

module.exports = mongoose.model('Funcionario', FuncionarioSchema);