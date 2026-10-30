import axios from 'axios'
// Bandeja de salida en localStorage (desactivada: el respaldo de la consulta vive en el backend).
// import { installConsultationOutbox } from './consultation-outbox'

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

// Respaldo local de lo que se envía desde una consulta en curso (desactivado).
// installConsultationOutbox(api)
