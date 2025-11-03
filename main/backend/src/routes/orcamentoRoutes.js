// gestor-backend/src/routes/orcamentoRoutes.js

const express = require('express');
const { 
    criarOrcamento, 
    buscarOrcamento, 
    atualizarStatusAprovacao, 
    deletarOrcamento, 
    gerarPDFOrcamento, 
    listarOrcamentos,
    atualizarOrcamento // <-- VERIFIQUE SE ELA ESTÁ NESTA LISTA DE IMPORTAÇÃO
} = require('../controllers/orcamentoController');
const router = express.Router();


// Rotas principais: POST (Criar)
router.route('/').post(criarOrcamento).get(listarOrcamentos);

// Rotas por ID: GET (Buscar), DELETE (Deletar)
router.route('/:id').get(buscarOrcamento).put(atualizarOrcamento).delete(deletarOrcamento);



// Rota específica para a Geração de PDF
router.get('/:id/pdf', gerarPDFOrcamento);

module.exports = router;