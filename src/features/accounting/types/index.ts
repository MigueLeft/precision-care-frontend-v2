export interface AccountingAppointment {
  id: number
  startAtUtc: string
  status: string
  patientName: string
  specialistId: number | null
  specialistName: string | null
  basePrice: number | null
  discountPercent: number
  total: number | null
  paidAt: string | null
  paidAmount: number | null
  paymentMethodName: string | null
  paymentMethodColor: string | null
  paidSpecialistName: string | null
}
export interface AccountingList {
  appointments: AccountingAppointment[]
  total: number
  page: number
  pageSize: number
}
export interface AccountingGroup {
  id: number
  name: string
  amount: number
  count: number
  color?: string
}
export interface AccountingReport {
  income: number
  paidCount: number
  discounts: number
  specialists: AccountingGroup[]
  methods: AccountingGroup[]
  receivables: { amount: number; count: number; unpricedCount: number }
}
export type AccountingFilters = { page: number; pageSize: number; status: 'all' | 'paid' | 'unpaid' }
export type PricingPayload = { basePrice: number; discountPercent: number }
export type PaymentPayload = PricingPayload & { paymentMethodId: number }
