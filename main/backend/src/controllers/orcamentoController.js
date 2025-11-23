// gestor-backend/src/controllers/orcamentoController.js

const Orcamento = require('../models/Orcamento');
const ItemOrcamento = require('../models/ItemOrcamento');
const PDFDocument = require('pdfkit');

const { recalcularOrcamentoTotal } = require('../utils/orcamentoUtils');
// @desc    Criar um novo Orçamento (vinculado a uma OS)
// @route   POST /api/orcamentos
const criarOrcamento = async (req, res) => {
    try {
        // Recebe os dados, incluindo ordemServico, tipoOrcamento, etc.
        const novoOrcamento = await Orcamento.create(req.body);

        // Retorna o orçamento criado, populando a OS para contexto
        // Garante que o objeto retornado seja formatado corretamente
        const orcamentoPopulacao = await Orcamento.findById(novoOrcamento._id)
            .populate('ordemServico', 'tituloProblema');

        res.status(201).json(orcamentoPopulacao);
    } catch (error) {
        // Erro de validação ou OS duplicada
        res.status(400).json({
            message: 'Erro ao criar orçamento. Verifique se a Ordem de Serviço já possui um orçamento.',
            error: error.message
        });
    }
};

// @desc    Listar todos os Orçamentos
// @route   GET /api/orcamentos
const listarOrcamentos = async (req, res) => {
    try {
        const orcamentos = await Orcamento.find({})
            // 🚨 SINTAXE DE POPULAÇÃO ANINHADA CORRIGIDA E ROBUSTA
            .populate({
                path: 'ordemServico',
                select: 'tituloProblema cliente equipamento', // Seleciona as referências que queremos popular
                populate: [
                    {
                        path: 'cliente',
                        select: 'nome' // Traz o nome do Cliente
                    },
                    {
                        path: 'equipamento',
                        select: 'modelo numSerie' // Traz detalhes do Equipamento
                    }
                ]
            })
            .sort({ createdAt: -1 });

        // Remove o console.log problemático para que a rota complete
        // if (orcamentos.length > 0) {
        //     console.log("SUCESSO POPULAÇÃO ORÇAMENTO:", orcamentos[0].ordemServico.cliente); 
        // }

        res.status(200).json(orcamentos);
    } catch (error) {
        // 🚨 Logamos o erro de forma segura
        console.error("ERRO CRÍTICO AO LISTAR ORÇAMENTOS:", error);
        res.status(500).json({ message: 'Erro ao listar orçamentos.', error: error.message });
    }
};

// @desc    Buscar um Orçamento por ID
// @route   GET /api/orcamentos/:id
const buscarOrcamento = async (req, res) => {
    try {
        const orcamento = await Orcamento.findById(req.params.id)
            .populate({
                path: 'ordemServico',
                select: 'tituloProblema status cliente equipamento',
                populate: [
                    { path: 'cliente', select: 'nome email telefone endereco' },
                    { path: 'equipamento', select: 'modelo numSerie marca' }
                ]
            });

        if (!orcamento) {
            return res.status(404).json({ message: 'Orçamento não encontrado.' });
        }
        res.status(200).json(orcamento);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar orçamento.', error: error.message });
    }
};

// @desc    Atualizar Status/Detalhes do Orçamento
// @route   PUT /api/orcamentos/:id
const atualizarOrcamento = async (req, res) => {
    try {
        // 1. Atualiza o documento do Orçamento com os novos dados (Status, Tipo, Taxa, Obs)
        const orcamentoAtualizado = await Orcamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Retorna o documento novo e garante validação
        );

        if (!orcamentoAtualizado) {
            return res.status(404).json({ message: 'Orçamento não encontrado.' });
        }

        // 2. Verifica se a Taxa de Serviço foi alterada OU se os itens foram alterados (chamada PUT de itens)
        // Se a requisição contiver o campo taxaServico, recalcula o total final
        if (req.body.taxaServico !== undefined) {

            // Chama a função utilitária para recalcular o valorTotal
            await recalcularOrcamentoTotal(req.params.id);

            // Busca novamente para garantir que o Frontend receba o valorTotal atualizado
            const orcamentoFinal = await Orcamento.findById(req.params.id);
            return res.status(200).json(orcamentoFinal);
        }

        // Se apenas Status ou Obs foi alterado, retorna o documento sem recálculo
        res.status(200).json(orcamentoAtualizado);
    } catch (error) {
        res.status(400).json({
            message: 'Erro ao atualizar orçamento. Verifique os dados (Ex: Tipo, Taxa).',
            error: error.message
        });
    }
};
const deletarOrcamento = async (req, res) => {
    try {
        const orcamentoDeletado = await Orcamento.findByIdAndDelete(req.params.id);

        if (!orcamentoDeletado) {
            return res.status(404).json({ message: 'Orçamento não encontrado.' });
        }

        // TO-DO: Lógica de deleção em cascata dos ItensOrcamento

        res.status(200).json({ message: 'Orçamento deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar orçamento.', error: error.message });
    }
};

