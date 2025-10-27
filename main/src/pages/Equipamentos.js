import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { Link } from 'react-router-dom';

// Função auxiliar para mudar a cor do Status do Equipamento
const getStatusVariant = (status) => {
  switch (status) {
    case 'Em Reparo': return 'warning';
    case 'Aguardando Cliente': return 'info';
    case 'Desativado': return 'danger';
    case 'Finalizado': return 'success';
    default: return 'secondary';
  }
};

const Equipamentos = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [clientes, setClientes] = useState([]); // Novo estado para lista de Clientes
  const [showModal, setShowModal] = useState(false);
  const [formEquipamento, setFormEquipamento] = useState({});

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------------------------------------------------
  // FUNÇÕES DE BUSCA (READ)
  // ----------------------------------------------------------------------

  // Busca Equipamentos (Principal)
  const fetchEquipamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/equipamentos');
      setEquipamentos(response.data);
    } catch (err) {
      setError('Falha ao carregar equipamentos. Verifique a API.');
      console.error('Erro ao buscar equipamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Busca a lista de Clientes (Para o Select do formulário)
  const fetchClientesList = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      console.error('Erro ao carregar lista de clientes para o Select:', err);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
    fetchClientesList(); // Busca clientes ao montar o componente
  }, []);

  // ----------------------------------------------------------------------
  // FUNÇÕES DE CRUD (CREATE, UPDATE, DELETE)
  // ----------------------------------------------------------------------

  const handleSave = async () => {
    setSubmitting(true);
    setError(null);

    // Validação mínima para garantir que um cliente foi selecionado
    if (!formEquipamento.clienteId) {
      setError('É obrigatório associar o equipamento a um cliente.');
      setSubmitting(false);
      return;
    }

    try {
      if (formEquipamento._id) {
        // EDIÇÃO (PUT)
        await api.put(`/equipamentos/${formEquipamento._id}`, formEquipamento);

      } else {
        // CRIAÇÃO (POST)
        await api.post('/equipamentos', formEquipamento);
      }

      handleClose();
      fetchEquipamentos(); // Recarrega a lista

    } catch (err) {
      // Usamos a mensagem de erro que o Backend retorna
      const backendMessage = err.response?.data?.error;
      setError(`Erro ao salvar equipamento: ${backendMessage || 'Erro de rede/servidor'}`);
      console.error('Erro ao salvar equipamento:', err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja DELETAR o equipamento ${nome}?`)) {
      setError(null);
      try {
        await api.delete(`/equipamentos/${id}`);
        fetchEquipamentos();
      } catch (err) {
        setError(`Erro ao deletar equipamento: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
        console.error('Erro ao deletar equipamento:', err);
      }
    }
  };


  // ----------------------------------------------------------------------
  // FUNÇÕES DE UI (Modal, Forms)
  // ----------------------------------------------------------------------

  const handleShow = (eq = {}) => {
    // Ao editar, o objeto `eq` pode vir com clienteId como um objeto (populate) ou string.
    const initialClienteId = eq.clienteId?._id || eq.clienteId || '';

    setFormEquipamento({
      ...eq,
      clienteId: initialClienteId // Configura o select
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormEquipamento({});
    setError(null);
  };

  const handleChange = (e) => {
    setFormEquipamento({ ...formEquipamento, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };


  // ----------------------------------------------------------------------
  // RENDERIZAÇÃO
  // ----------------------------------------------------------------------

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col>
          <h1>Gerenciar Equipamentos</h1>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={() => handleShow({})}>
            Adicionar Equipamento
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center p-5"><Spinner animation="border" /><p className="mt-2">Carregando equipamentos...</p></div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Cliente</th>
                  <th>Nome</th> 
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Nº Série</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipamentos.map((eq) => (
                  <tr key={eq._id}>
                    <td>{eq._id.substring(0, 6)}...</td>
                    {/* Cliente: Acessa o objeto populado (nomeFantasia é o campo preferencial) */}
                    <td>{eq.clienteId ? (eq.clienteId.nome || eq.clienteId.nomeFantasia || 'N/A') : 'Cliente Deletado'}</td>
                    <td>{eq.tipoDeEquipamento}</td>
                    <td>{eq.marca}</td>
                    <td>{eq.modelo}</td>
                    <td>{eq.numSerie}</td>
                    <td>
                      <Badge bg={getStatusVariant(eq.status)} pill>
                        {eq.status}
                      </Badge>
                    </td>
                    <td>
                      {/* Botão de Edição */}
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(eq)} disabled={submitting}>
                        <i class="bi bi-pencil"></i>
                      </Button>
                      {/* Botão de Deleção */}
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(eq._id, eq.numSerie)} disabled={submitting}>
                        <i class="bi bi-trash-fill"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {!loading && equipamentos.length === 0 && (
            <Alert variant="info" className="text-center mt-3">Nenhum equipamento cadastrado ainda.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* MODAL (Formulário de Criação/Edição) */}
      {/* ---------------------------------------------------- */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formEquipamento._id ? `Editar Equipamento: ${formEquipamento.modelo}` : 'Cadastrar Novo Equipamento'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cliente Associado *</Form.Label>
              {clientes.length === 0 ? (
                <Alert variant="warning">Nenhum cliente cadastrado. <Link to="/clientes">Cadastre um cliente</Link> primeiro.</Alert>
              ) : (
                <Form.Select
                  name="clienteId"
                  value={formEquipamento.clienteId || ''}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Selecione o Cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nome || cliente.nomeFantasia} ({cliente._id.substring(0, 5)}...)
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Equipamento *</Form.Label>
              <Form.Control
                type="text"
                name="tipoDeEquipamento"
                value={formEquipamento.tipoDeEquipamento || ''}
                onChange={handleChange}
                placeholder="Ex: Notebook, Impressora, Servidor"
                required
                disabled={submitting}
              />
            </Form.Group>

            {/* 🚨 CAMPO MARCA ADICIONADO AQUI */}
            <Form.Group className="mb-3">
              <Form.Label>Marca *</Form.Label>
              <Form.Control
                type="text"
                name="marca"
                value={formEquipamento.marca || ''}
                onChange={handleChange}
                required
                disabled={submitting}
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
                disabled={submitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Número de Série / Identificação *</Form.Label>
              <Form.Control
                type="text"
                name="numSerie"
                value={formEquipamento.numSerie || ''}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status do Equipamento</Form.Label>
              <Form.Select
                name="status"
                value={formEquipamento.status || 'Em Operação'}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Em Operação">Em Operação</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Desativado">Desativado</option>
                <option value="Aguardando Peça">Aguardando Peça</option>
              </Form.Select>
            </Form.Group>


          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : (formEquipamento._id ? 'Salvar Alterações' : 'Cadastrar Equipamento')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Equipamentos;