// gestor-backend/server.js

require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); // <-- NOVO: Importa o Mongoose

// Importa a rota de Clientes (que está quebrada agora, mas corrigiremos!)
const clientesRoutes = require('./src/routes/clientesRoutes'); 
const funcionariosRoutes = require('./src/routes/funcionarioRoutes');
const equipamentoRoutes = require('./src/routes/equipamentoRoutes');
const osRoutes = require('./src/routes/osRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const orcamentoRoutes = require('./src/routes/orcamentoRoutes');
const itemOrcamentoController = require('./src/controllers/itemOrcamentoController');

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
app.use('/api/os', osRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orcamentos', orcamentoRoutes);
app.use('/api/orcamentos', orcamentoRoutes);

const itemRoutes = express.Router({ mergeParams: true });

itemRoutes.route('/:orcamentoId/itens')
    .get(itemOrcamentoController.listarItens)
    .post(itemOrcamentoController.criarItem);

itemRoutes.route('/:orcamentoId/itens/:itemId')
    .put(itemOrcamentoController.atualizarItem)
    .delete(itemOrcamentoController.deletarItem);
    
app.use('/api/orcamentos', itemRoutes);

// Rota de Teste
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor Express está online! ✅' });
});


// 4. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});
