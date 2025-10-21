// src/pages/Equipamentos.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';

// Dados de Exemplo para simular a resposta da API
const mockEquipamentos = [
  { id: 101, cliente: 'Patrik Silva', tipo: 'Notebook', modelo: 'Dell XPS 13', serial: 'SN-001A', status: 'Em Reparo', dataEntrada: '2025-10-15' },
  { id: 102, cliente: 'Tecno Soluções', tipo: 'Impressora', modelo: 'HP Laser 400', serial: 'SN-002B', status: 'Aguardando Cliente', dataEntrada: '2025-10-18' },
  { id: 103, cliente: 'Alpha Marketing', tipo: 'Monitor', modelo: 'LG Ultrawide', serial: 'SN-003C', status: 'Finalizado', dataEntrada: '2025-10-10' },
];

// Função auxiliar para mudar a cor do Status do Equipamento
const getStatusVariant = (status) => {
  switch (status) {
    case 'Em Reparo': return 'warning';
    case 'Aguardando Cliente': return 'info';
    case 'Finalizado': return 'success';
    default: return 'secondary';
  }
};


const Equipamentos = () => {
  // Estado para gerenciar a visibilidade do Modal
  const [showModal, setShowModal] = useState(false);
  
  // Estado para gerenciar os dados do formulário (para criar/editar)
  const [formEquipamento, setFormEquipamento] = useState({});

  const handleShow = (equipamento = {}) => {
    setFormEquipamento(equipamento); 
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormEquipamento({ ...formEquipamento, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do Equipamento Enviados (Simulado):', formEquipamento);
    alert(`Equipamento ${formEquipamento.id ? 'editado' : 'cadastrado'} com sucesso! (Simulado)`);
    handleClose();
    // AQUI ENTRARIA A CHAMADA AXIOS (POST ou PUT) PARA O BACKEND
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col>
          <h1>Gerenciar Equipamentos</h1>
          <p className="text-muted">Dispositivos cadastrados e seus respectivos status.</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleShow({})}>
            <i className="fas fa-plus-circle me-2"></i> Novo Equipamento
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th># ID</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Modelo</th>
                <th>Nº Série</th>
                <th>Entrada</th>
                <th>Status Serviço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockEquipamentos.map((eq) => (
                <tr key={eq.id}>
                  <td>{eq.id}</td>
                  <td>{eq.cliente}</td>
                  <td>{eq.tipo}</td>
                  <td>{eq.modelo}</td>
                  <td>{eq.serial}</td>
                  <td>{eq.dataEntrada}</td>
                  <td>
                    <Badge bg={getStatusVariant(eq.status)} pill>
                      {eq.status}
                    </Badge>
                  </td>
                  <td>
                    {/* Botão de Edição */}
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(eq)}>
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
          <Modal.Title>{formEquipamento.id ? `Editar Equipamento: ${formEquipamento.modelo}` : 'Cadastrar Novo Equipamento'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cliente Associado *</Form.Label>
              {/* No futuro, este seria um campo de busca/seleção com dados da API de Clientes */}
              <Form.Select name="clienteId" onChange={handleChange} required>
                <option value="">Selecione o Cliente</option>
                <option value="1">Patrik Silva</option>
                <option value="2">Tecno Soluções Ltda</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Equipamento *</Form.Label>
              <Form.Control 
                type="text" 
                name="tipo"
                value={formEquipamento.tipo || ''} 
                onChange={handleChange} 
                placeholder="Ex: Notebook, Impressora, Servidor"
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Modelo *</Form.Label>
              <Form.Control 
                type="text" 
                name="modelo"
                value={formEquipamento.modelo || ''} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Número de Série / Identificação</Form.Label>
              <Form.Control 
                type="text" 
                name="serial"
                value={formEquipamento.serial || ''} 
                onChange={handleChange} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Observações de Entrada</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                name="observacoes"
                value={formEquipamento.observacoes || ''} 
                onChange={handleChange} 
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {formEquipamento.id ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Equipamentos;