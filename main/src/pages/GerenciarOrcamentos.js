import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';



// Função para formatar o valor monetário (Real Brasileiro)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value || 0);
};

// Função auxiliar para mudar a cor do Status de Aprovação
const getStatusVariant = (status) => {
    switch (status) {
        case 'Aprovado': return 'success';
        case 'Rejeitado': return 'danger';
        case 'Pendente': return 'warning';
        default: return 'secondary';
    }
};

const GerenciarOrcamentos = () => {
    const [orcamentos, setOrcamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----------------------------------------------------------------------
    // FUNÇÃO DE BUSCAR ORÇAMENTOS (READ) - AGORA REAL, USANDO GET /api/orcamentos
    // ----------------------------------------------------------------------
    const fetchOrcamentos = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chama a rota que lista todos os documentos do Model Orcamento
            const response = await api.get('/orcamentos');
            setOrcamentos(response.data);

        } catch (err) {
            setError('Falha ao carregar lista de orçamentos. Verifique o Backend.');
            console.error('Erro ao buscar orçamentos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrcamentos();
    }, []);

    // Ações de Deleção
    const handleDeleteOrcamento = async (id) => {
        if (window.confirm(`Tem certeza que deseja DELETAR o orçamento #${id.substring(0, 5)}...? Esta ação é irreversível.`)) {
            setError(null);
            try {
                await api.delete(`/orcamentos/${id}`);
                fetchOrcamentos(); // Recarrega a lista
            } catch (err) {
                setError(`Falha ao deletar orçamento: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
                console.error('Erro ao deletar orçamento:', err);
            }
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4 d-flex align-items-center">
                <Col>
                    <h1>Gerenciar Orçamentos</h1>
                    <p className="text-muted">Acompanhe a aprovação e os valores dos serviços.</p>
                </Col>
                <Col className="text-end">
                    {/* Botão de Nova OS, pois o orçamento nasce da OS */}
                    <Button variant="success" as={Link} to="/os/novo">
                        <i className="bi bi-plus-circle me-2"></i> Criar Nova OS/Orçamento
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Card className="shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" /><p className="mt-2">Carregando orçamentos...</p></div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th># OS ID</th>
                                    <th>Cliente</th>
                                    <th>Tipo Orçamento</th>
                                    <th>Valor Total</th>
                                    <th>Status Aprovação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orcamentos.map((orc) => (
                                    <tr key={orc._id}>
                                        {/* ID da OS (para referência) */}
                                        <td>{orc.ordemServico?._id.substring(0, 6) || 'N/A'}...</td>

                                        {/* Cliente: Acessa o nome através da OS (Populado) */}
                                        <td>{orc.ordemServico?.cliente?.nome || 'N/A'}</td>

                                        <td>{orc.tipoOrcamento}</td>
                                        <td><Badge bg="dark">{formatCurrency(orc.valorTotal)}</Badge></td>

                                        <td>
                                            <Badge bg={getStatusVariant(orc.statusAprovacao)} pill>
                                                {orc.statusAprovacao}
                                            </Badge>
                                        </td>
                                     <td>
                                            {/* 🚨 BOTÃO 1: SOMENTE VER */}
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm" 
                                                as={Link} 
                                                to={`/orcamentos/${orc._id}/view`} 
                                                className="me-2"
                                            >
                                                <i className="bi bi-eye"></i> Ver
                                            </Button>

                                            {/* 🚨 BOTÃO 2: EDITAR */}
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                as={Link} 
                                                to={`/orcamentos/${orc._id}/editar`} 
                                                className="me-2"
                                            >
                                                <i className="bi bi-pencil"></i> Editar
                                            </Button>

                                            {/* 🚨 BOTÃO 3: EXCLUIR */}
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                onClick={() => handleDeleteOrcamento(orc._id)}
                                            >
                                                <i className="bi bi-trash-fill"></i> Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {!loading && orcamentos.length === 0 && (
                        <Alert variant="info" className="text-center mt-3">Nenhum orçamento encontrado.</Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default GerenciarOrcamentos;