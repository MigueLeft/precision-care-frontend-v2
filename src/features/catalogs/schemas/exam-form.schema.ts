import { z } from 'zod'

export const examCategoryOptions = ['laboratory', 'imaging', 'cardiology', 'other'] as const
export const examValueTypeOptions = ['numeric', 'text', 'boolean'] as const

export const examFormSchema = z.object({
  name: z.string().min(1, 'El nombre del examen es requerido.'),
  category: z.enum(examCategoryOptions, { error: 'Selecciona una categoría.' }),
  defaultUnit: z.string().optional().or(z.literal('')),
  valueType: z.enum(examValueTypeOptions),
  referenceMin: z.string().optional().or(z.literal('')),
  referenceMax: z.string().optional().or(z.literal('')),
})

export type ExamFormValues = z.infer<typeof examFormSchema>

export const examFormDefaultValues: ExamFormValues = {
  name: '',
  category: 'laboratory',
  defaultUnit: '',
  valueType: 'numeric',
  referenceMin: '',
  referenceMax: '',
}
