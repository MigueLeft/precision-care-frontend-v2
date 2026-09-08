export { consultationsKeys } from './hooks/consultations.keys'
export {
  fetchConsultationsByPatient,
  fetchConsultation,
  fetchConsultationByAppointment,
  fetchConsultationDiagnoses,
  fetchConsultationSymptoms,
  fetchConsultationSymptomHistory,
} from './services/consultations.service'
export { useConsultationsByPatient } from './hooks/useConsultationsByPatient'
export {
  useConsultation,
  useConsultationByAppointment,
  useConsultationDiagnoses,
  useConsultationSymptoms,
  useConsultationSymptomHistory,
  useUpdateConsultation,
  useReplaceConsultationSymptoms,
} from './hooks/useConsultationDetail'
export { ConsultationsPanel } from './components/ConsultationsPanel'
export { ConsultationEncounterPage } from './components/encounter/ConsultationEncounterPage'
export {
  CONSULTATION_STATUS_LABELS,
  DIAGNOSIS_TYPE_LABELS,
} from './utils/consultation-format'
export type {
  Consultation,
  ConsultationStatus,
  ConsultationDiagnosis,
  ConsultationSymptom,
  ReplaceSymptomInput,
  SymptomHistoryEntry,
  DiagnosisType,
} from './types'
