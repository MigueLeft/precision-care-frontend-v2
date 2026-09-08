import { z } from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

// Coincide con CreatePatientMedicationSchema del backend (sin patientId/status,
// que agrega el panel).
export const medicationFormSchema = z.object({
  medicationId: z
    .number({ error: 'Selecciona un medicamento.' })
    .int()
    .positive('Selecciona un medicamento.'),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  quantity: z.string().optional(),
  presentation: z.string().optional(),
  startAt: z
    .string()
    .regex(DATE_REGEX, 'La fecha debe tener formato AAAA-MM-DD.')
    .optional()
    .or(z.literal('')),
})

export type MedicationFormValues = z.infer<typeof medicationFormSchema>

export const medicationFormDefaultValues: MedicationFormValues = {
  medicationId: 0,
  frequency: '',
  duration: '',
  quantity: '',
  presentation: '',
  startAt: '',
}
