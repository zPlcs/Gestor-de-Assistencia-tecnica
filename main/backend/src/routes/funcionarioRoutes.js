// gestor-backend/src/routes/funcionarioRoutes.js

const express = require('express');
const { criarFuncionario, listarFuncionarios, atualizarFuncionario, deletarFuncionario } = require('../controllers/funcionarioController');
const router = express.Router();

// Rotas para Criar (POST) e Listar Todos (GET)
router.route('/').post(criarFuncionario).get(listarFuncionarios);

// Rotas para Atualizar (PUT) e Deletar (DELETE)
router.route('/:id').put(atualizarFuncionario).delete(deletarFuncionario);

module.exports = router;