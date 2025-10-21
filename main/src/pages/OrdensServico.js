import React from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Dados de Exemplo para simular a resposta da API
const mockOrdensServico = [
    { id: 1, cliente: 'Patrik Silva', equipamento: 'Notebook Dell', problema: 'Não liga', tecnico: 'João A.', status: 'EM REPARO', dataEntrada: '2025-10-15', previsao: '2025-10-25' },
    { id: 2, cliente: 'Tecno Soluções', equipamento: 'Impressora Laser', problema: 'Falha no Fusor', tecnico: 'Maria S.', status: 'AGUARDANDO PEÇA', dataEntrada: '2025-10-18', previsao: '2025-10-28' },
    { id: 3, cliente: 'Alpha Marketing', equipamento: 'Monitor 27"', problema: 'Tela quebrada', tecnico: 'João A.', status: 'FINALIZADO', dataEntrada: '2025-10-10', previsao: '2025-10-12' },
    { id: 4, cliente: 'Beta Consultoria', equipamento: 'Servidor HP', problema: 'Lento', tecnico: 'Maria S.', status: 'EM ANÁLISE', dataEntrada: '2025-10-20', previsao: '2025-10-30' },
];

// Função auxiliar para mudar a cor do Status
const getStatusVariant = (status) => {
    switch (status) {
        case 'EM REPARO': return 'warning';
        case 'AGUARDANDO PEÇA': return 'info';
        case 'FINALIZADO': return 'success';
        case 'EM ANÁLISE': return 'secondary';
        default: return 'light';
    }
};

const OrdensServico = () => {
    return (
        <Container fluid className="p-4">
            <Row className="mb-4 d-flex align-items-center">
                <Col>
                    <h1>Gerenciar Ordens de Serviço</h1>
                </Col>
                <Col className="text-end">
                    {/* Botão para criar nova OS (aponta para a rota que criamos) */}
                    <Button variant="primary" as={Link} to="/os/novo">
                        <i className="fas fa-plus-circle me-2"></i> Nova Ordem de Serviço
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Body>

                    {/* Espaço para Filtros e Busca (futura implementação) */}
                    <div className="mb-3">
                        <i className="fas fa-filter me-2"></i> **Filtros rápidos (Status/Técnico) virão aqui.**
                    </div>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th># OS</th>
                                <th>Cliente</th>
                                <th>Equipamento</th>
                                <th>Técnico</th>
                                <th>Entrada</th>
                                <th>Previsão</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockOrdensServico.map((os) => (
                                <tr key={os.id}>
                                    <td>{os.id}</td>
                                    <td>{os.cliente}</td>
                                    <td>{os.equipamento} - *{os.problema.substring(0, 15)}...*</td>
                                    <td>{os.tecnico}</td>
                                    <td>{os.dataEntrada}</td>
                                    <td>{os.previsao}</td>
                                    <td>
                                        <Badge bg={getStatusVariant(os.status)}>
                                            {os.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {/* Ações: Editar e Visualizar */}
                                        <Button variant="outline-info" size="sm" className="me-2">
                                            <i className="fas fa-eye"></i>
                                        </Button>
                                        <Button variant="outline-secondary" size="sm">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Espaço para Paginação (futura implementação) */}
                    <div className="text-center mt-3 text-muted small">
                        <i className="fas fa-list me-2"></i> **A Paginação do Bootstrap virá aqui.**
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default OrdensServico;