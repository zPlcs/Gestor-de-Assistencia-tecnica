// src/components/Layout.js

import React, { useState } from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
import Sidebar from './Sidebar'; // Vamos criar este componente em seguida

const Layout = ({ children }) => {
  // Estado para controlar se o menu lateral (Sidebar) está aberto ou fechado
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      
      {/* 1. Sidebar (Menu Lateral) */}
      <Sidebar isOpen={sidebarOpen} />

      {/* 2. Content Wrapper (Área de Conteúdo e Navbar) */}
      <div 
        id="content-wrapper" 
        className={`d-flex flex-column w-100 transition-margin ${sidebarOpen ? 'content-open' : 'content-closed'}`}
        style={{ marginLeft: sidebarOpen ? '250px' : '0' }} // Ajuste dinâmico
      >
        
        {/* 2.1. Top Navbar (Header com Botão Hamburguer) */}
        <Navbar bg="light" variant="light" className="shadow-sm border-bottom">
          <Container fluid>
            <Button variant="outline-secondary" onClick={toggleSidebar} className="me-3">
              <i class="bi bi-list fs-5"></i>
            </Button>
            <Navbar.Brand href="#">Gestor PatLab</Navbar.Brand>
            {/* Aqui você pode adicionar informações de usuário, notificações, etc. */}
          </Container>
        </Navbar>
        
        {/* 2.2. Conteúdo da Página (Dashboard, Clientes, etc.) */}
        <Container fluid className="flex-grow-1 p-4">
          {children}
        </Container>
      </div>

      {/* Adicione um estilo básico para a transição: */}
      <style>{`
        .transition-margin {
          transition: margin-left 0.3s ease;
        }
        .fas.fa-bars { font-size: 1.2rem; }
      `}</style>
    </div>
  );
};

export default Layout;