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
export { AntecedentsPanel } from './components/AntecedentsPanel'
export { AntecedentListTable } from './components/AntecedentListTable'
export { SurgeryHospitalizationList } from './components/SurgeryHospitalizationList'
export {
  ANTECEDENT_STATUS_LABELS,
  ANTECEDENT_STATUS_COLORS,
  ANTECEDENT_TYPE_LABELS,
} from './utils/antecedent-format'
export {
  isMockAntecedent,
  MOCK_FAMILY_ANTECEDENTS,
  MOCK_PERSONAL_ANTECEDENTS,
  MOCK_SURGICAL_ANTECEDENTS,
} from './utils/antecedent-mock'
export type {
  Antecedent,
  AntecedentType,
  AntecedentStatus,
  AntecedentSurgeryDetail,
  AntecedentHospitalizationDetail,
  CreateAntecedentPayload,
} from './types'
