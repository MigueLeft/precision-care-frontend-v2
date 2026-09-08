import { z } from 'zod'

export const appointmentTypeOptions = [
  'first_consultation',
  'with_specialist',
  'follow_up',
] as const

export const durationOptions = [15, 30, 45, 60, 90] as const

export const appointmentFormSchema = z.object({
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
  durationMin: z.number().int().positive(),
  reason: z.string().optional(),
  telemedicineLink: z.string().url('Enlace inválido.').optional().or(z.literal('')),
  location: z.string().optional(),
  remindEmail: z.boolean(),
})

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

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
