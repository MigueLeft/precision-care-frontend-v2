export const MODULE_ORDER = [
  'pacientes',
  'citas',
  'consultas',
  'antecedentes',
  'medicamentos',
  'resultados_paraclinico',
  'ordenes_paraclinico',
  'examenes_fisicos',
  'composicion_corporal',
  'estilo_vida',
  'prescripciones',
  'plantillas_nota',
  'plantillas_entregable',
  'entregables',
  'ingresables',
  'especialistas',
  'catalogos',
  'usuarios',
  'roles',
  'permisos',
]

const MODULE_LABELS: Record<string, string> = {
  composicion_corporal: 'Composición corporal',
  antecedentes: 'Antecedentes',
  especialistas: 'Especialistas',
  citas: 'Citas',
  catalogos: 'Catálogos',
  plantillas_entregable: 'Plantillas de entregable',
  entregables: 'Entregables',
  pacientes: 'Pacientes',
  estilo_vida: 'Estilo de vida',
  resultados_paraclinico: 'Resultados de paraclínico',
  ordenes_paraclinico: 'Órdenes de paraclínico',
  prescripciones: 'Prescripciones',
  consultas: 'Consultas',
  medicamentos: 'Medicamentos',
  plantillas_nota: 'Plantillas de nota',
  examenes_fisicos: 'Examen físico',
  permisos: 'Permisos',
  roles: 'Roles',
  usuarios: 'Usuarios',
  ingresables: 'Ingresables',
}

export function getModuleLabel(module: string): string {
  return MODULE_LABELS[module] ?? module
}

const ACTION_LABELS: Record<string, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Editar',
  delete: 'Eliminar',
}

export function getActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action
}
