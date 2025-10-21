// gestor-backend/src/controllers/clientesController.js

const Cliente = require('../models/Cliente'); // Importa o Modelo de Cliente

// @desc    Criar um novo Cliente
// @route   POST /api/clientes
const criarCliente = async (req, res) => {
    try {
        const novoCliente = await Cliente.create(req.body);
        res.status(201).json(novoCliente);
    } catch (error) {
        // O Mongoose lida com a validação (email único, campos obrigatórios)
        res.status(400).json({ message: 'Erro ao criar cliente.', error: error.message });
    }
};

// @desc    Listar todos os Clientes
// @route   GET /api/clientes
const listarClientes = async (req, res) => {
    try {
        // .find() é o equivalente do Mongoose ao find().toArray()
        const clientes = await Cliente.find({}); 
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar clientes.', error: error.message });
    }
};

// @desc    Atualizar Cliente
// @route   PUT /api/clientes/:id
const atualizarCliente = async (req, res) => {
    try {
        const clienteAtualizado = await Cliente.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Retorna o novo doc e executa a validação do Schema
        );

        if (!clienteAtualizado) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        res.status(200).json(clienteAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido ou erro de atualização.', error: error.message });
    }
};

// @desc    Deletar Cliente
// @route   DELETE /api/clientes/:id
const deletarCliente = async (req, res) => {
    try {
        const clienteDeletado = await Cliente.findByIdAndDelete(req.params.id);

        if (!clienteDeletado) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        res.status(200).json({ message: 'Cliente deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar cliente.', error: error.message });
    }
};

module.exports = {
    criarCliente,
    listarClientes,
    atualizarCliente,
    deletarCliente,
};