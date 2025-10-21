// src/pages/Clientes.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';

// Dados de Exemplo para simular a resposta da API
const mockClientes = [
  { id: 1, nome: 'Patrik Silva', email: 'patrik@email.com', telefone: '(11) 98765-4321', dataCadastro: '2025-01-10' },
  { id: 2, nome: 'Tecno Soluções Ltda', email: 'contato@tecno.com', telefone: '(21) 3333-4444', dataCadastro: '2025-03-25' },
  { id: 3, nome: 'Alpha Marketing', email: 'comercial@alpha.com', telefone: '(19) 1111-2222', dataCadastro: '2025-09-01' },
];

const Clientes = () => {
  // Estado para gerenciar a visibilidade do Modal
  const [showModal, setShowModal] = useState(false);
  
  // Estado para gerenciar os dados do formulário (para criar/editar)
  const [formCliente, setFormCliente] = useState({});

  const handleShow = (cliente = {}) => {
    setFormCliente(cliente); // Se vazio, é criação; se preenchido, é edição
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Cliente Enviados (Simulado):', formCliente);
    alert(`Cliente ${formCliente.id ? 'editado' : 'criado'} com sucesso! (Simulado)`);
    handleClose();
    // AQUI ENTRARIA A CHAMADA AXIOS (POST ou PUT) PARA O BACKEND
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col>
          <h1>Gerenciar Clientes</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleShow({})}>
            <i className="fas fa-plus-circle me-2"></i> Novo Cliente
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th># ID</th>
                <th>Nome/Razão Social</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Data Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockClientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.dataCadastro}</td>
                  <td>
                    {/* Botão de Edição */}
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(cliente)}>
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
          <Modal.Title>{formCliente.id ? `Editar Cliente: ${formCliente.nome}` : 'Cadastrar Novo Cliente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome/Razão Social *</Form.Label>
              <Form.Control 
                type="text" 
                name="nome"
                value={formCliente.nome || ''} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>E-mail *</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                value={formCliente.email || ''} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control 
                type="text" 
                name="telefone"
                value={formCliente.telefone || ''} 
                onChange={handleChange} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formEndereco">
              <Form.Label>Endereço</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                name="endereco"
                value={formCliente.endereco || ''} 
                onChange={handleChange} 
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {formCliente.id ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Clientes;