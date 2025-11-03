// gestor-backend/src/controllers/osController.js

const OrdemServico = require('../models/OrdemServico');
const Orcamento = require('../models/Orcamento');
// @desc    Criar uma nova Ordem de Serviço
// @route   POST /api/os
const criarOS = async (req, res) => {
  try {
    const novaOS = await OrdemServico.create(req.body);
    res.status(201).json(novaOS);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar OS. Verifique os IDs de Cliente, Equipamento e Técnico.', error: error.message });
  }
};

// @desc    Listar todas as Ordens de Serviço
// @route   GET /api/os
const listarOS = async (req, res) => {
  try {
    // Carrega os dados relacionados
    const osList = await OrdemServico.find({})
      .populate('cliente', 'nome') // Nome do Cliente
      .populate('equipamento', 'modelo numSerie') // Modelo e Série do Equipamento
      .populate('tecnicoResponsavel', 'nome'); // Nome do Técnico

    res.status(200).json(osList);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar OS.', error: error.message });
  }
};

// @desc    Atualizar detalhes da OS
// @route   PUT /api/os/:id
const atualizarOS = async (req, res) => {
    try {
        // Se o status for 'Finalizado', adiciona a data de conclusão
        if (req.body.status === 'Finalizado' && !req.body.dataConclusao) {
            req.body.dataConclusao = new Date();
        }

        const osAtualizada = await OrdemServico.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        )
        .populate('cliente', 'nome')
        .populate('equipamento', 'modelo numSerie')
        .populate('tecnicoResponsavel', 'nome');

        if (!osAtualizada) {
            return res.status(404).json({ message: 'OS não encontrada.' });
        }

        res.status(200).json(osAtualizada);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido ou erro de atualização.', error: error.message });
    }
};

// @desc    Deletar OS
// @route   DELETE /api/os/:id
const deletarOS = async (req, res) => {
    try {
        const osDeletada = await OrdemServico.findByIdAndDelete(req.params.id);

        if (!osDeletada) {
            return res.status(404).json({ message: 'OS não encontrada.' });
        }

        res.status(200).json({ message: 'OS deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar OS.', error: error.message });
    }
};

const buscarOS = async (req, res) => {
    try {
        const os = await OrdemServico.findById(req.params.id)
            .populate('cliente', 'nome')
            .populate('equipamento', 'modelo numSerie nome') // Adicionei 'nome'
            .populate('tecnicoResponsavel', 'nome');

        if (!os) {
            return res.status(404).json({ message: 'OS não encontrada.' });
        }
        res.status(200).json(os);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar OS.', error: error.message });
    }
};

const listarOSsemOrcamento = async (req, res) => {
    try {
        // 1. Encontra os IDs de TODAS as OS que JÁ possuem um orçamento
        const osComOrcamento = await Orcamento.find().select('ordemServico');
        
        // Mapeia os IDs para um array simples de ObjectIds
        const idsComOrcamento = osComOrcamento.map(orc => orc.ordemServico);

        // 2. Busca todas as OS que NÃO estão na lista de IDs ($nin)
        const osDisponiveis = await OrdemServico.find({
            _id: { $nin: idsComOrcamento },
            // Filtros de status
            status: { $nin: ['Finalizado', 'Cancelado'] } 
        })
        .populate('cliente', 'nome email')
        .populate('equipamento', 'modelo numSerie')
        .sort({ createdAt: 1 });

        res.status(200).json(osDisponiveis);
        
    } catch (error) {
        // 🚨 O ERRO DO SEU CONSOLE ESTÁ AQUI: O Backend está caindo no catch
        console.error('ERRO INTERNO AO FILTRAR OS SEM ORÇAMENTO:', error); 
        res.status(500).json({ message: 'Falha interna do servidor ao listar OS disponíveis.', error: error.message });
    }
};


// ... exportar a nova função



module.exports = {
    criarOS,
    listarOS,
    atualizarOS,
    deletarOS,
    buscarOS,
    listarOSsemOrcamento,
};