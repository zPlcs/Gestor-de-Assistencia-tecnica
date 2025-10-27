import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api'; // Módulo Axios para comunicação com o Backend

const Clientes = () => {
  // Estado para armazenar os clientes REALMENTE carregados da API
  const [clientes, setClientes] = useState([]);

  // Estado para gerenciar a visibilidade do Modal
  const [showModal, setShowModal] = useState(false);

  // Estado para gerenciar os dados do formulário (para criar/editar)
  const [formCliente, setFormCliente] = useState({});

  // Estados de UI para feedback ao usuário
  const [loading, setLoading] = useState(true); // Carregamento da lista
  const [submitting, setSubmitting] = useState(false); // Submissão do formulário
  const [error, setError] = useState(null); // Mensagens de erro

  // ----------------------------------------------------------------------
  // FUNÇÕES DE COMUNICAÇÃO COM A API (CREATE, READ, UPDATE, DELETE)
  // ----------------------------------------------------------------------

  // A) FUNÇÃO DE BUSCAR (READ) - Chamada inicial e após cada CRUD
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/clientes');
      // O backend nativo do MongoDB usa '_id'
      setClientes(response.data);
    } catch (err) {
      setError('Falha ao carregar clientes. Verifique a conexão com o Backend.');
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega clientes na montagem do componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // B) FUNÇÃO DE CRIAÇÃO/EDIÇÃO (CREATE/UPDATE)
  const handleSave = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (formCliente._id) { // Verifica se o objeto tem _id (MongoDB) para saber se é EDIÇÃO
        // EDIÇÃO (PUT)
        await api.put(`/clientes/${formCliente._id}`, formCliente);

      } else {
        // CRIAÇÃO (POST)
        await api.post('/clientes', formCliente);
      }

      handleClose();
      fetchClientes(); // Recarrega a lista para mostrar a alteração

    } catch (err) {
      setError(`Erro ao salvar cliente: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
      console.error('Erro ao salvar cliente:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // C) FUNÇÃO DE DELETAR (DELETE)
  const handleDelete = async (id, nome) => {
    // Uso de Modal customizado seria preferível, mas por simplicidade usamos o confirm
    if (window.confirm(`Tem certeza que deseja deletar o cliente: ${nome}? Esta ação é irreversível.`)) {
      setError(null);
      try {
        await api.delete(`/clientes/${id}`);
        fetchClientes(); // Recarrega a lista após a exclusão
      } catch (err) {
        setError(`Erro ao deletar cliente: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
        console.error('Erro ao deletar cliente:', err);
      }
    }
  };


  // ----------------------------------------------------------------------
  // FUNÇÕES DE UI (Modal, Forms, Handlers)
  // ----------------------------------------------------------------------

  const handleShow = (cliente = {}) => {
    // Usa '_id' (do MongoDB) para identificar, se estiver editando
    setFormCliente(cliente._id ? cliente : {});
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormCliente({}); // Limpa o formulário ao fechar
    setError(null); // Limpa erros
  };

  const handleChange = (e) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
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
          <h1>Gerenciar Clientes</h1>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" onClick={() => handleShow({})}>
            Adicionar Cliente
          </Button>
        </Col>
      </Row>

      {/* Exibe erros da API ou da aplicação */}
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Carregando clientes da API...</p>
            </div>
          ) : (
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
                {clientes.map((cliente) => (
                  <tr key={cliente._id}>
                    {/* Exibe os 6 primeiros caracteres do _id do MongoDB */}
                    <td>{cliente._id ? cliente._id.substring(0, 6) : 'N/A'}...</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.dataCadastro ? new Date(cliente.dataCadastro).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {/* Botão de Edição */}
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(cliente)}>
                        <i class="bi bi-pencil"></i>
                      </Button>
                      {/* Botão de Deleção */}
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cliente._id, cliente.nome)}>
                        <i class="bi bi-trash-fill"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {!loading && clientes.length === 0 && (
            <Alert variant="info" className="text-center mt-3">Nenhum cliente cadastrado ainda. Clique em "Novo Cliente" para começar.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* MODAL (Formulário de Criação/Edição) */}
      {/* ---------------------------------------------------- */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formCliente._id ? `Editar Cliente: ${formCliente.nome}` : 'Cadastrar Novo Cliente'}</Modal.Title>
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
                disabled={submitting}
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
                disabled={submitting}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                name="telefone"
                value={formCliente.telefone || ''}
                onChange={handleChange}
                disabled={submitting}
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
                disabled={submitting}
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : (formCliente._id ? 'Salvar Alterações' : 'Cadastrar')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Clientes;
