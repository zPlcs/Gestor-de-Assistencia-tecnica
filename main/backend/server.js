// gestor-backend/server.js

require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); // <-- NOVO: Importa o Mongoose

// Importa a rota de Clientes (que está quebrada agora, mas corrigiremos!)
const clientesRoutes = require('./src/routes/clientesRoutes'); 
const funcionariosRoutes = require('./src/routes/funcionarioRoutes');
const equipamentoRoutes = require('./src/routes/equipamentoRoutes');

// 1. INICIALIZAÇÃO DO EXPRESS
const app = express();
const PORT = process.env.PORT || 3001;

// 2. Middlewares
app.use(express.json());
app.use(cors());


// =======================================================
// CONEXÃO SIMPLIFICADA E GLOBAL DO MONGOOSE
// =======================================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB (Mongoose)!'))
  .catch(err => console.error('❌ Erro FATAL ao conectar ao MongoDB:', err));


// 3. INTEGRAÇÃO DAS ROTAS (Aqui o Express já está definido)
app.use('/api/clientes', clientesRoutes); 
app.use('/api/funcionarios', funcionariosRoutes);
app.use('/api/equipamentos', equipamentoRoutes);

// Rota de Teste
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor Express está online! ✅' });
});


// 4. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});