// @desc    Gerar PDF de Orçamento por ID
// @route   GET /api/orcamentos/:id/pdf
const gerarPDFOrcamento = async (req, res) => {
    const orcamentoId = req.params.id;

    try {
        // 1. Busca os dados do Orçamento (e popula a OS, Cliente, Equipamento)
        const orcamento = await Orcamento.findById(orcamentoId)
            .populate({
                path: 'ordemServico',
                select: 'tituloProblema status cliente equipamento',
                populate: [
                    { path: 'cliente', select: 'nome email telefone endereco' },
                    { path: 'equipamento', select: 'modelo numSerie marca' }
                ]
            });

        if (!orcamento) {
            return res.status(404).json({ message: 'Orçamento não encontrado.' });
        }

        // 2. Busca os Itens de Orçamento associados
        const itens = await ItemOrcamento.find({ orcamento: orcamentoId });

        // ----------------------------------------------------
        // 3. Geração do Documento PDF
        // ----------------------------------------------------

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=orcamento_${orcamentoId}.pdf`);

        doc.pipe(res);

        // Funções auxiliares (Definidas internamente)
        const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
        const formatId = (id) => id ? id.toString().substring(0, 6).toUpperCase() : 'N/A';

        // --- Posições X e Larguras ---
        const cliente = orcamento.ordemServico.cliente;
        const equipamento = orcamento.ordemServico.equipamento;


        // --- BLOCO DE TÍTULO ---
        doc
            .fontSize(25)
            .text('ORÇAMENTO DE SERVIÇO', {
                align: 'center'
            });
        doc.moveDown(1);

        // --- INFORMAÇÕES DE EMISSÃO ---
        let currentY = doc.y;

        // Coluna Esquerda: Data
        doc.fontSize(10).text(`Data de Emissão: ${new Date().toLocaleDateString()}`, {
            align: 'left'
        })


        // Coluna Esquerda: ID
        doc.fontSize(10).text(`Orçamento ID: ${formatId(orcamento._id)}`, {
            align: 'left'
        })
        doc.moveDown(1);

        // --- DADOS DO CLIENTE E OS ---

        // Cliente
        doc.fontSize(10).text(`Cliente: ${cliente?.nome || 'N/A'}`, {
            align: 'left'
        })


        // Telefone
        doc.fontSize(10).text(`Telefone: ${cliente?.telefone || 'N/A'}`, {
            align: 'left'
        })
        doc.moveDown(1);

        // OS
        doc.fontSize(10).text(`OS: ${formatId(orcamento.ordemServico._id)}`, {
            align: 'left'
        })

        // Equipamento
        doc.fontSize(10).text(`Equipamento: ${equipamento?.marca || 'N/A Marca'} ${equipamento?.modelo || 'N/A Modelo'}`, {
            align: 'left'
        })

        // Problema
        doc.fontSize(10).text(`Problema Reportado: ${orcamento.ordemServico.tituloProblema}`, {
            align: 'left'
        })
        doc.moveDown(1);

        // --- LINHA DIVISÓRIA ---
        doc.fontSize(10).text('------------------------------', {
            align: 'center'
        })
        doc.moveDown(1);

        // --- TÍTULO ITENS E SERVIÇOS ---
        doc.fontSize(25) // Define o tamanho da fonte para o título
            .text('ITENS E SERVIÇOS', {
                align: 'center' // Alinha o texto ao centro
            });
        doc.moveDown(1);


        // --- TABELA DE ITENS (Lógica de Loop) ---




        // 🚨 CABEÇALHOS DA TABELA
        doc.fontSize(10).table({
            data: [
                ['Tipo', 'Descrição', 'Link de Compra', 'Quantidade', 'Valor Unitário', 'Subtotal'],
                ...itens.map(item => [
                    `${item.tipoItem}`,
                    `${item.descricao}`,
                    `${item.linkCompra ? 'Ver Link' : 'N/A'}`,
                    `${item.quantidade.toString()}`,
                    `${formatCurrency(item.valorUnitario)}`,
                    `${formatCurrency(item.subtotal)}`
                ]),
            ],
        })
        doc.moveDown(1);

        // --- LINHA DIVISÓRIA ---
        doc.fontSize(10).text('------------------------------', {
            align: 'center'
        })
        doc.moveDown(1);

        // --- RESUMO FINANCEIRO (Totais) ---

        // TAXA DE SERVIÇO
        doc.fontSize(10).text(`Taxa de Serviço (Mão de obra): ${formatCurrency(orcamento.taxaServico)}`, {
            align: 'right'
        })

        // VALOR TOTAL FINAL
        doc.font('Helvetica-Bold').fontSize(16).text(`VALOR TOTAL FINAL: ${formatCurrency(orcamento.valorTotal)}`, {
            align: 'right'
        })


        // Finaliza o documento
        doc.end();

    } catch (error) {
        console.error('Erro na geração do PDF:', error);
        res.status(500).json({ message: 'Falha na geração do documento PDF.', error: error.message });
    }
};
// ... (Restante das funções: deletarOrcamento, etc.)

module.exports = {
    criarOrcamento,
    listarOrcamentos,
    buscarOrcamento,
    atualizarOrcamento, // 🚨 ATUALIZADO NO EXPORT
    deletarOrcamento,
    gerarPDFOrcamento,
};