// gestor-backend/src/routes/equipamentoRoutes.js

const express = require('express');
const { criarEquipamento, listarEquipamentos, atualizarEquipamento, deletarEquipamento } = require('../controllers/equipamentoController');
const router = express.Router();

// Rotas para Criar (POST) e Listar Todos (GET)
router.route('/').post(criarEquipamento).get(listarEquipamentos);

// Rotas para Atualizar (PUT) e Deletar (DELETE)
router.route('/:id').put(atualizarEquipamento).delete(deletarEquipamento);

module.exports = router;