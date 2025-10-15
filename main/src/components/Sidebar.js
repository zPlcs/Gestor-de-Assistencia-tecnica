// src/components/Sidebar.js

import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <div 
      className={`bg-dark text-white p-3 d-flex flex-column sidebar-style ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{ width: '250px', position: 'fixed', height: '100%', zIndex: 1000 }}
    >
      <h4 className="text-center mb-4 mt-2">Menu</h4>
      
      <Nav className="flex-column">
        
        {/* ÍNDICE: Visão Geral */}
        <Nav.Link as={Link} to="/" className="text-white">
          <i className="fas fa-fw fa-tachometer-alt me-2"></i> Dashboard
        </Nav.Link>
        
        <Nav.Link as={Link} to="/os/novo" className="text-white">
          <i className="fas fa-fw fa-plus-circle me-2"></i> Criar Ordem de Serviço
        </Nav.Link>
        
        <hr className="my-2 bg-secondary" />

        {/* MÓDULO DE SERVIÇOS */}
        <Nav.Link as={Link} to="/os" className="text-white">
          <i className="fas fa-fw fa-tools me-2"></i> Gerenciar OS
        </Nav.Link>
        <Nav.Link as={Link} to="/equipamentos" className="text-white">
          <i className="fas fa-fw fa-microchip me-2"></i> Gerenciar Equipamentos
        </Nav.Link>

        {/* MÓDULO CADASTROS */}
        <Nav.Link as={Link} to="/clientes" className="text-white">
          <i className="fas fa-fw fa-users me-2"></i> Gerenciar Clientes
        </Nav.Link>
        <Nav.Link as={Link} to="/funcionarios" className="text-white">
          <i className="fas fa-fw fa-user-tie me-2"></i> Gerenciar Funcionários
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