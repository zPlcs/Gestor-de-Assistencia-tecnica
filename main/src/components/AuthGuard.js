import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Puxa o Contexto de Autenticação

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Verifica se o Token está presente na memória
  const location = useLocation();
  
  // 🚨 Checagem Principal: Se não estiver autenticado, redireciona.
  if (!isAuthenticated) {
    // Redireciona para o login, mantendo o caminho original para onde o usuário tentou ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado (Token na memória), renderiza o conteúdo
  return children;
};

export default AuthGuard;