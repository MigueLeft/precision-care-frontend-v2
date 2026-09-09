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
export { usePatientSymptoms } from './hooks/usePatientSymptoms'
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
export { PatientSymptomsPanel } from './components/PatientSymptomsPanel'
export { ConsultationEncounterPage } from './components/encounter/ConsultationEncounterPage'
export {
  CONSULTATION_STATUS_LABELS,
  DIAGNOSIS_TYPE_LABELS,
  DISEASE_STATUS_LABELS,
  DISEASE_STATUS_COLORS,
  ACTIVE_DISEASE_STATUSES,
} from './utils/consultation-format'
export type {
  Consultation,
  ConsultationStatus,
  ConsultationDiagnosis,
  ConsultationSymptom,
  ReplaceSymptomInput,
  SymptomHistoryEntry,
  DiagnosisType,
  DiseaseStatus,
} from './types'
