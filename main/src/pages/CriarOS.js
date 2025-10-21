// src/pages/CriarOS.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const CriarOS = () => {
    // Estados para simular a coleta de dados (removeremos o console.log mais tarde)
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados da Nova OS (Simulado):', formData);
        alert('Formulário de OS pronto. Próximo passo será integrar com o Backend para salvar os dados.');
    };

    return (
        <Container fluid className="p-4">
            <h1 className="mb-4">Criar Nova Ordem de Serviço</h1>
            <p className="text-muted mb-4">Cadastre o cliente, o equipamento e o problema para iniciar o serviço.</p>

            <Form onSubmit={handleSubmit}>
                <Row>

                    {/* ---------------------------------------------------------------------- */}
                    {/* COLUNA 1: Cliente e Funcionário (Entidades Relacionadas) - Largura 4 */}
                    {/* ---------------------------------------------------------------------- */}
                    <Col lg={4}>
                        <Card className="shadow-sm mb-4">
                            <Card.Header as="h5">Informações de Atribuição</Card.Header>
                            <Card.Body>

                                {/* SELEÇÃO/CADASTRO DE CLIENTE */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Cliente *</Form.Label>
                                    <Form.Select name="clienteId" onChange={handleChange} required>
                                        <option value="">Selecione um cliente existente</option>
                                        <option value="1">Patrik Silva</option>
                                        <option value="2">Tecno Soluções Ltda.</option>
                                        <option value="novo">-- Novo Cliente --</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">Ou selecione 'Novo Cliente' para cadastrar.</Form.Text>
                                </Form.Group>

                                <hr />

                                {/* SELEÇÃO DE FUNCIONÁRIO/TÉCNICO */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Técnico Responsável *</Form.Label>
                                    <Form.Select name="tecnicoId" onChange={handleChange} required>
                                        <option value="">Selecione o funcionário</option>
                                        <option value="101">Maria Santos (Técnica Júnior)</option>
                                        <option value="102">João Alves (Técnico Sênior)</option>
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
                                    {/* SELEÇÃO/CADASTRO DE EQUIPAMENTO */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Equipamento *</Form.Label>
                                            <Form.Select name="equipamentoId" onChange={handleChange} required>
                                                <option value="">Selecione um equipamento do cliente</option>
                                                <option value="e1">Notebook Dell XPS (SN: A1B2C3)</option>
                                                <option value="e2">Impressora HP Laser (SN: P9X8Y7)</option>
                                                <option value="novo">-- Novo Equipamento --</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* NÚMERO DE SÉRIE / IDENTIFICAÇÃO */}
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Modelo / Número de Série</Form.Label>
                                            <Form.Control type="text" name="modelo" onChange={handleChange} placeholder="Ex: Dell XPS 13 / SN: XXXXX" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <hr />

                                {/* TÍTULO E DESCRIÇÃO DO PROBLEMA */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Título / Resumo do Problema *</Form.Label>
                                    <Form.Control type="text" name="tituloOS" onChange={handleChange} placeholder="Ex: Notebook não liga" required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição Detalhada do Problema *</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="descricaoProblema" onChange={handleChange} placeholder="Detalhe como o problema ocorreu, tentativas de solução, etc." required />
                                </Form.Group>
                                <Row>
                                    {/* STATUS E PRIORIDADE */}
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Status Inicial *</Form.Label>
                                            <Form.Select name="status" onChange={handleChange} required>
                                                <option value="aberto">Aberto (Triagem)</option>
                                                <option value="analise">Em Análise Técnica</option>
                                                <option value="orcamento">Aguardando Orçamento</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prioridade</Form.Label>
                                            <Form.Select name="prioridade" onChange={handleChange}>
                                                <option value="media">Média</option>
                                                <option value="alta">Alta</option>
                                                <option value="baixa">Baixa</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    {/* PREVISÃO DE ENTREGA */}
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Previsão de Entrega</Form.Label>
                                            <Form.Control type="date" name="previsaoEntrega" onChange={handleChange} />
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
                >
                    Salvar Ordem de Serviço
                </Button>
                <Button variant="outline-secondary">
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default CriarOS;