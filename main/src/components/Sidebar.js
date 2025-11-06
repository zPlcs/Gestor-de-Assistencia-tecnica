// src/components/Sidebar.js (COM LOGOUT INTEGRADO)

import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // <-- NOVO: Importar useNavigate

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate(); // <-- Inicializa o useNavigate

  const handleLogout = () => {
    // 1. Limpa todas as chaves de autenticação
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCargo');
    
    // 2. Redireciona o usuário para a página de Login
    navigate('/login', { replace: true });
  };
  
  // Obtém o cargo para exibir, se necessário
  const userCargo = localStorage.getItem('userCargo') || 'Geral';

  return (
    <div 
      className={`bg-dark text-white p-3 d-flex flex-column sidebar-style ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{ width: '250px', position: 'fixed', height: '100%', zIndex: 1000 }}
    >
      <h4 className="text-center mb-4 mt-2">Menu</h4>
      
      {/* 🚨 CONTEÚDO DE NAVEGAÇÃO (Expande para o centro) */}
      <Nav className="flex-column flex-grow-1">
        
        {/* ÍNDICE */}
        <Nav.Link as={Link} to="/dashboard" className="text-white">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Nav.Link>
        
        <Nav.Link as={Link} to="/os/novo" className="text-white">
          <i className="bi bi-plus-circle me-2"></i> Criar Ordem de Serviço
        </Nav.Link>
        
        <hr className="my-2 bg-secondary" />

        {/* MÓDULO DE SERVIÇOS */}
        <Nav.Link as={Link} to="/os" className="text-white">
          <i className="bi bi-tools me-2"></i> Gerenciar OS
        </Nav.Link>
        <Nav.Link as={Link} to="/orcamentos" className="text-white">
          <i className="bi bi-currency-dollar me-2"></i> Gerenciar Orçamentos
        </Nav.Link>
        
        <hr className="my-2 bg-secondary" />

        {/* MÓDULO CADASTROS */}
        <Nav.Link as={Link} to="/clientes" className="text-white">
          <i className="bi bi-people-fill me-2"></i> Gerenciar Clientes
        </Nav.Link>
        <Nav.Link as={Link} to="/equipamentos" className="text-white">
          <i className="bi bi-motherboard me-2"></i> Gerenciar Equipamentos
        </Nav.Link>
        <Nav.Link as={Link} to="/funcionarios" className="text-white">
          <i className="bi bi-person-badge-fill me-2"></i> Gerenciar Funcionários
        </Nav.Link>
      </Nav>
      
      {/* 🚨 SEÇÃO DE LOGOUT (Fixado no rodapé do Sidebar) */}
      <div className="mt-auto p-2 border-top border-secondary">
          <small className="d-block text-muted mb-2">Acesso: {userCargo}</small>
          <Button 
              variant="outline-danger" 
              className="w-100" 
              onClick={handleLogout}
          >
              <i className="bi bi-box-arrow-right me-2"></i> **Sair**
          </Button>
      </div>

      <style>{`
        .sidebar-style {
          transition: transform 0.3s ease;
        }
        .sidebar-closed {
          transform: translateX(-250px);
        }
        .sidebar-open {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;