import { z } from 'zod'

export const appointmentTypeOptions = [
  'first_consultation',
  'with_specialist',
  'follow_up',
] as const

// La duración se ingresa como número en minutos, en pasos de 5.
export const DURATION_STEP_MIN = 5
export const DURATION_MIN = 5
export const DURATION_MAX = 480

function todayIsoDate() {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD en hora local
}

const baseAppointmentFormSchema = z.object({
  patientId: z
    .number({ error: 'Selecciona un paciente.' })
    .int()
    .positive('Selecciona un paciente.'),
  specialistId: z
    .number({ error: 'Selecciona un especialista.' })
    .int()
    .positive('Selecciona un especialista.'),
  modality: z.enum(['in_person', 'telemedicine']),
  type: z.enum(appointmentTypeOptions),
  date: z
    .string()
    .min(1, 'La fecha es requerida.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida.'),
  time: z
    .string()
    .min(1, 'La hora es requerida.')
    .regex(/^\d{2}:\d{2}$/, 'Hora inválida.'),
  durationMin: z
    .number({ error: 'Ingresa la duración en minutos.' })
    .int('La duración debe ser un número entero.')
    .min(DURATION_MIN, `Mínimo ${DURATION_MIN} minutos.`)
    .max(DURATION_MAX, `Máximo ${DURATION_MAX} minutos.`)
    .refine(
      (v) => v % DURATION_STEP_MIN === 0,
      `La duración debe ser múltiplo de ${DURATION_STEP_MIN} minutos.`,
    ),
  reason: z.string().optional(),
  telemedicineLink: z.string().url('Enlace inválido.').optional().or(z.literal('')),
  location: z.string().optional(),
  remindEmail: z.boolean(),
})

export function getAppointmentFormSchema(mode: 'create' | 'edit') {
  if (mode === 'edit') return baseAppointmentFormSchema
  return baseAppointmentFormSchema.refine((v) => v.date >= todayIsoDate(), {
    message: 'No se pueden agendar citas en fechas pasadas.',
    path: ['date'],
  })
}

export type AppointmentFormValues = z.infer<typeof baseAppointmentFormSchema>

export const appointmentFormDefaultValues: AppointmentFormValues = {
  patientId: 0,
  specialistId: 0,
  modality: 'in_person',
  type: 'first_consultation',
  date: '',
  time: '09:00',
  durationMin: 30,
  reason: '',
  telemedicineLink: '',
  location: '',
  remindEmail: true,
}
