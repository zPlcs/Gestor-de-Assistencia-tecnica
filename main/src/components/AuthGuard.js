import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const location = useLocation();
  
  // 🚨 Checagem Principal: O Token JWT existe?
  const isAuthenticated = localStorage.getItem('userToken');

  if (!isAuthenticated) {
    // Redireciona para o login, armazenando o caminho para onde o usuário tentou ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo (o Layout/Dashboard)
  return children;
};

export default AuthGuard;