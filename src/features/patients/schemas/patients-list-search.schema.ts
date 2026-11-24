import { z } from 'zod'

export const patientsListSearchSchema = z.object({
  q: z.string().max(200, 'La búsqueda no debe superar los 200 caracteres.').optional(),
  nationalityCountryId: z.coerce.number().int().positive().optional(),
  patientId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
})

export type PatientsListSearch = z.infer<typeof patientsListSearchSchema>
