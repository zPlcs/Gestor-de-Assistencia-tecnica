// gestor-backend/src/models/OrdemServico.js

const mongoose = require('mongoose');

const OrdemServicoSchema = mongoose.Schema(
  {
    // Relações Chave (Foreign Keys)
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente', 
      required: [true, 'A OS deve estar associada a um cliente.'],
    },
    equipamento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipamento',
      required: [true, 'A OS deve estar associada a um equipamento.'],
    },
    tecnicoResponsavel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Funcionario', 
      // Por enquanto, obrigatório. Depois pode ser opcional (em triagem)
      required: [true, 'Um técnico responsável é obrigatório.'], 
    },

    // Detalhes do Serviço
    tituloProblema: {
      type: String,
      required: [true, 'O título do problema é obrigatório.'],
      trim: true,
    },
    descricaoProblema: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // Status do fluxo de trabalho
      enum: ['Aberto', 'Em Análise', 'Em Reparo', 'Aguardando Peça', 'Aguardando Aprovação', 'Finalizado', 'Cancelado'],
      default: 'Aberto',
    },
    prioridade: {
        type: String,
        enum: ['Baixa', 'Média', 'Alta', 'Crítica'],
        default: 'Média',
    },
    // Dados de Resultado e Faturamento
    solucao: {
        type: String,
    },
    custoEstimado: {
        type: Number,
        default: 0,
    },
    dataConclusao: {
        type: Date,
    }
  },
  {
    timestamps: true, // createdAt (Data de Abertura) e updatedAt
  }
);

module.exports = mongoose.model('OrdemServico', OrdemServicoSchema);