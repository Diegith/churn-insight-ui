import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Cambia esto si tu Spring Boot usa otro puerto
});

// Interceptor para pegar el token en cada llamada
api.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData && userData.token) {
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

export default api;