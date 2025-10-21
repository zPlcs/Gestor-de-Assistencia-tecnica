// gestor-backend/src/routes/clientesRoutes.js

const express = require('express');
const { 
    criarCliente, 
    listarClientes, 
    atualizarCliente, 
    deletarCliente 
} = require('../controllers/clientesController');
const router = express.Router();

// Rotas para Criar (POST) e Listar Todos (GET)
router.route('/').post(criarCliente).get(listarClientes);

// Rotas para Atualizar (PUT) e Deletar (DELETE)
router.route('/:id').put(atualizarCliente).delete(deletarCliente);

module.exports = router;