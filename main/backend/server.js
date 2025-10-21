// gestor-backend/server.js

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config(); 

const express = require('express');
const cors = require('cors'); // Importa o CORS

// Inicialização
const app = express();
const PORT = process.env.PORT || 3001; // Usa a porta do .env ou 3001

// -------------------------------------------------------------------
// Middlewares Essenciais
// -------------------------------------------------------------------

// 1. CORS: Permite requisições do Frontend (porta 3000)
app.use(cors()); 

// 2. Body Parser: Permite que o Express leia JSON no corpo das requisições
app.use(express.json());

// -------------------------------------------------------------------
// Rota de Teste (Sanidade)
// -------------------------------------------------------------------

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Servidor Express está online! ✅',
        environment: process.env.NODE_ENV || 'development'
    });
});

// -------------------------------------------------------------------
// Inicialização do Servidor
// -------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});