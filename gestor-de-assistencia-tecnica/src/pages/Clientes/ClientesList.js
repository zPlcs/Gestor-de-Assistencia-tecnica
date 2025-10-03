import React, { useState, useEffect } from 'react';
import { ClienteService } from '../../api/apiService';

function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      // Chamada GET para a API FastAPI
      const response = await ClienteService.getAllClientes();
      setClientes(response.data);
    } catch (err) {
      setError('Erro ao carregar clientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando clientes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Cadastro de Clientes</h2>
      {/* Botão para adicionar novo cliente */}
      <button>Adicionar Cliente</button>
      
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF/CNPJ</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.cpf_cnpj}</td>
              <td>{cliente.email}</td>
              <td>
                <button onClick={() => console.log('Editar', cliente.id)}>Editar</button>
                {/* Lógica de Deletar com ClienteService.deleteCliente(cliente.id) */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientesList;