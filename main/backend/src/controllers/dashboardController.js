// gestor-backend/src/controllers/dashboardController.js

const OrdemServico = require('../models/OrdemServico');
const Cliente = require('../models/Cliente');
const Funcionario = require('../models/Funcionario');

// @desc    Obter todos os KPIs e dados para o Dashboard
// @route   GET /api/dashboard/kpis
const getDashboardData = async (req, res) => {
    try {
        // 1. Métricas de Contagem
        const osEmAberto = await OrdemServico.countDocuments({
            status: { $in: ['Aberto', 'Em Análise', 'Em Reparo', 'Aguardando Peça', 'Aguardando Aprovação'] }
        });
        const totalClientes = await Cliente.countDocuments();

        // 2. OS Concluídas no Mês (Usando a data de criação para simplificar)
        const trintaDiasAtras = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const osConcluidasMes = await OrdemServico.countDocuments({
            status: 'Finalizado',
            createdAt: { $gte: trintaDiasAtras }
        });

        const osConcluidas = await OrdemServico.find({
            status: 'Finalizado',
        });

        const osCanceladas = await OrdemServico.find({
            status: 'Cancelado',
        });

        // 3. Tabela de OSs Urgentes (Prioridade Alta ou Crítica)
        const osUrgentes = await OrdemServico.find({
            status: { $nin: ['Finalizado', 'Cancelado'] }, // Não finalizadas
            prioridade: { $in: ['Alta', 'Crítica'] }
        })
            .limit(5)
            .sort({ prioridade: -1, createdAt: 1 }) // Mais críticas primeiro, depois mais antigas
            .populate('cliente', 'nome')
            .select('tituloProblema status prioridade cliente');

        // 4. Tabela de Próximas Entregas (Previsão nos próximos 7 dias)
        const seteDiasFrente = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const osProximasEntregas = await OrdemServico.find({
            status: { $nin: ['Finalizado', 'Cancelado'] },
            previsaoEntrega: { $lte: seteDiasFrente } // Entregas até 7 dias
        })
            .limit(5)
            .sort({ previsaoEntrega: 1 }) // Mais urgentes (data mais próxima) primeiro
            .populate('cliente', 'nome')
            .select('tituloProblema status previsaoEntrega cliente');

        // 5. Ranking de Técnicos (Exemplo com Aggregate para contagem)
        const rankingTecnicos = await OrdemServico.aggregate([
            { $match: { status: 'Finalizado', dataConclusao: { $gte: trintaDiasAtras } } },
            { $group: { _id: '$tecnicoResponsavel', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 },
            { $lookup: { from: 'funcionarios', localField: '_id', foreignField: '_id', as: 'tecnicoInfo' } },
            { $unwind: '$tecnicoInfo' },
            { $project: { _id: 0, nome: '$tecnicoInfo.nome', count: 1 } }
        ]);


        res.json({
            osEmAberto,
            totalClientes,
            osConcluidasMes,
            osUrgentes,
            osProximasEntregas,
            rankingTecnicos,
            osConcluidas,
            osCanceladas
            // Média de Dias para Conclusão viria aqui, mas exige uma query Aggregate mais complexa
        });

    } catch (error) {
        console.error('Erro ao buscar dados do Dashboard:', error);
        res.status(500).json({ message: 'Falha ao carregar dados do Dashboard.', error: error.message });
    }
};

module.exports = { getDashboardData };