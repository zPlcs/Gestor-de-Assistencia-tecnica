// src/App.js (Versão Final de Roteamento)

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CriarOS from './pages/CriarOS'
import OrdensServico from './pages/OrdensServico';
import Clientes from './pages/Clientes';
import Equipamentos from './pages/Equipamentos';
import Funcionarios from './pages/Funcionario';

// Placeholder para as páginas futurasw

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Rota 1: Login (Sem Layout, Sem Sidebar) */}
        <Route path="/login" element={<Login />} /> 
        
        {/* Rota 2: Rotas Internas (Com Layout e Sidebar) */}
        <Route 
          path="/*" // Rota curinga: Aplica o Layout a todas as rotas que não sejam /login
          element={
            // Futuramente, esta será a área onde você checará se o usuário está logado
            <Layout> 
              <Routes>
                {/* As rotas internas definidas no Sidebar */}
                <Route path="/" element={<Dashboard />} /> 
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/equipamentos" element={<Equipamentos />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/os" element={<OrdensServico />} />
                {/* Rota de criação pode ser a mesma do gerenciar, mas com um parâmetro, por exemplo */}
                <Route path="/os/novo" element={<CriarOS />} /> {/* <-- NOVA ROTA */}
              </Routes>
            </Layout>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;