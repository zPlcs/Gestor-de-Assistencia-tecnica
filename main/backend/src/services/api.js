// gestor-backend/src/services/api.js (VERSÃO LIMPA E FINAL)

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

// 🚨 O Interceptor deve ser o ÚNICO responsável por ler o Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');

        // Garante que headers é um objeto e injeta o Token lido
        config.headers = config.headers || {}; 

        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        
        return config;
    },
    (error) => {
        // Se a chamada falhar, redirecionamos para o login (opcional, mas útil)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Se for 401/403, limpa o token e força o login
            localStorage.removeItem('userToken');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;