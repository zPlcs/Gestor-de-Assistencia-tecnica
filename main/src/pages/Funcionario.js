import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api'; // Módulo Axios para comunicação com o Backend

const getStatusVariant = (status) => {
  return status === 'Ativo' ? 'success' : 'danger';
};

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formFuncionario, setFormFuncionario] = useState({});

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------------------------------------------------
  // FUNÇÕES DE COMUNICAÇÃO COM A API (CREATE, READ, UPDATE, DELETE)
  // ----------------------------------------------------------------------

  // A) FUNÇÃO DE BUSCAR (READ)
  const fetchFuncionarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/funcionarios');
      setFuncionarios(response.data);
    } catch (err) {
      setError('Falha ao carregar funcionários. Verifique o Backend.');
      console.error('Erro ao buscar funcionários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []); // Carrega funcionários na montagem

  // B) FUNÇÃO DE CRIAÇÃO/EDIÇÃO (CREATE/UPDATE)
  const handleSave = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (formFuncionario._id) {
        // EDIÇÃO (PUT)
        // Nota: Não enviamos a senha em branco na edição para não sobrescrever a criptografada
        const dataToUpdate = { ...formFuncionario };
        delete dataToUpdate.senha;

        await api.put(`/funcionarios/${formFuncionario._id}`, dataToUpdate);

      } else {
        // CRIAÇÃO (POST)
        // A senha deve ser obrigatória aqui (validação Mongoose no Backend)
        if (!formFuncionario.senha) {
          setError('A senha inicial é obrigatória para novos funcionários.');
          setSubmitting(false);
          return;
        }
        await api.post('/funcionarios', formFuncionario);
      }

      handleClose();
      fetchFuncionarios(); // Recarrega a lista

    } catch (err) {
      setError(`Erro ao salvar funcionário: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
      console.error('Erro ao salvar funcionário:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // C) FUNÇÃO DE DELETAR (DELETE)
  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja DELETAR o funcionário: ${nome}?`)) {
      setError(null);
      try {
        await api.delete(`/funcionarios/${id}`);
        fetchFuncionarios(); // Recarrega a lista após a exclusão
      } catch (err) {
        setError(`Erro ao deletar funcionário: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
        console.error('Erro ao deletar funcionário:', err);
      }
    }
  };


  // ----------------------------------------------------------------------
  // FUNÇÕES DE UI (Modal, Forms)
  // ----------------------------------------------------------------------

  const handleShow = (func = {}) => {
    // Usamos '_id' do MongoDB
    setFormFuncionario(func._id ? func : {});
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormFuncionario({}); // Limpa o formulário ao fechar
    setError(null);
  };

  const handleChange = (e) => {
    setFormFuncionario({ ...formFuncionario, [e.target.name]: e.target.value });
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
          <h1>Gerenciar Funcionários</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => handleShow({})}>
            Adicionar Funcionário
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
              <p className="mt-2">Carregando funcionários...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((func) => (
                  <tr key={func._id}>
                    <td>{func._id ? func._id.substring(0, 6) : 'N/A'}...</td>
                    <td>{func.nome}</td>
                    <td>{func.cargo}</td>
                    <td>{func.email}</td>
                    <td>
                      <Badge bg={getStatusVariant(func.status)} pill>
                        {func.status}
                      </Badge>
                    </td>
                    <td>
                      {/* Botão de Edição */}
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(func)} disabled={submitting}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      {/* Botão de Deleção */}
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(func._id, func.nome)} disabled={submitting}>
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {!loading && funcionarios.length === 0 && (
            <Alert variant="info" className="text-center mt-3">Nenhum funcionário cadastrado ainda.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* MODAL (Formulário de Criação/Edição) */}
      {/* ---------------------------------------------------- */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formFuncionario._id ? `Editar Funcionário: ${formFuncionario.nome}` : 'Cadastrar Novo Funcionário'}</Modal.Title>
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
                disabled={submitting}
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
                disabled={submitting || formFuncionario._id} // Não edita o email no PUT
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
                    disabled={submitting}
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
                    disabled={submitting}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Campo de Senha - Apenas para cadastro ou redefinição */}
            {!formFuncionario._id && (
              <Form.Group className="mb-3">
                <Form.Label>Senha Inicial *</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  onChange={handleChange}
                  required={!formFuncionario._id} // Requerida apenas na criação
                  placeholder="Mínimo 6 caracteres"
                  disabled={submitting}
                />
              </Form.Group>
            )}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : (formFuncionario._id ? 'Salvar Alterações' : 'Cadastrar Funcionário')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Funcionarios;
