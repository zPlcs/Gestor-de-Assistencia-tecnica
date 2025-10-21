// src/pages/Funcionarios.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';

// Dados de Exemplo para simular a resposta da API
const mockFuncionarios = [
  { id: 101, nome: 'João Alves', email: 'joao.alves@assist.com', cargo: 'Técnico Sênior', osAtribuidas: 15, status: 'Ativo' },
  { id: 102, nome: 'Maria Santos', email: 'maria.santos@assist.com', cargo: 'Técnica Júnior', osAtribuidas: 10, status: 'Ativo' },
  { id: 103, nome: 'Ana Costa', email: 'ana.costa@assist.com', cargo: 'Administrador', osAtribuidas: 0, status: 'Ativo' },
  { id: 104, nome: 'Pedro Lima', email: 'pedro.lima@assist.com', cargo: 'Técnico Júnior', osAtribuidas: 0, status: 'Inativo' },
];

// Função auxiliar para mudar a cor do Status do Funcionário
const getStatusVariant = (status) => {
  return status === 'Ativo' ? 'success' : 'danger';
};

const Funcionarios = () => {
  const [showModal, setShowModal] = useState(false);
  const [formFuncionario, setFormFuncionario] = useState({});

  const handleShow = (func = {}) => {
    setFormFuncionario(func); 
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormFuncionario({ ...formFuncionario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Funcionário Enviados (Simulado):', formFuncionario);
    alert(`Funcionário ${formFuncionario.id ? 'editado' : 'cadastrado'} com sucesso! (Simulado)`);
    handleClose();
    // AQUI ENTRARIA A CHAMADA AXIOS (POST ou PUT) PARA O BACKEND
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col>
          <h1>Gerenciar Funcionários</h1>
          <p className="text-muted">Controle de acesso e produtividade da equipe.</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleShow({})}>
            <i className="fas fa-user-plus me-2"></i> Novo Funcionário
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th># ID</th>
                <th>Nome</th>
                <th>Cargo</th>
                <th>E-mail</th>
                <th>OS Atribuídas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockFuncionarios.map((func) => (
                <tr key={func.id}>
                  <td>{func.id}</td>
                  <td>{func.nome}</td>
                  <td>{func.cargo}</td>
                  <td>{func.email}</td>
                  <td>{func.osAtribuidas}</td>
                  <td>
                    <Badge bg={getStatusVariant(func.status)} pill>
                      {func.status}
                    </Badge>
                  </td>
                  <td>
                    {/* Botão de Edição */}
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(func)}>
                      <i className="fas fa-edit"></i>
                    </Button>
                    {/* Botão de Deleção (Simulado) */}
                    <Button variant="outline-danger" size="sm">
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* MODAL (Formulário de Criação/Edição) */}
      {/* ---------------------------------------------------- */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formFuncionario.id ? `Editar Funcionário: ${formFuncionario.nome}` : 'Cadastrar Novo Funcionário'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo *</Form.Label>
              <Form.Control 
                type="text" 
                name="nome"
                value={formFuncionario.nome || ''} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>E-mail (Login) *</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formFuncionario.email || ''} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Cargo / Nível de Acesso *</Form.Label>
                    <Form.Select 
                        name="cargo" 
                        value={formFuncionario.cargo || ''} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Selecione...</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Técnico Sênior">Técnico Sênior</option>
                        <option value="Técnico Júnior">Técnico Júnior</option>
                        <option value="Suporte">Suporte</option>
                    </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Status da Conta</Form.Label>
                    <Form.Select 
                        name="status" 
                        value={formFuncionario.status || 'Ativo'} 
                        onChange={handleChange} 
                    >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Campo de Senha - Apenas para cadastro ou redefinição */}
            {!formFuncionario.id && (
                <Form.Group className="mb-3">
                    <Form.Label>Senha Inicial *</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="senha"
                        onChange={handleChange} 
                        required={!formFuncionario.id}
                        placeholder="Mínimo 8 caracteres"
                    />
                </Form.Group>
            )}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {formFuncionario.id ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Funcionarios;