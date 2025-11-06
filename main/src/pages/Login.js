
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// src/pages/Login.js (NO TOPO)

// Importa o objeto 'api' como padrão, e a função 'setAuthToken' como nomeada (entre chaves)
import  api from '../services/api';


const Login = () => {
  const navigate = useNavigate();
  // Estados para Usuário (email, que é o identificador no nosso Model) e Senha
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  
  // Estados de UI
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);

    try {
        // Chamada à rota de login do Backend (POST /api/funcionarios/login)
        const response = await api.post('/funcionarios/login', { 
            email, 
            senha: password // O nome do campo é 'senha' no nosso Backend
        });
        
        const { token, nome, cargo } = response.data;
        


        // 🚨 ARMAZENA O TOKEN E DADOS DO USUÁRIO NO LOCAL STORAGE
        localStorage.setItem('userToken', token);
        localStorage.setItem('userName', nome);
        localStorage.setItem('userCargo', cargo);
        
        // Redireciona para o Dashboard (ou a rota protegida definida no App.js)
        navigate('/dashboard', { replace: true }); 

    } catch (err) {
        // Trata erros 401 (Não Autorizado) e outros erros de rede/servidor
        const errorMessage = err.response?.data?.message || 'Falha na comunicação com o servidor. Verifique o Backend.';
        setError(errorMessage);
        console.error('Erro de Autenticação:', err.response?.data || err);
    } finally {
        setLoading(false);
    }
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
                <p className="text-muted">Acesso ao Sistema</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nome de Usuário</Form.Label> 
                  <Form.Control 
                    type="text" 
                    placeholder="Nome de Usuário ou E-mail (Ex: admin@teste.com)" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Sua senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Entrar'}
                </Button>
              </Form>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;