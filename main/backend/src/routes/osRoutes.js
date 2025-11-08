// gestor-backend/src/routes/osRoutes.js

const express = require('express');
const { criarOS, listarOS, atualizarOS, deletarOS, buscarOS, listarOSsemOrcamento } = require('../controllers/osController');
const { protegerRota, permitirAcesso } = require('../middleware/authMiddleware'); 
const router = express.Router();

const SERVICO_ACCESS = ['Administrador', 'Técnico Sênior', 'Técnico Júnior', 'Suporte'];

// Rotas de listagem estática e criação
router.route('/')
    .post(protegerRota, permitirAcesso(SERVICO_ACCESS), criarOS)
    .get(protegerRota, permitirAcesso(SERVICO_ACCESS), listarOS);

// Rota estática de filtragem (precisa vir antes da dinâmica :id)
router.get('/sem-orcamento', protegerRota, permitirAcesso(SERVICO_ACCESS), listarOSsemOrcamento); 

// Rotas dinâmicas por ID
router.route('/:id')
    .get(protegerRota, permitirAcesso(SERVICO_ACCESS), buscarOS)
    .put(protegerRota, permitirAcesso(SERVICO_ACCESS), atualizarOS)
    .delete(protegerRota, permitirAcesso(SERVICO_ACCESS), deletarOS);

module.exports = router;