import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; // <-- NOVO: useParams
import api from '../services/api';

// Status possíveis da OS (deve ser idêntico ao seu Model de Backend)
const STATUS_OPTIONS = [
    { value: 'Aberto', label: 'Aberto (Triagem)' },
    { value: 'Em Análise', label: 'Em Análise Técnica' },
    { value: 'Em Reparo', label: 'Em Reparo' },
    { value: 'Aguardando Peça', label: 'Aguardando Peça' },
    { value: 'Aguardando Aprovação', label: 'Aguardando Aprovação' },
    { value: 'Finalizado', label: 'Finalizado' },
    { value: 'Cancelado', label: 'Cancelado' },
];

const PRIORIDADE_OPTIONS = ['Baixa', 'Média', 'Alta', 'Crítica'];


const FormularioOS = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // <-- Obtém o ID da OS se estiver em modo edição
    const isEditing = !!id; // Flag para saber se estamos editando

    // 1. ESTADO DA ORDEM DE SERVIÇO (OS)
    const [formData, setFormData] = useState({
        cliente: '',
        equipamento: '',
        tecnicoResponsavel: '',
        tituloProblema: '',
        descricaoProblema: '',
        status: 'Aberto',
        prioridade: 'Média'
    });

    // 2. ESTADOS DAS LISTAS PARA OS SELECTS
    const [clientes, setClientes] = useState([]);
    const [equipamentos, setEquipamentos] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);

    // 3. ESTADOS DE UI
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // ----------------------------------------------------------------------
    // FUNÇÕES DE BUSCA (Pré-requisitos)
    // ----------------------------------------------------------------------

    const fetchPrerequisitesAndData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Busca de Pré-requisitos (Listas)
            const [clientesRes, funcRes, equipRes] = await Promise.all([
                api.get('/clientes'),
                api.get('/funcionarios'),
                api.get('/equipamentos'),
            ]);

            setClientes(clientesRes.data);
            setFuncionarios(funcRes.data.filter(f => f.cargo.includes('Técnico') || f.cargo === 'Administrador'));
            setEquipamentos(equipRes.data);

            // 2. Modo Edição: Carrega a OS específica
            if (isEditing) {
                const osRes = await api.get(`/os/${id}`); // Assumindo que você terá uma rota GET /api/os/:id
                const osData = osRes.data;

                // Formata os dados para o formulário (especialmente IDs populados)
                setFormData({
                    ...osData,
                    // Garante que o estado use apenas o _id da referência (string)
                    cliente: osData.cliente?._id || '',
                    equipamento: osData.equipamento?._id || '',
                    tecnicoResponsavel: osData.tecnicoResponsavel?._id || '',
                    // Formata a data para input[type=date]
                    previsaoEntrega: osData.previsaoEntrega ? osData.previsaoEntrega.substring(0, 10) : ''
                });
            }

        } catch (err) {
            setError('Falha ao carregar dados essenciais. Verifique o Backend.');
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrerequisitesAndData();
    }, [id]);

    // ----------------------------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------------------------

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEquipamentoChange = (e) => {
        const selectedEquipamentoId = e.target.value;
        const selectedEquipamento = equipamentos.find(eq => eq._id === selectedEquipamentoId);

        // Quando o equipamento muda, o cliente também muda para o do equipamento
        let updatedData = {
            ...formData,
            equipamento: selectedEquipamentoId,
            // Atualiza o cliente automaticamente se um equipamento for selecionado
            cliente: selectedEquipamento ? (selectedEquipamento.clienteId?._id || selectedEquipamento.clienteId) : ''
        };

        // Se o equipamento for 'novo' (placeholder), zera o cliente
        if (selectedEquipamentoId === 'novo') {
            updatedData.cliente = '';
        }

        setFormData(updatedData);
    }

    const handleSave = async () => {
        setSubmitting(true);
        setError(null);
        
        try {
            if (isEditing) {
                // EDIÇÃO (PUT)
                await api.put(`/os/${id}`, formData);
                alert('Ordem de Serviço atualizada com sucesso!');
            } else {
                // CRIAÇÃO (POST)
                await api.post('/os', formData);
                alert('Ordem de Serviço criada com sucesso!');
            }
            
            navigate('/os'); // Redireciona para a listagem
            
        } catch (err) {
            const backendMessage = err.response?.data?.error || err.response?.data?.message; 
            setError(`Falha ao salvar OS: ${backendMessage || 'Erro de rede/servidor.'}`);
            console.error('Erro ao salvar OS:', err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    // Filtra equipamentos para exibir apenas os do cliente selecionado
    const equipamentosFiltrados = equipamentos.filter(eq =>
        (eq.clienteId?._id || eq.clienteId) === formData.cliente
    );

    // ----------------------------------------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------------------------------------

    if (loading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" className="mt-5" />
                <p className="mt-3">Preparando o formulário...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="p-4">
            <h1 className="mb-4">Criar Nova Ordem de Serviço</h1>
            <p className="text-muted mb-4">Cadastre o serviço e atribua o técnico responsável.</p>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>

                    {/* ---------------------------------------------------------------------- */}
                    {/* COLUNA 1: Cliente e Funcionário (Entidades Relacionadas) - Largura 4 */}
                    {/* ---------------------------------------------------------------------- */}
                    <Col lg={4}>
                        <Card className="shadow-sm mb-4">
                            <Card.Header as="h5">Atribuição e Cliente</Card.Header>
                            <Card.Body>

                                {/* SELEÇÃO DE CLIENTE */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Cliente *</Form.Label>
                                    <Form.Select
                                        name="cliente"
                                        value={formData.cliente}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                    >
                                        <option value="">Selecione um cliente</option>
                                        {clientes.map(c => (
                                            <option key={c._id} value={c._id}>
                                                {c.nome} ({c.email})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <hr />

                                {/* SELEÇÃO DE FUNCIONÁRIO/TÉCNICO */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Técnico Responsável *</Form.Label>
                                    <Form.Select
                                        name="tecnicoResponsavel"
                                        value={formData.tecnicoResponsavel}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                    >
                                        <option value="">Selecione o técnico</option>
                                        {funcionarios.map(f => (
                                            <option key={f._id} value={f._id}>
                                                {f.nome} ({f.cargo})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                            </Card.Body>
                        </Card>
                    </Col>

                    {/* -------------------------------------------------------------------- */}
                    {/* COLUNA 2: Equipamento e Detalhes da OS (O Coração da Ordem) - Largura 8 */}
                    {/* -------------------------------------------------------------------- */}
                    <Col lg={8}>
                        <Card className="shadow-sm mb-4">
                            <Card.Header as="h5">Detalhes do Equipamento e do Serviço</Card.Header>
                            <Card.Body>

                                <Row>
                                    {/* SELEÇÃO DE EQUIPAMENTO */}
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Equipamento *</Form.Label>
                                            <Form.Select
                                                name="equipamento"
                                                value={formData.equipamento}
                                                onChange={handleEquipamentoChange}
                                                required
                                                disabled={submitting || !formData.cliente || equipamentosFiltrados.length === 0}
                                            >
                                                <option value="">
                                                    {formData.cliente ? 'Selecione um equipamento do cliente' : 'Selecione um cliente primeiro'}
                                                </option>
                                                {equipamentosFiltrados.map(eq => (
                                                    <option key={eq._id} value={eq._id}>
                                                        {eq.nome} ({eq.modelo} - {eq.numSerie})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Text className="text-muted">
                                                {equipamentosFiltrados.length === 0 && formData.cliente && 'Nenhum equipamento cadastrado para este cliente.'}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr />

                                {/* TÍTULO E DESCRIÇÃO DO PROBLEMA */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Título / Resumo do Problema *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="tituloProblema"
                                        value={formData.tituloProblema || ''}
                                        onChange={handleChange}
                                        placeholder="Ex: Notebook não liga"
                                        required
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição Detalhada do Problema *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descricaoProblema"
                                        value={formData.descricaoProblema || ''}
                                        onChange={handleChange}
                                        placeholder="Detalhe como o problema ocorreu, tentativas de solução, etc."
                                        required
                                        disabled={submitting}
                                    />
                                </Form.Group>
                                <Row>
                                    {/* STATUS E PRIORIDADE */}
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status Inicial *</Form.Label>
                                            <Form.Select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                required
                                                disabled={submitting}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prioridade</Form.Label>
                                            <Form.Select
                                                name="prioridade"
                                                value={formData.prioridade}
                                                onChange={handleChange}
                                                disabled={submitting}
                                            >
                                                {PRIORIDADE_OPTIONS.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* PREVISÃO DE ENTREGA */}
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Previsão de Entrega</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="previsaoEntrega"
                                                value={formData.previsaoEntrega || ''}
                                                onChange={handleChange}
                                                disabled={submitting}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>
                    </Col>

                </Row>

                <Button
                    variant="success"
                    type="submit"
                    className="me-2"
                    disabled={submitting || !formData.cliente || !formData.equipamento || !formData.tecnicoResponsavel}
                >
                    {submitting ? <Spinner size="sm" animation="border" /> : 'Salvar Ordem de Serviço'}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/os')}>
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default FormularioOS;
