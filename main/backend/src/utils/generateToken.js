// gestor-backend/src/utils/generateToken.js

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // A função jwt.sign cria o token, usando o ID do usuário como payload
  // e o JWT_SECRET do seu arquivo .env para a assinatura
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d', // Expira em 30 dias por padrão
  });
};

module.exports = generateToken;