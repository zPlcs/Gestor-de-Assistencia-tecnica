// gestor-backend/src/middleware/authMiddleware.js (MODO DE DESENVOLVIMENTO: SEM VERIFICAÇÃO)

const asyncHandler = require('express-async-handler');
const Funcionario = require('../models/Funcionario'); 

// 🚨 Middleware 1: Passagem Livre (Apenas para Testes/Debug)
// Esta função faz o 'next()' sem verificar o token.
const protegerRota = asyncHandler(async (req, res, next) => {
    
    // 1. Log de Aviso
    console.log('--- AVISO: ROTA PROTEGIDA IGNORADA (Modo Dev) ---');
    
    // 2. Simulação de Usuário (Obrigatório para o middleware 'permitirAcesso' funcionar)
    // Buscamos o Admin Mestre (se ele existir) e anexamos ao req.usuario
    const usuarioMestre = await Funcionario.findOne({ email: 'desenvolvedor@gestor.com' }).select('-senha');
    
    if (usuarioMestre) {
        req.usuario = usuarioMestre; 
    } else {
        // Se o seeder ainda não rodou, usa um placeholder
        req.usuario = { cargo: 'Administrador', nome: 'DEV_PLACEHOLDER' };
    }
    
    // 3. Permissão para seguir
    next(); 
});

// Middleware 2: Checagem de Nível de Acesso (Ainda funcional, mas usa o usuário simulado acima)
const permitirAcesso = (cargosPermitidos) => {
    return (req, res, next) => {
        // O código de checagem de cargo será executado com o usuário simulado (dev/admin)
        if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
            res.status(403); 
            throw new Error('Acesso negado. Você não possui o nível de permissão necessário.');
        }
        next();
    };
};

module.exports = { protegerRota, permitirAcesso };