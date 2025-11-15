// gestor-backend/src/routes/orcamentoRoutes.js

const express = require('express');
const { 
    criarOrcamento, 
    buscarOrcamento, 
    atualizarOrcamento, 
    deletarOrcamento, 
    gerarPDFOrcamento, 
    listarOrcamentos 
} = require('../controllers/orcamentoController');
const { protegerRota, permitirAcesso } = require('../middleware/authMiddleware'); // Middleware
const router = express.Router();

// Permissão para CRUD de serviço: TODOS (Administrador, Técnico, Suporte)
const SERVICO_ACCESS = ['Desenvolvedor', 'Administrador', 'Técnico Sênior'];

// Rota de Listagem e Criação
router.route('/')
    .post(protegerRota, permitirAcesso(SERVICO_ACCESS), criarOrcamento)
    .get(protegerRota, permitirAcesso(SERVICO_ACCESS), listarOrcamentos);

// Rota por ID (GET, PUT, DELETE)
router.route('/:id')
    .get(protegerRota, permitirAcesso(SERVICO_ACCESS), buscarOrcamento)
    .put(protegerRota, permitirAcesso(SERVICO_ACCESS), atualizarOrcamento)
    .delete(protegerRota, permitirAcesso(SERVICO_ACCESS), deletarOrcamento);

// Rota específica para Geração de PDF
router.get('/:id/pdf', gerarPDFOrcamento);

module.exports = router;