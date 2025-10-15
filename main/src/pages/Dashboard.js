// src/pages/Dashboard.js

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Componente simples de Card para KPIs
const KPICard = ({ title, value, iconClass }) => (
  <Card className="text-center shadow-sm h-100">
    <Card.Body>
      {/* Ícone placeholder. Se não usar Font Awesome, remova o <i>. */}
      <i className={`${iconClass} fa-2x text-primary mb-2`}></i> 
      <Card.Title className="text-muted small">{title}</Card.Title>
      <Card.Text as="h3">{value}</Card.Text>
    </Card.Body>
  </Card>
);

// Componente para representar gráficos ou tabelas grandes
const PlaceholderBox = ({ title, height = '300px' }) => (
  <Card className="shadow-sm mb-4">
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


const Dashboard = () => {
  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Visão Geral - Desempenho Operacional</h1>

      {/* ---------------------------------------------------- */}
      {/* SEÇÃO 1: Linha de Cartões de KPIs (Métricas Chave) */}
      {/* ---------------------------------------------------- */}
      <Row className="mb-4">
        {/* KPI 1: Foco em OS - Quantidade de trabalho pendente */}
        <Col md={3} className="mb-3">
          <KPICard title="Total de OS em Aberto (Aguardando Reparo)" value="45" iconClass="fas fa-exclamation-triangle" />
        </Col>
        
        {/* KPI 2: Foco em OS - Produtividade no mês */}
        <Col md={3} className="mb-3">
          <KPICard title="Ordens de Serviço Concluídas (30 Dias)" value="120" iconClass="fas fa-check-circle" />
        </Col>
        
        {/* KPI 3: Foco em Clientes - Base de usuários */}
        <Col md={3} className="mb-3">
          <KPICard title="Total de Clientes Cadastrados" value="1850" iconClass="fas fa-users" />
        </Col>
        
        {/* KPI 4: Foco em Eficiência - Tempo médio de serviço */}
        <Col md={3} className="mb-3">
          <KPICard title="Média de Dias para Conclusão de OS" value="3.5 dias" iconClass="fas fa-clock" />
        </Col>
      </Row>

      {/* ---------------------------------------------------- */}
      {/* SEÇÃO 2: Relatórios Detalhados */}
      {/* ---------------------------------------------------- */}
      <Row>
        {/* Foco em OS: Distribuição e Fluxo */}
        <Col lg={8}>
          <PlaceholderBox title="Distribuição Atual das Ordens de Serviço por Status" height="400px" />
        </Col>

        {/* Foco em Funcionários: Performance */}
        <Col lg={4}>
          <PlaceholderBox title="Ranking de Técnicos por Ordens de Serviço Finalizadas" height="400px" />
        </Col>
      </Row>

      {/* Linha adicional para uma tabela de Logs */}
      <Row className="mt-4">
        <Col md={12}>
           <PlaceholderBox title="Últimas 10 Ordens de Serviço Criadas (Ações Recentes)" height="250px" />
        </Col>
      </Row>

    </Container>
  );
};

export default Dashboard;