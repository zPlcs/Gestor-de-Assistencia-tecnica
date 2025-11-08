// gestor-backend/src/services/api.js (VERSÃO LIMPA E FINAL)

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

export default api;