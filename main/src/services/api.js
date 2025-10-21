// src/services/api.js

import axios from 'axios';

// A baseURL é o endereço do seu servidor Node/Express
const api = axios.create({
  baseURL: 'http://localhost:3001/api', 
});

export default api;