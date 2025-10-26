// gestor-backend/src/routes/osRoutes.js

const express = require('express');
const { criarOS, listarOS, atualizarOS, deletarOS, buscarOS } = require('../controllers/osController');
const router = express.Router();

// Rotas para Criar (POST) e Listar Todos (GET)
router.route('/').post(criarOS).get(listarOS);

// Rotas para Atualizar (PUT) e Deletar (DELETE)
router.route('/:id').get(buscarOS).put(atualizarOS).delete(deletarOS);

module.exports = router;