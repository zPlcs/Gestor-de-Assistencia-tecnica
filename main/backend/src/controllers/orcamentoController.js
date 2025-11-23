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

        // Funções auxiliares
        const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
        const formatId = (id) => id ? id.toString().substring(0, 6).toUpperCase() : 'N/A';
        const docWidth = 550;

        // --- BLOCO DE CABEÇALHO/LOGO (Conforme PDF) ---
        // Ponto de início para o conteúdo do cliente
        let detailsY = 150;

        doc.fontSize(24).fillColor('#333').text('PatLab', 50, 80); // [cite, 2]
        doc.fontSize(10).fillColor('#555').text('Assistência Técnica de Computação', 50, 105);[cite, 2]

        doc.fontSize(18).fillColor('#333').text('ORÇAMENTO DE SERVIÇO', 50, detailsY - 30, { align: 'center', width: 500 });[cite, 3]

        // --- DETALHES DE EMISSÃO (Lado Direito) ---
        doc.fontSize(8).fillColor('#666');
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, 350, 60, { align: 'right', width: 200 });[cite, 4]
        doc.text(`Orçamento ID: ${formatId(orcamento._id)}`, 350, 75, { align: 'right', width: 200 });[cite, 5]
        doc.moveDown(2);


        doc.strokeColor('#ccc').lineWidth(1).moveTo(50, detailsY).lineTo(docWidth, detailsY).stroke();
        doc.moveDown(0.5);

        // --- DADOS DO CLIENTE E OS (Pós Linha) ---
        doc.fontSize(10).fillColor('#333');
        const cliente = orcamento.ordemServico.cliente;
        const equipamento = orcamento.ordemServico.equipamento;

        // Informações em 2 colunas (Labels exatas do PDF)
        doc.text(`Cliente: ${cliente?.nome || 'N/A'}`, 50, doc.y + 5);[cite, 6]
        doc.text(`Telefone: ${cliente?.telefone || 'N/A'}`, 350, doc.y - 12);[cite, 7]

        doc.text(`OS: ${formatId(orcamento.ordemServico._id)}`, 350, doc.y + 2);[cite, 8]

        // Linha do Equipamento e Problema
        doc.text(`Equipamento: ${equipamento?.marca || 'N/A'} ${equipamento?.modelo || 'N/A'}`, 50, doc.y + 5);[cite, 9]
        doc.text(`Problema Reportado: ${orcamento.ordemServico.tituloProblema}`, 50, doc.y + 15);[cite, 10]
        doc.moveDown(2);

        // ----------------------------------------------------
        // --- TABELA DE ITENS (Lógica de Loop) ---
        // ----------------------------------------------------

        doc.fontSize(12).fillColor('#000').text('ITENS E SERVIÇOS', { align: 'left', underline: true });[cite, 12]
        doc.moveDown(0.5);

        const tableTop = doc.y;
        doc.fontSize(9).fillColor('#333');

        // Posições X para as colunas (6 COLUNAS)
        const colX = { tipo: 50, descricao: 100, link: 270, qtd: 360, vUnit: 410, subtotal: 480 };
        const colW = { tipo: 40, descripcion: 170, link: 90, qtd: 40, vUnit: 50, subtotal: 70 };


        // Cabeçalhos da Tabela (Labels exatas do PDF) [cite, 11]
        doc.font('Helvetica-Bold').text('Tipo', colX.tipo, tableTop, { width: colW.tipo });
        doc.text('Descrição', colX.descricao, tableTop, { width: colW.descripcion });
        doc.text('Link de compra', colX.link, tableTop, { width: colW.link });
        doc.text('Qtd', colX.qtd, tableTop, { width: colW.qtd, align: 'right' });
        doc.text('V. Unit.', colX.vUnit, tableTop, { width: colW.vUnit, align: 'right' });
        doc.text('Subtotal', colX.subtotal, tableTop, { width: colW.subtotal, align: 'right' });

        doc.font('Helvetica');
        doc.moveDown(0.2);
        doc.strokeColor('#ccc').lineWidth(0.5).moveTo(50, doc.y).lineTo(docWidth, doc.y).stroke();
        doc.moveDown(0.2);

        let currentY = doc.y;
        doc.fontSize(9).fillColor('#444');

        itens.forEach(item => {
            const descriptionHeight = doc.heightOfString(item.descricao, { width: colW.descripcion });
            const lineHeight = Math.max(descriptionHeight, 15);

            // Checagem de quebra de página
            if (currentY + lineHeight > 750) {
                doc.addPage();
                currentY = 50;
            }

            // Desenha o conteúdo principal do item
            doc.text(item.tipoItem, colX.tipo, currentY, { width: colW.tipo });
            doc.text(item.descricao, colX.descripcion, currentY, { width: colW.descripcion });

            // EXIBIÇÃO DO LINK (Com hiperlink)
            doc.fillColor(item.linkCompra ? '#007bff' : '#444').text(
                item.linkCompra ? 'Ver Link' : 'N/A',
                colX.link,
                currentY,
                {
                    width: colW.link,
                    link: item.linkCompra,
                    underline: !!item.linkCompra
                }
            );
            doc.fillColor('#444'); // Volta a cor padrão

            // Valores numéricos
            doc.text(item.quantidade.toString(), colX.qtd, currentY, { width: colW.qtd, align: 'right' });
            doc.text(formatCurrency(item.valorUnitario), colX.vUnit, currentY, { width: colW.vUnit, align: 'right' });
            doc.text(formatCurrency(item.subtotal), colX.subtotal, currentY, { width: colW.subtotal, align: 'right' });

            currentY += lineHeight + 5;
            doc.y = currentY;
        });

        doc.strokeColor('#ccc').lineWidth(0.5).moveTo(50, doc.y).lineTo(docWidth, doc.y).stroke();
        doc.moveDown(1);

        // ----------------------------------------------------
        // --- RESUMO FINANCEIRO (Totais - Conforme PDF) ---
        // ----------------------------------------------------

        // TAXA DE SERVIÇO [cite, 13]
        doc.fontSize(10).fillColor('#000').text('Taxa de Serviço (Mão de obra):', 300, doc.y, { width: 180, align: 'right' });
        doc.text(formatCurrency(orcamento.taxaServico), 480, doc.y, { width: 70, align: 'right' });
        doc.moveDown(0.5);

        // VALOR TOTAL FINAL
        doc.font('Helvetica-Bold').fontSize(12).fillColor('#000').text('VALOR TOTAL FINAL:', 350, doc.y, { width: 130, align: 'right' });[cite, 13]
        doc.text(formatCurrency(orcamento.valorTotal), 480, doc.y, { width: 70, align: 'right' });
        doc.moveDown(2);

        doc.font('Helvetica'); // Volta à fonte normal

        // --- OBSERVAÇÕES ---
        doc.fontSize(10).fillColor('#333').text('Observações e Termos:', 50, doc.y);
        doc.fontSize(9).fillColor('#666').text(orcamento.observacoes || 'Nenhuma observação registrada.', 50, doc.y + 5, { width: 500 });
        doc.moveDown(2);


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