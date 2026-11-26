export interface PaymentMethod {
  id: number
  name: string
  color: string
  active: boolean
}
export type PaymentMethodPayload = Omit<PaymentMethod, 'id'>
