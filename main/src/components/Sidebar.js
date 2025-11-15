// src/components/Sidebar.js (COM LOGOUT INTEGRADO)

import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // <-- NOVO: Importar useNavigate
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate(); // <-- Inicializa o useNavigate
  const { logout } = useAuth();

  const handleLogout = () => {
    // 1. Limpa o token do Contexto e do Axios (Função do Provider)
    logout();

    // 2. Redireciona o usuário para a página de Login (Função do Router)
    navigate('/login', { replace: true });
  };

  // Obtém o cargo para exibir, se necessário
  const userCargo = localStorage.getItem('userCargo') || 'Geral';

  return (
    <div
      className={`bg-secondary text-white p-3 d-flex flex-column sidebar-style ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{ width: '250px', position: 'fixed', height: '100%', zIndex: 1000 }}
    >
      <h4 className="text-center mb-4">Menu</h4>

      {/* 🚨 CONTEÚDO DE NAVEGAÇÃO (Expande para o centro) */}
      <Nav className="flex-column flex-grow-1">

        {/* ÍNDICE */}
        <Nav.Link as={Link} to="/dashboard" className="text-white">
          Dashboard
        </Nav.Link>

        <Nav.Link as={Link} to="/os/novo" className="text-white">
          Criar Ordem de Serviço
        </Nav.Link>

        <Nav.Link as={Link} to="/orcamentos/novo" className="text-white">
          Criar Orçamento
        </Nav.Link>


        <hr className="my-2 bg-secondary" />

        {/* MÓDULO DE SERVIÇOS */}
        <Nav.Link as={Link} to="/os" className="text-white">
          Gerenciar OS
        </Nav.Link>
        {userCargo !== 'Técnico Júnior' ? (
          <Nav.Link as={Link} to="/orcamentos" className="text-white">
            Gerenciar Orçamentos
          </Nav.Link>) : null}


        <hr className="my-2 bg-secondary" />

        {/* MÓDULO CADASTROS */}
        <Nav.Link as={Link} to="/clientes" className="text-white">
          Gerenciar Clientes
        </Nav.Link>
        <Nav.Link as={Link} to="/equipamentos" className="text-white">
          Gerenciar Equipamentos
        </Nav.Link>
        {userCargo !== 'Técnico Júnior' ? (
          <Nav.Link as={Link} to="/funcionarios" className="text-white">
            Gerenciar Funcionários
          </Nav.Link>
        ) : null}

      </Nav>
      <hr className="my-2 bg-secondary" />
      <div className='mb-2'>
        <small className="d-block text-muted mb-2">Acesso: {userCargo}</small>
        <Button
          variant="outline-light"
          className="w-100"
          onClick={handleLogout}
        >
          Logout
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