import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Função auxiliar para mudar a cor do Status (deve corresponder ao Model da OS)
const getStatusVariant = (status) => {
    switch (status) {
    case 'Em Reparo': return 'warning';
    case 'Aguardando Peça': return 'info';
    case 'Finalizado': return 'success';
    case 'Cancelado' : return 'danger';
    case 'Em Análise': return 'secondary';
    case 'Aberto': return 'primary';
    case 'Crítica': return 'danger';
    case 'Alta': return 'warning';
    default: return 'secondary';
    }
};

const OrdensServico = () => {
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FUNÇÃO DE BUSCAR (READ)
    const fetchOrdensServico = async () => {
        setLoading(true);
        setError(null);
        try {
            // A API já popula Cliente, Equipamento e Técnico
            const response = await api.get('/os');
            setOrdensServico(response.data);
        } catch (err) {
            setError('Falha ao carregar Ordens de Serviço. Verifique o Backend.');
            console.error('Erro ao buscar OS:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdensServico();
    }, []);

    // FUNÇÃO DE DELETAR (DELETE)
    const handleDeleteOS = async (id, clienteNome) => {
        if (window.confirm(`Tem certeza que deseja DELETAR a OS do cliente: ${clienteNome}?`)) {
            setError(null);
            try {
                await api.delete(`/os/${id}`);
                fetchOrdensServico();
            } catch (err) {
                setError(`Erro ao deletar OS: ${err.response?.data?.message || 'Erro de rede/servidor'}`);
                console.error('Erro ao deletar OS:', err);
            }
        }
    };

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // 1. Cria o objeto Date
    const date = new Date(dateString);
    
    // 2. Cria um novo objeto Date a partir dos componentes UTC (Ano, Mês, Dia)
    // Isso "zera" a hora no fuso local, garantindo que o dia não volte.
    const localDate = new Date(
        date.getUTCFullYear(), 
        date.getUTCMonth(), 
        date.getUTCDate()
    );
    
    // 3. Formata a data no fuso local
    return localDate.toLocaleDateString();
};

    return (
        <Container fluid className="p-4">
            <Row className="mb-4 d-flex align-items-center">
                <Col>
                    <h1>Gerenciar Ordens de Serviço</h1>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" as={Link} to="/os/novo">
                        Criar Ordem de Serviço
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <Card className="shadow-sm">
                <Card.Body>
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" /><p className="mt-2">Carregando dados da OS...</p></div>
                    ) : (
                        <>

                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th># ID</th>
                                        <th>Cliente</th>
                                        <th>Equipamento</th>
                                        <th>Técnico</th>
                                        <th>Entrada</th>
                                        <th>Status</th>
                                        <th>Previsão de entrega</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordensServico.map((os) => (
                                        <tr key={os._id}>
                                            <td>{os._id.substring(0, 6)}...</td>
                                            {/* Cliente (Populado) */}
                                            <td>{os.cliente?.nome || 'N/A'}</td>
                                            {/* Equipamento (Populado) */}
                                            <td>{os.equipamento?.modelo} (*{os.equipamento?.numSerie}*)</td>
                                            {/* Técnico (Populado) */}
                                            <td>{os.tecnicoResponsavel?.nome || 'Não Atribuído'}</td>

                                            <td>{formatDate(os.createdAt)}</td>
                                            <td>
                                                {formatDate(os.previsaoEntrega)}
                                            </td>
                                            <td>
                                                <Badge bg={getStatusVariant(os.status)}>
                                                    {os.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {/* Ações: Visualizar/Editar (A rota /os/:id virá depois) */}
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    as={Link} // <-- Usa Link do react-router-dom
                                                    to={`/os/${os._id}`} // <-- Rota de edição com o ID da OS
                                                    className="me-2"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteOS(os._id, os.cliente?.nome)}>
                                                    <i className="fas fa-trash-alt"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {!loading && ordensServico.length === 0 && (
                                <Alert variant="info" className="text-center mt-3">Nenhuma Ordem de Serviço encontrada.</Alert>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrdensServico;
