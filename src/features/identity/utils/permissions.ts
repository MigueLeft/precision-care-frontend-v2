import type { CurrentUser } from '../services/me.service'

// Códigos de permiso del backend (`modulo:accion`). El backend es quien
// autoriza; aquí solo se ocultan pantallas y acciones que responderían 403.
export function hasPermission(me: CurrentUser | null | undefined, code: string): boolean {
  return !!me?.permissions.includes(code)
}

// Permiso requerido por cada pantalla principal (menú lateral y rutas).
export const PAGE_PERMISSIONS: Record<string, string> = {
  '/pacientes': 'pacientes:read',
  '/citas': 'citas:read',
  '/ingresables': 'ingresables:read',
  '/entregables': 'plantillas_entregable:read',
  '/especialistas': 'especialistas:read',
  // Ver catálogos lo necesita cualquier formulario; administrarlos, no.
  '/catalogos': 'catalogos:update',
  '/usuarios-y-roles': 'usuarios:read',
}

// Permiso de lectura de cada pestaña del expediente (por slug).
export const RECORD_TAB_PERMISSIONS: Record<string, string> = {
  resumen: 'pacientes:read',
  antecedentes: 'antecedentes:read',
  consultas: 'consultas:read',
  notas: 'consultas:read',
  'nota-evolutiva': 'consultas:read',
  sintomas: 'consultas:read',
  enfermedades: 'consultas:read',
  paraclinicos: 'resultados_paraclinico:read',
  medicamentos: 'medicamentos:read',
  antropometria: 'antropometria:read',
  'estilo-de-vida': 'estilo_vida:read',
  riesgo: 'riesgo:read',
  'riesgo-historico': 'riesgo:read',
  ingresables: 'ingresables:read',
  entregables: 'entregables:read',
}
