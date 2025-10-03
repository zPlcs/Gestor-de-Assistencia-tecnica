import axios from 'axios';

// Instância base do Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Pega do .env
});

// Funções de Serviço para a tabela Clientes (Exemplo)
export const ClienteService = {
  // GET: /api/v1/clientes
  getAllClientes: () => api.get('/clientes'),

  // POST: /api/v1/clientes
  createCliente: (clienteData) => api.post('/clientes', clienteData),

  // PUT: /api/v1/clientes/{id}
  updateCliente: (id, clienteData) => api.put(`/clientes/${id}`, clienteData),

  // DELETE: /api/v1/clientes/{id}
  deleteCliente: (id) => api.delete(`/clientes/${id}`),
};

// Funções de Serviço para a tabela OS, Funcionários, etc.
// export const OrdemServicoService = {...}