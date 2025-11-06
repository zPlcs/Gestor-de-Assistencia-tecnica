// gestor-backend/src/routes/equipamentoRoutes.js

const express = require('express');
const { criarEquipamento, listarEquipamentos, atualizarEquipamento, deletarEquipamento } = require('../controllers/equipamentoController');
const { protegerRota, permitirAcesso } = require('../middleware/authMiddleware'); 
const router = express.Router();

const SERVICO_ACCESS = ['Administrador', 'Técnico Sênior', 'Técnico Júnior', 'Suporte'];

// Rotas Protegidas
router.route('/')
    .post(protegerRota, permitirAcesso(SERVICO_ACCESS), criarEquipamento)
    .get(protegerRota, permitirAcesso(SERVICO_ACCESS), listarEquipamentos);

router.route('/:id')
    .put(protegerRota, permitirAcesso(SERVICO_ACCESS), atualizarEquipamento)
    .delete(protegerRota, permitirAcesso(SERVICO_ACCESS), deletarEquipamento);

module.exports = router;