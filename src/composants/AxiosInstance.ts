import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Ajoute le token JWT dans chaque requête
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Récupère le token depuis localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
