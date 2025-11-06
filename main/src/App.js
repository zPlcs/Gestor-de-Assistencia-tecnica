// src/App.js (VERSÃO CORRIGIDA PARA FLUXO DE SEGURANÇA)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard'; 
import Login from './pages/Login'; 

import Dashboard from './pages/Dashboard';
import FormularioOS from './pages/FormularioOS'
import OrdensServico from './pages/OrdensServico';
import Clientes from './pages/Clientes';
import Equipamentos from './pages/Equipamentos';
import Funcionarios from './pages/Funcionario';
import GerenciarOrcamentos from './pages/GerenciarOrcamentos';
import FormularioOrcamento from './pages/FormularioOrcamento';
import SeletorOS from './pages/SeletorOS';


function App() {
    return (
        <Router>
            <Routes>
                
                {/* Rota 1: Login (Pública) */}
                <Route path="/login" element={<Login />} />

                {/* 🚨 ROTA RAÍZ: Redireciona a entrada para o Dashboard APÓS o login */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Rota 2: Rotas Internas (PROTEGIDAS) */}
                {/* O PATH CURINGA (/*) é a forma correta de pegar todas as rotas não mapeadas */}
                <Route 
                    path="/*" 
                    element={
                        <AuthGuard> 
                            <Layout>
                                <Routes>
                                    {/* 🚨 CORREÇÃO: O Dashboard agora é /dashboard. Mantenha as rotas /os, /clientes etc. */}
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    
                                    {/* Rotas de Cadastro */}
                                    <Route path="/clientes" element={<Clientes />} />
                                    <Route path="/equipamentos" element={<Equipamentos />} />
                                    <Route path="/funcionarios" element={<Funcionarios />} />
                                    
                                    {/* Rotas de OS */}
                                    <Route path="/os" element={<OrdensServico />} />
                                    <Route path="/os/novo" element={<FormularioOS />} /> 
                                    <Route path="/os/:id" element={<FormularioOS />} /> 

                                    {/* Rotas de Orçamento */}
                                    <Route path="/orcamentos" element={<GerenciarOrcamentos />} />
                                    <Route path="/orcamentos/novo" element={<SeletorOS />} />
                                    <Route path="/os/:osId/orcamento" element={<FormularioOrcamento isReadOnly={false} />} />
                                    <Route path="/orcamentos/:orcamentoId/view" element={<FormularioOrcamento isReadOnly={true} />} />
                                    <Route path="/orcamentos/:orcamentoId/editar" element={<FormularioOrcamento isReadOnly={false} />} />
                                    
                                    {/* Rota de fallback para a rota raiz protegida */}
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    
                                    {/* Rota de fallback (404) */}
                                    <Route path="*" element={<h1>404 | Página não encontrada.</h1>} />
                                </Routes>
                            </Layout>
                        </AuthGuard>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;