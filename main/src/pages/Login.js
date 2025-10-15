// src/pages/Login.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
// Se já estivéssemos integrados, importaríamos 'useNavigate' aqui:
// import { useNavigate } from 'react-router-dom';

const Login = () => {
  // const navigate = useNavigate(); // Para redirecionar após login
  
  // 1. Estado para guardar os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Para gerenciar o estado do botão

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validação de Frontend Simples
    if (!email || !password) {
      setError('Por favor, insira seu e-mail e senha para acessar.');
      return;
    }
    
    setLoading(true);
    
    // -------------------------------------------------------------------
    // SIMULAÇÃO DE CHAMADA À API (Substituir por Axios.post() real)
    // -------------------------------------------------------------------
    
    setTimeout(() => {
      setLoading(false);
      
      // Simulação de Sucesso/Falha
      if (email === 'admin@gestor.com') {
        console.log('Login bem-sucedido simulado:', { email, password });
        alert('Login realizado. Será redirecionado para a Dashboard (próxima etapa)');
        // navigate('/'); // No futuro, redirecionar para a Dashboard
      } else {
        setError('Credenciais inválidas. Tente "admin@gestor.com"');
      }
      
    }, 1500); // Simula 1.5 segundos de carregamento da API
  };

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: '100vh', backgroundColor: '#e9ecef' }} 
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="mb-0 text-primary">Gestão de OS</h2>
                <p className="text-muted">Faça seu login para continuar</p>
              </div>

              {/* Mensagem de Erro */}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Seu e-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading} // Não permite digitar durante o loading
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Sua senha secreta" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading} // Não permite digitar durante o loading
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mt-2"
                  disabled={loading}
                >
                  {loading ? 'Aguarde...' : 'Entrar no Sistema'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <a href="/recuperar-senha" className="text-muted small">Esqueceu a senha?</a>
              </div>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;