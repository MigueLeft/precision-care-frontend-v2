import { z } from 'zod'

export const roleFormSchema = z.object({
  name: z.string().min(1, 'El nombre del rol es requerido.'),
  description: z.string().optional().or(z.literal('')),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>

export const roleFormDefaultValues: RoleFormValues = {
  name: '',
  description: '',
}
