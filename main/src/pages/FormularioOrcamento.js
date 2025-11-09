import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner, Badge, InputGroup, Table } from 'react-bootstrap';
import api from '../services/api';

// Status e Tipos (devem bater com os Models do Backend)
const TIPO_ORCAMENTO_OPTIONS = ['Reparo', 'Montagem', 'Revisão/Manutenção'];
const STATUS_APROVACAO_OPTIONS = ['Pendente', 'Aprovado', 'Rejeitado'];

// Função auxiliar para formatar a moeda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value || 0);
};

// 🚨 COMPONENTE FORMULARIO ORCAMENTO FINALIZADO E CORRIGIDO
// Ele aceita a prop 'isReadOnly' para ativar o modo Visualização
const FormularioOrcamento = ({ isReadOnly = false }) => {
    const { osId, orcamentoId } = useParams();
    const navigate = useNavigate();

    // Variáveis de Modo
    const currentId = orcamentoId || osId;
    const isEditing = !!orcamentoId && !isReadOnly;
    const isViewMode = isReadOnly;
    // O modo de Criação é implícito se não for Edição nem Visualização.

    // ESTADOS PRINCIPAIS
    const [orcamento, setOrcamento] = useState({
        ordemServico: osId, // ID da OS é usado como referência inicial
        tipoOrcamento: TIPO_ORCAMENTO_OPTIONS[0],
        taxaServico: 0,
        observacoes: '',
        statusAprovacao: 'Pendente',
        valorTotal: 0
    });
    const [itens, setItens] = useState([]);
    const [osData, setOsData] = useState({}); // Detalhes da OS

    // 🚨 CORREÇÃO DE NOMENCLATURA: USANDO APENAS 'novoItem'
    const [novoItem, setNovoItem] = useState({ descricao: '', tipoItem: 'Serviço', linkCompra: '', quantidade: 1, valorUnitario: 0 });

    // ESTADOS DE UI
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isSavingDetails, setIsSavingDetails] = useState(false);

    // --- FUNÇÃO DE CARREGAMENTO (OS e Orçamento) ---
    const fetchDados = useCallback(async () => {
        setLoading(true);
        setError(null);
        let idDaOSParaContexto = osId; // Assume o ID da URL de criação como padrão

        try {
            let dadosOrcamento = null;

            // 1. MODO EDIÇÃO/VISUALIZAÇÃO: Buscar o Orçamento por ID (se houver)
            if (orcamentoId) {
                const orcResponse = await api.get(`/orcamentos/${orcamentoId}`);
                dadosOrcamento = orcResponse.data;
                setOrcamento(dadosOrcamento);

                // O ID da OS REAL está dentro do Orçamento populado
                idDaOSParaContexto = dadosOrcamento.ordemServico._id;

                // Busca os Itens
                const itensRes = await api.get(`/orcamentos/${orcamentoId}/itens`);
                setItens(itensRes.data);
            }

            // 2. BUSCA OS DETALHES DA ORDEM DE SERVIÇO (Usando o ID que descobrimos ou o da URL)
            if (idDaOSParaContexto) {
                const osResponse = await api.get(`/os/${idDaOSParaContexto}`);
                setOsData(osResponse.data);
            }

            // 3. MODO CRIAÇÃO (Se não tem ID de orçamento, inicializa)
            if (!orcamentoId) {
                setOrcamento(prev => ({ ...prev, ordemServico: osId }));
            }

        } catch (err) {
            if (orcamentoId) {
                setError('Falha ao carregar Orçamento para Edição/Visualização.');
            } else {
                setError('Falha ao carregar a Ordem de Serviço ou dados essenciais.');
            }
            console.error('Erro ao carregar dados:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    }, [osId, orcamentoId]); // Dependências limpas

    useEffect(() => {
        fetchDados();
    }, [fetchDados]);

    // --- HANDLERS E FUNÇÕES DE CRUD ---

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
        setOrcamento(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleItemChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
        // 🚨 USANDO setNovoItem
        setNovoItem(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setIsSavingDetails(true);
        setError(null);

        try {
            let res;
            // Se já tem ID, atualiza (PUT). Se não tem, cria (POST).
            const endpoint = orcamento._id ? `/orcamentos/${orcamento._id}` : '/orcamentos';
            const method = orcamento._id ? api.put : api.post;

            res = await method(endpoint, orcamento);

            setOrcamento(res.data);
            alert('Detalhes do Orçamento salvos com sucesso!');

            if (orcamento._id) {
                navigate('/orcamentos', { replace: true });
            }

            // Se estava no modo Criação, redireciona para o modo Edição
            if (!orcamento._id) {
                navigate(`/orcamentos/${res.data._id}/editar`, { replace: true });
            }

        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message;
            setError(`Erro ao salvar detalhes: ${backendMessage}`);
            console.error('Erro de submissão:', err.response?.data || err);
        } finally {
            setIsSavingDetails(false);
        }


    };

    // CRUD DE ITENS - Adicionar
    const handleAddItem = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (!orcamento._id) {
            alert('Erro: Salve o orçamento inicial antes de adicionar itens.');
            return;
        }
        if (!novoItem.descricao) {
            setError('A descrição do novo item é obrigatória.');
            return;
        }

        try {
            // 🚨 USANDO novoItem
            const itemRes = await api.post(`/orcamentos/${orcamento._id}/itens`, novoItem);

            setItens(prev => [...prev, itemRes.data]);
            const updatedOrcamentoRes = await api.get(`/orcamentos/${orcamento._id}`);
            setOrcamento(updatedOrcamentoRes.data);

            // 🚨 USANDO setNovoItem
            setNovoItem({ descricao: '', tipoItem: 'Serviço', linkCompra: '', quantidade: 1, valorUnitario: 0 });
        } catch (err) {
            setError(`Erro ao adicionar item: ${err.response?.data?.message || err.message}`);
            console.error('Erro ao adicionar item:', err.response?.data || err);
        } finally {
            setSubmitting(false);
        }
    };

    // CRUD DE ITENS - Deletar
    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Confirmar exclusão deste item?")) return;
        setSubmitting(true);
        try {
            await api.delete(`/orcamentos/${orcamento._id}/itens/${itemId}`);

            setItens(prev => prev.filter(item => item._id !== itemId));
            const updatedOrcamentoRes = await api.get(`/orcamentos/${orcamento._id}`);
            setOrcamento(updatedOrcamentoRes.data);

        } catch (err) {
            setError('Erro ao deletar item.');
            console.error('Erro ao deletar item:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // FUNÇÃO DE DOWNLOAD DE PDF
    const handleGeneratePDF = () => {
        if (!orcamento._id) {
            alert('O orçamento precisa ser salvo antes de gerar o PDF.');
            return;
        }
        const pdfUrl = `${api.defaults.baseURL}/orcamentos/${orcamento._id}/pdf`;
        window.open(pdfUrl, '_blank');
    };

    const clienteNome = osData.cliente?.nome || 'N/A';
    const equipamentoInfo = osData.equipamento
        ? `${osData.equipamento.modelo || 'N/A Modelo'} (SN: ${osData.equipamento.numSerie || 'N/A Série'})`
        : 'N/A';

    // Definição do Título com base no modo
    const currentIdCurto = currentId ? currentId.substring(0, 8) : 'N/A';
    const osIdCurto = osId ? osId.substring(0, 8) : 'N/A';

    const tituloPagina = isViewMode
        ? `Visualizar Orçamento #${currentIdCurto}...`
        : isEditing
            ? `Editar Orçamento #${currentIdCurto}...`
            : `Criar Orçamento para OS #${osIdCurto}...`;


    // ----------------------------------------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------------------------------------

    if (loading) {
        return <Container className="p-4 text-center"><Spinner animation="border" className="mt-5" /></Container>;
    }

    return (
        <Container fluid className="p-4">
            <h1 className="mb-4">{tituloPagina}</h1>
            <p className="text-muted">Cliente: **{clienteNome}** | Equipamento: **{equipamentoInfo}**</p>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Row>
                {/* COLUNA 1: DETALHES DO ORÇAMENTO E APROVAÇÃO */}
                <Col lg={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5">Detalhes e Aprovação</Card.Header>
                        <Card.Body>
                            {/* Formulário de Detalhes - Oculto em modo visualização */}
                            <Form onSubmit={handleSaveDetails}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Orçamento *</Form.Label>
                                    <Form.Select name="tipoOrcamento" value={orcamento.tipoOrcamento} onChange={handleChange} required disabled={isSavingDetails || isViewMode}>
                                        {TIPO_ORCAMENTO_OPTIONS.map(tipo => (<option key={tipo} value={tipo}>{tipo}</option>))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Status de Aprovação *</Form.Label>
                                    <Form.Select name="statusAprovacao" value={orcamento.statusAprovacao} onChange={handleChange} disabled={isSavingDetails || isViewMode}>
                                        {STATUS_APROVACAO_OPTIONS.map(status => (<option key={status} value={status}>{status}</option>))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Taxa de Serviço (Mão de Obra) *</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>R$</InputGroup.Text>
                                        <Form.Control type="number" step="0.01" name="taxaServico" value={orcamento.taxaServico} onChange={handleChange} required min="0" disabled={isSavingDetails || isViewMode} />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Observações</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="observacoes" value={orcamento.observacoes} onChange={handleChange} disabled={isSavingDetails || isViewMode} />
                                </Form.Group>

                                {/* BOTÃO SALVAR DETALHES - Oculto em modo visualização */}
                                {!isViewMode && (
                                    <Button variant="success" type="submit" className="w-100 mb-2" disabled={isSavingDetails}>
                                        {isSavingDetails ? <Spinner size="sm" animation="border" /> : (orcamento._id ? 'Salvar Detalhes' : 'Criar Orçamento Inicial')}
                                    </Button>
                                )}
                            </Form>

                            {/* BOTÃO PDF - Visível sempre que o orçamento existir */}
                            <Button variant="outline-secondary" onClick={handleGeneratePDF} className="w-100" disabled={!orcamento._id || isSavingDetails}>
                                <i className="bi bi-file-earmark-pdf me-2"></i> Gerar e Baixar PDF
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* COLUNA 2: GESTÃO DE ITENS */}
                <Col lg={8}>
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                            Itens de Serviço
                            <h3>Total: <Badge bg="dark">{formatCurrency(orcamento.valorTotal)}</Badge></h3>
                        </Card.Header>
                        <Card.Body>

                            {/* FORMULÁRIO DE ADIÇÃO DE ITEM - Oculto em modo visualização */}
                            {!isViewMode && (
                                <Form className="mb-4" onSubmit={handleAddItem}>
                                    <Row className="g-3 align-items-end">
                                        <Col md={2}>
                                            <Form.Label>Tipo</Form.Label>
                                            {/* 🚨 USANDO novoItem */}
                                            <Form.Select name="tipoItem" value={novoItem.tipoItem} onChange={handleItemChange} disabled={submitting}>
                                                <option value="Serviço">Serviço</option>
                                                <option value="Peça">Peça</option>
                                                <option value="Outros">Outros</option>
                                            </Form.Select>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label>Descrição *</Form.Label>
                                            {/* 🚨 USANDO novoItem */}
                                            <Form.Control type="text" name="descricao" value={novoItem.descricao} onChange={handleItemChange} required disabled={submitting} />
                                        </Col>
                                        <Col md={3}>
                                            <Form.Label>Link Compra</Form.Label>
                                            {/* 🚨 USANDO novoItem */}
                                            <Form.Control type="text" name="linkCompra" value={novoItem.linkCompra || ''} onChange={handleItemChange} placeholder="URL da peça" disabled={submitting} />
                                        </Col>
                                        <Col md={1}>
                                            <Form.Label>Qtd</Form.Label>
                                            {/* 🚨 USANDO novoItem */}
                                            <Form.Control type="number" name="quantidade" value={novoItem.quantidade} onChange={handleItemChange} required min="1" disabled={submitting} />
                                        </Col>
                                        <Col md={2}>
                                            <Form.Label>R$ Unit. *</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>R$</InputGroup.Text>
                                                {/* 🚨 USANDO novoItem */}
                                                <Form.Control type="number" step="0.01" name="valorUnitario" value={novoItem.valorUnitario} onChange={handleItemChange} required min="0" disabled={submitting} />
                                            </InputGroup>
                                        </Col>
                                        <Col md={1} className="d-flex align-items-end">
                                            <Button type="submit" variant="primary" className="w-100" disabled={submitting || !orcamento._id}>
                                                <i className="bi bi-plus me-1"></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}

                            {/* TABELA DE ITENS */}
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Descrição</th>
                                        <th>Link</th>
                                        <th>Qtd</th>
                                        <th>Valor Unit.</th>
                                        <th>Subtotal</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itens.map(item => (
                                        <tr key={item._id}>
                                            <td>{item.tipoItem}</td>
                                            <td>{item.descricao}</td>
                                            <td>
                                                {item.linkCompra ? (
                                                    <a href={item.linkCompra} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                        <i className="bi bi-link-45deg me-1"></i> Abrir Link
                                                    </a>
                                                ) : ('N/A')}
                                            </td>
                                            <td>{item.quantidade}</td>
                                            <td>{formatCurrency(item.valorUnitario)}</td>
                                            <td>{formatCurrency(item.subtotal)}</td>
                                            <td>
                                                {/* Botão de exclusão - Oculto em modo visualização */}
                                                {!isViewMode && (
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item._id)} disabled={submitting}>
                                                        <i className="bi bi-x-lg"></i>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {itens.length === 0 && <Alert variant="secondary" className="text-center">Adicione itens para calcular o orçamento.</Alert>}

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormularioOrcamento;