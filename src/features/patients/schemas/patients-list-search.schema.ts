import { z } from 'zod'

export const patientsListSearchSchema = z.object({
  q: z.string().optional(),
  nationalityCountryId: z.coerce.number().int().positive().optional(),
  patientId: z.coerce.number().int().positive().optional(),
})

export type PatientsListSearch = z.infer<typeof patientsListSearchSchema>
