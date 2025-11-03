// Accede a la variable de entorno definida en .env
// En Vite: import.meta.env.VITE_API_BASE_URL
// En Create React App: process.env.REACT_APP_API_BASE_URL
// Asegúrate de usar el prefijo correcto según tu configuración.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

export { API_BASE_URL };