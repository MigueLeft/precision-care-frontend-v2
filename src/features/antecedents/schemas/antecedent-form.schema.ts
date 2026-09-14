import { z } from 'zod'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const optionalDate = z
  .string()
  .regex(DATE_REGEX, 'La fecha debe tener formato AAAA-MM-DD.')
  .optional()
  .or(z.literal(''))

// Un único formulario cubre los cinco tipos; el mapper decide qué enviar.
export const antecedentFormSchema = z
  .object({
    type: z.enum(['family', 'personal', 'surgery', 'hospitalization', 'other']),
    name: z.string().min(1, 'El nombre es requerido.'),
    eventDate: optionalDate,
    description: z.string().optional(),
    cie10Code: z.string().optional(),
    relationship: z.string().optional(),
    status: z
      .enum(['active', 'in_follow_up', 'resolved', 'inactive'])
      .optional(),
    // Ids resueltos contra los catálogos vía CatalogSearchInput (opcional:
    // se limpian cuando `type` cambia o cuando se escribe manualmente).
    familyCatalogId: z.number().int().positive().optional(),
    personalCatalogId: z.number().int().positive().optional(),
    surgeryProcedureCatalogId: z.number().int().positive().optional(),
    hospitalizationReasonCatalogId: z.number().int().positive().optional(),
    // Detalle de cirugía
    surgeryProcedure: z.string().optional(),
    surgeryInstitution: z.string().optional(),
    surgeryComplications: z.string().optional(),
    surgeryTreatingPhysician: z.string().optional(),
    // Detalle de hospitalización
    hospitalizationAdmissionDate: optionalDate,
    hospitalizationDischargeDate: optionalDate,
    hospitalizationReason: z.string().optional(),
    hospitalizationInstitution: z.string().optional(),
    hospitalizationDischargeDiagnosisCie10: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'family' && !data.relationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['relationship'],
        message: 'El parentesco es requerido para antecedentes familiares.',
      })
    }
  })

export type AntecedentFormValues = z.infer<typeof antecedentFormSchema>

export const antecedentFormDefaultValues: AntecedentFormValues = {
  type: 'personal',
  name: '',
  eventDate: '',
  description: '',
  cie10Code: '',
  relationship: '',
  status: undefined,
  familyCatalogId: undefined,
  personalCatalogId: undefined,
  surgeryProcedureCatalogId: undefined,
  hospitalizationReasonCatalogId: undefined,
  surgeryProcedure: '',
  surgeryInstitution: '',
  surgeryComplications: '',
  surgeryTreatingPhysician: '',
  hospitalizationAdmissionDate: '',
  hospitalizationDischargeDate: '',
  hospitalizationReason: '',
  hospitalizationInstitution: '',
  hospitalizationDischargeDiagnosisCie10: '',
}
