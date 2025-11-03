import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Função auxiliar para determinar a cor do Status (reusada do OrdensServico.js)
const getStatusVariant = (status) => {
    switch (status) {
        case 'Em Reparo': return 'warning';
        case 'Aberto': return 'primary';
        case 'Em Análise': return 'secondary';
        default: return 'secondary';
    }
};

const SeletorOS = () => {
    const navigate = useNavigate();
    const [osDisponiveis, setOsDisponiveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ----------------------------------------------------------------------
    // FUNÇÃO DE BUSCAR OS SEM ORÇAMENTO
    // ----------------------------------------------------------------------
    const fetchOSParaOrcamento = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Chama o endpoint otimizado que usa $nin no Backend para filtrar OS sem Orçamento
            const response = await api.get('/os/sem-orcamento');
            
            setOsDisponiveis(response.data);
            
        } catch (err) {
            // Se o erro for 404/401, o Backend falhou em retornar a lista
            setError('Falha ao carregar a lista de Ordens de Serviço. Verifique a API /os/sem-orcamento.');
            console.error('Erro ao buscar OS:', err);
        } finally {
            setLoading(false);
        }
    }, []); // A dependência vazia garante que a função só seja criada na montagem

    // Carrega a lista de OS disponíveis
    useEffect(() => {
        fetchOSParaOrcamento();
    }, [fetchOSParaOrcamento]); // Depende da função para evitar eslint warnings

    const handleSelecionarOS = (osId) => {
        // Redireciona para o formulário de orçamento, que usa o ID da OS na URL para iniciar a criação
        navigate(`/os/${osId}/orcamento`);
    };

    if (loading) {
        return <Container className="p-4 text-center"><Spinner animation="border" /></Container>;
    }

    return (
        <Container fluid className="p-4">
            <h1 className="mb-4">1. Selecionar OS para Orçamento</h1>
            <p className="text-muted">Escolha uma Ordem de Serviço **em andamento** para gerar o orçamento detalhado.</p>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Card className="shadow-sm">
                <Card.Body>
                    {osDisponiveis.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            Nenhuma Ordem de Serviço disponível para orçamentação.
                            <p className="mt-2 mb-0 small">
                                <i className="bi bi-info-circle me-1"></i> Apenas OS que não estão Finalizadas/Canceladas e que **não possuem orçamento** aparecem aqui.
                            </p>
                        </Alert>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th># OS</th>
                                    <th>Cliente</th>
                                    <th>Equipamento</th> {/* Adicionado para clareza */}
                                    <th>Problema</th>
                                    <th>Status</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {osDisponiveis.map(os => (
                                    <tr key={os._id}>
                                        <td>{os._id.substring(0, 6)}...</td>
                                        <td>{os.cliente?.nome || 'N/A'}</td>
                                        <td>{os.equipamento?.modelo || 'N/A'}</td> {/* População da OS para Equipamento */}
                                        <td>{os.tituloProblema}</td>
                                        <td><Badge bg={getStatusVariant(os.status)}>{os.status}</Badge></td>
                                        <td>
                                            <Button size="sm" onClick={() => handleSelecionarOS(os._id)}>
                                                <i className="bi bi-arrow-right-circle me-1"></i> Criar Orçamento
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SeletorOS;