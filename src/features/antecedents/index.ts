export { antecedentsKeys } from './hooks/antecedents.keys'
export {
  fetchAntecedentsByPatient,
  createAntecedent,
  updateAntecedent,
  deleteAntecedent,
} from './services/antecedents.service'
export { useAntecedentsByPatient } from './hooks/useAntecedentsByPatient'
export { useCreateAntecedent } from './hooks/useCreateAntecedent'
export { useDeleteAntecedent } from './hooks/useDeleteAntecedent'
export { useUpdateAntecedent } from './hooks/useUpdateAntecedent'
export { mapAntecedentToForm, mapFormToUpdatePayload } from './utils/antecedent-mappers'
export type { AntecedentFormValues } from './schemas/antecedent-form.schema'
export { useAntecedentDiseaseOptions } from './hooks/useAntecedentDiseaseOptions'
export { AntecedentsPanel } from './components/AntecedentsPanel'
export { AntecedentListTable } from './components/AntecedentListTable'
export { SurgeryHospitalizationList } from './components/SurgeryHospitalizationList'
export {
  ANTECEDENT_STATUS_LABELS,
  ANTECEDENT_STATUS_COLORS,
  ANTECEDENT_TYPE_LABELS,
} from './utils/antecedent-format'
export { FAMILY_RELATIONSHIPS } from './utils/family-relationships'
export type {
  Antecedent,
  AntecedentType,
  AntecedentStatus,
  AntecedentSurgeryDetail,
  AntecedentHospitalizationDetail,
  CreateAntecedentPayload,
} from './types'
