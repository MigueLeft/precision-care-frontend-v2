export { physicalExamKeys } from './hooks/physical-exam.keys'
export {
  fetchPhysicalExamsByPatient,
  fetchPhysicalExamByConsultation,
} from './services/physical-exam.service'
export {
  usePhysicalExamsByPatient,
  usePhysicalExamByConsultation,
  useSavePhysicalExam,
  useUpdatePhysicalExam,
} from './hooks/usePhysicalExams'
export {
  PHYSICAL_EXAM_PARAMS,
  computePhysicalExam,
  type PhysicalExamParam,
} from './config'
export { PhysicalExamSection } from './components/PhysicalExamSection'
export { PhysicalExamPanel } from './components/PhysicalExamPanel'
export type {
  PhysicalExam,
  VitalSigns,
  PhysicalExamMeasurements,
  SavePhysicalExamInput,
} from './types'
