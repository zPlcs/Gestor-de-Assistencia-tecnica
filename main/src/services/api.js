import axios from 'axios';

// O Vercel define a variável de ambiente REACT_APP_API_BASE_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL 
                   ? process.env.REACT_APP_API_BASE_URL 
                   : 'http://localhost:3001/api'; 

const api = axios.create({
  baseURL: BASE_URL, 
});

export default api;