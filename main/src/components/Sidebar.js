// src/components/Sidebar.js

import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`bg-secondary text-white p-3 d-flex flex-column sidebar-style ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{ width: '250px', position: 'fixed', height: '100%', zIndex: 1000 }}
    >
      <h5 className="text-center">Menu</h5>

      <Nav className="flex-column">

        {/* ÍNDICE: Visão Geral */}
        <Nav.Link as={Link} to="/" className="text-white">
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
        <Nav.Link as={Link} to="/orcamentos" className="text-white">
          Gerenciar Orçamentos
        </Nav.Link>

        <Nav.Link as={Link} to="/equipamentos" className="text-white">
          Gerenciar Equipamentos
        </Nav.Link>

        {/* MÓDULO CADASTROS */}
        <Nav.Link as={Link} to="/clientes" className="text-white">
          Gerenciar Clientes
        </Nav.Link>
        <Nav.Link as={Link} to="/funcionarios" className="text-white">
          Gerenciar Funcionários
        </Nav.Link>
      </Nav>

      {/* Adicione estilos para a Sidebar */}
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