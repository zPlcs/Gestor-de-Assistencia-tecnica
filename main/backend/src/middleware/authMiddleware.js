// gestor-backend/src/middleware/authMiddleware.js (VERSÃO FINAL DE SEGURANÇA)

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Funcionario = require('../models/Funcionario'); 

// Middleware 1: Garante que o Token é VÁLIDO e busca o cargo REAL do DB
const protegerRota = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 🚨 ESSENCIAL: Busca o usuário real pelo ID do Token
            req.usuario = await Funcionario.findById(decoded.id).select('-senha');

            if (!req.usuario) {
                res.status(401);
                throw new Error('Usuário não encontrado.');
            }

            next();
        } catch (error) {
            console.error('Erro de Autenticação do Token:', error);
            res.status(401); 
            throw new Error('Não autorizado, token inválido ou expirado.');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Não autorizado, token não fornecido.');
    }
});

// Middleware 2: Checagem de Nível de Acesso (Permanece o mesmo para checar o req.usuario.cargo real)
const permitirAcesso = (cargosPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
            res.status(403); 
            throw new Error('Acesso negado. Você não possui o nível de permissão necessário.');
        }
        next();
    };
};

module.exports = { protegerRota, permitirAcesso };