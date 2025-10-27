import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge, Button } from 'react-bootstrap';
import api from '../services/api';
import { Link } from 'react-router-dom';

// Componente simples de Card para KPIs (mantido)
const KPICard = ({ title, value, iconClass, variant = 'primary' }) => (
  <Card className="text-center shadow-sm h-100 border-start border-5" style={{ borderColor: `var(--bs-${variant})` }}>
    <Card.Body>
      <i className={`${iconClass} fa-2x text-${variant} mb-2`}></i>
      <Card.Title className="text-muted small">{title}</Card.Title>
      <Card.Text as="h3">{value}</Card.Text>
    </Card.Body>
  </Card>
);

const PlaceholderBox = ({ title, height = '300px' }) => (
  <Card className="shadow-sm h-100">
    <Card.Header as="h5" className="bg-light">{title}</Card.Header>
    <Card.Body>
      <div
        style={{ height: height, backgroundColor: '#f8f9fa', border: '1px dashed #ced4da' }}
        className="d-flex align-items-center justify-content-center text-muted"
      >
        Estrutura pronta para: **{title}**
      </div>
    </Card.Body>
  </Card>
);

// Função para formatar a data (igual ao OrdensServico.js)
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
const getStatusVariant = (status) => {
  switch (status) {
    case 'Em Reparo': return 'warning';
    case 'Aguardando Peça': return 'info';
    case 'Finalizado': return 'success';
    case 'Em Análise': return 'secondary';
    case 'Aberto': return 'primary';
    case 'Crítica': return 'danger';
    case 'Alta': return 'warning';
    default: return 'light';
  }
};

// Componente para a Tabela de Ações
const OSTable = ({ title, osList, showDeliveryDate = false }) => (
  <Card className="shadow-sm h-100">
    <Card.Header as="h5" className="bg-light">{title}</Card.Header>
    <Card.Body>
      {osList.length === 0 ? (
        <Alert variant="success" className="text-center mt-2">Nenhuma OS {title.toLowerCase()}. Ótimo trabalho!</Alert>
      ) : (
        <Table responsive size="sm">
          <thead>
            <tr>
              <th># OS</th>
              <th>Cliente</th>
              <th>Problema</th>
              <th>Status/Prioridade</th>
              {showDeliveryDate && <th>Entrega</th>}
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {osList.map((os) => (
              <tr key={os._id}>
                <td>{os._id.substring(0, 4)}...</td>
                <td>{os.cliente?.nome || 'N/A'}</td>
                <td>{os.tituloProblema.substring(0, 30)}...</td>
                <td>
                  <Badge bg={getStatusVariant(os.status || os.prioridade)}>
                    {os.status || os.prioridade}
                  </Badge>
                </td>
                {showDeliveryDate && <td>{formatDate(os.previsaoEntrega)}</td>}
                <td>
                  <Button as={Link} to={`/os/${os._id}`} variant="outline-primary" size="sm">
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card.Body>
  </Card>
);


const Dashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/kpis');
      setData(response.data);
    } catch (err) {
      setError('Falha ao carregar dados do Dashboard. Verifique a API.');
      console.error('Erro no Dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container fluid className="p-4 text-center">
        <Spinner animation="border" className="mt-5" />
        <p className="mt-3">Carregando painel de controle...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger" className="mt-4">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Visão Geral - Desempenho Operacional</h1>

      {/* ---------------------------------------------------- */}
      {/* SEÇÃO 1: LINHA DE KPIS ESSENCIAIS */}
      {/* ---------------------------------------------------- */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <KPICard
            title="OS EM ANDAMENTO"
            value={data.osEmAberto || 0}
            iconClass="fas fa-tools"
            variant="primary"
          />
        </Col>

        <Col md={3} className="mb-3">
          <KPICard
            title="OS CONCLUÍDAS (30 DIAS)"
            value={data.osConcluidasMes || 0}
            iconClass="fas fa-check-circle"
            variant="success"
          />
        </Col>

        <Col md={3} className="mb-3">
          <KPICard
            title="CLIENTES ATIVOS"
            value={data.totalClientes || 0}
            iconClass="fas fa-users"
            variant="info"
          />
        </Col>

        <Col md={3} className="mb-3">
          <KPICard
            title="TÉCNICO DESTAQUE"
            value={data.rankingTecnicos?.[0]?.nome || 'N/A'}
            iconClass="fas fa-star"
            variant="warning"
          />
        </Col>
      </Row>

      {/* ---------------------------------------------------- */}
      {/* SEÇÃO 2: AÇÕES E ALERTA (Foco Operacional) */}
      {/* ---------------------------------------------------- */}
      <Row>
        {/* Tabela de OS Urgentes (Prioridade Alta/Crítica) - Foco em Alerta */}
        <Col lg={6} className="mb-4">
          <OSTable
            title="OS URGENTES (ALTA/CRÍTICA)"
            osList={data.osUrgentes || []}
            showDeliveryDate={false}
          />
        </Col>

        {/* Tabela de Próximas Entregas (Foco em Planejamento) */}
        <Col lg={6} className="mb-4">
          <OSTable
            title="PRÓXIMAS ENTREGAS (7 DIAS)"
            osList={data.osProximasEntregas || []}
            showDeliveryDate={true}
          />
        </Col>
      </Row>

      {/* ---------------------------------------------------- */}
      {/* SEÇÃO 3: Relatórios/Outras Métricas */}
      {/* ---------------------------------------------------- */}
      <Row className="mt-2">
        <Col lg={6} className="mb-4">
          <OSTable
            title="OS CONCLUÍDAS"
            osList={data.osConcluidas || []}
            showDeliveryDate={false}
          />
        </Col>

        <Col lg={6} className="mb-4">
          <OSTable
            title="OS CANCELADAS"
            osList={data.osCanceladas || []}
            showDeliveryDate={false}
          />
        </Col>
      </Row>

    </Container>
  );
};

export default Dashboard;