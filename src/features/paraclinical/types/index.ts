export type ParaclinicalValueStatus = 'normal' | 'high' | 'low' | 'critical'

export type ParaclinicalOrderStatus = 'pending' | 'completed' | 'cancelled'

export interface ParaclinicalResultValue {
  paraclinicalCatalogId: number
  paraclinicalName: string | null
  numericValue: string | null
  textValue: string | null
  unit: string | null
  referenceMin: string | null
  referenceMax: string | null
  status: ParaclinicalValueStatus | null
}

export interface ParaclinicalResult {
  id: number
  patientId: number
  paraclinicalOrderId: number | null
  resultDate: string
  laboratory: string | null
  documentS3Key: string | null
  values: ParaclinicalResultValue[]
  createdAt: string
  updatedAt: string
}

export interface ParaclinicalOrderItem {
  paraclinicalCatalogId: number
  paraclinicalName: string | null
  instructions: string | null
}

export interface CreateParaclinicalResultValueInput {
  paraclinicalCatalogId: number
  numericValue?: number
  textValue?: string
  unit?: string
  referenceMin?: number
  referenceMax?: number
  status?: ParaclinicalValueStatus
}

export interface CreateParaclinicalResultInput {
  patientId: number
  resultDate: string
  laboratory?: string
  values: CreateParaclinicalResultValueInput[]
}

export interface ParaclinicalOrder {
  id: number
  patientId: number
  consultationId: number | null
  requestedById: number
  orderDate: string
  status: ParaclinicalOrderStatus
  deliverableId: number | null
  items: ParaclinicalOrderItem[]
  createdAt: string
  updatedAt: string
}
