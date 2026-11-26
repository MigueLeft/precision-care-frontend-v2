import { z } from 'zod'

export const pricingSchema = z.object({
  basePrice: z.number({ error: 'Ingresa un precio.' }).finite().min(0).max(99999999.99).multipleOf(0.01),
  discountPercent: z.number().finite().min(0).max(100).multipleOf(0.01),
})
export const paymentSchema = pricingSchema.extend({ paymentMethodId: z.number().int().positive('Selecciona un método de pago.') })
