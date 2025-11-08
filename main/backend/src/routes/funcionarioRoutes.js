// gestor-backend/src/routes/funcionarioRoutes.js

const express = require('express');
const { criarFuncionario, listarFuncionarios, atualizarFuncionario, deletarFuncionario, authFuncionario } = require('../controllers/funcionarioController');
const { protegerRota, permitirAcesso } = require('../middleware/authMiddleware'); 
const router = express.Router();

// Permissão para gerenciar funcionários: APENAS ADMINISTRADOR
const ADMIN_ONLY = ['Administrador']; 
const SERVICO_ACCESS = ['Desenvolvedor','Administrador', 'Técnico Sênior', 'Técnico Júnior', 'Suporte'];

// Rota de Login (Pública) e Criação (Inicial - deve ser removida após o seed)
router.post('/login', authFuncionario); 
router.post('/', criarFuncionario); 

// Rotas Protegidas (GET, PUT, DELETE)
router.get('/', protegerRota, permitirAcesso(SERVICO_ACCESS), listarFuncionarios);
router.route('/:id')
    .put(protegerRota, permitirAcesso(ADMIN_ONLY), atualizarFuncionario)
    .delete(protegerRota, permitirAcesso(ADMIN_ONLY), deletarFuncionario);

module.exports = router;