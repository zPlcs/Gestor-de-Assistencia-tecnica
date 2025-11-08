// gestor-backend/src/routes/clientesRoutes.js

const express = require('express');
const { criarCliente, listarClientes, atualizarCliente, deletarCliente } = require('../controllers/clientesController');
const { protegerRota, permitirAcesso } = require('../middleware/authMiddleware'); 
const router = express.Router();

const SERVICO_ACCESS = ['Desenvolvedor', 'Administrador', 'Técnico Sênior', 'Técnico Júnior', 'Suporte'];

// Rotas Protegidas
router.route('/')
    .post(protegerRota, permitirAcesso(SERVICO_ACCESS), criarCliente)
    .get(protegerRota, permitirAcesso(SERVICO_ACCESS), listarClientes);

router.route('/:id')
    .put(protegerRota, permitirAcesso(SERVICO_ACCESS), atualizarCliente)
    .delete(protegerRota, permitirAcesso(SERVICO_ACCESS), deletarCliente);

module.exports = router;