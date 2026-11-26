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
  paymentDate: string | null
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
export type PaymentPayload = PricingPayload & { paymentMethodId: number; paymentDate: string }

export interface AccountingTransaction {
  id: number
  appointmentId: number
  appointmentDate: string | null
  paymentDate: string
  registeredAt: string
  status: 'paid' | 'voided'
  voidReason: string | null
  patientName: string
  specialistName: string | null
  basePrice: number
  discountPercent: number
  amount: number
  paymentMethodName: string | null
  paymentMethodColor: string | null
}
export interface AccountingTransactionsList {
  transactions: AccountingTransaction[]
  total: number
  page: number
  pageSize: number
}
export type AccountingTransactionFilters = {
  page: number
  pageSize: number
  status: 'all' | 'paid' | 'voided'
  from: string
  to: string
}
