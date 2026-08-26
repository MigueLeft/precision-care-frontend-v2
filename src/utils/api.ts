import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de respuesta: delega el manejo de errores al llamador.
// El toast se dispara en cada hook/service individualmente para contexto específico.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
