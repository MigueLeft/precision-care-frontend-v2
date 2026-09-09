export { bodyCompositionKeys } from './hooks/body-composition.keys'
export {
  fetchBodyCompositionsByPatient,
  fetchBodyCompositionByConsultation,
} from './services/body-composition.service'
export {
  useBodyCompositionsByPatient,
  useBodyCompositionByConsultation,
  useSaveBodyComposition,
} from './hooks/useBodyComposition'
export { BodyCompositionPanel } from './components/BodyCompositionPanel'
export { BodyCompositionSection } from './components/BodyCompositionSection'
export {
  BODY_SEGMENT_LABELS,
  getLatestBodyComposition,
  getSegment,
} from './utils/body-composition-helpers'
export { SEGMENTS, SEGMENT_LABELS, GENERAL_PARAMS, SEGMENT_PARAMS } from './config'
export type {
  BodyComposition,
  BodyCompositionSegment,
  BodySegment,
  SegmentInput,
  SaveBodyCompositionInput,
} from './types'
