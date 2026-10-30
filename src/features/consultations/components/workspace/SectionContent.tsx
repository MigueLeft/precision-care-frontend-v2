import { AnthropometrySection } from '@/features/anthropometry'
import { RiskSection } from '@/features/risk'
import { LifeEssential8Section } from '../encounter/LifeEssential8Section'
import { ParaclinicalSection } from '../encounter/ParaclinicalSection'
import { PhysicalExamSection } from '../encounter/PhysicalExamSection'
import { PlaceholderSection } from '../encounter/PlaceholderSection'
import { PreviousConsultationSection } from '../encounter/PreviousConsultationSection'
import { ProblemsSection } from '../encounter/ProblemsSection'
import { TreatmentSection } from '../encounter/TreatmentSection'
import { AntecedentsBoard } from './antecedents/AntecedentsBoard'
import { DeliverablesView } from './DeliverablesView'
import { DiseasesBoard } from './diseases/DiseasesBoard'
import { IntakesView } from './IntakesView'
import { SymptomsBoard } from './symptoms/SymptomsBoard'
import { sectionNumber, type WorkspaceSectionId } from './workspace-sections'
import type { Consultation } from '../../types'

type SectionContentProps = {
  section: WorkspaceSectionId
  consultation: Consultation
  readOnly: boolean
}

// Contenido del panel central para el apartado elegido en el índice.
export function SectionContent({ section, consultation, readOnly }: SectionContentProps) {
  const { id: consultationId, patientId, startAt: consultationDate } = consultation
  const index = sectionNumber(section)

  switch (section) {
    case 'antecedents':
      return <AntecedentsBoard patientId={patientId} consultationId={consultationId} readOnly={readOnly} />
    case 'symptoms':
      return <SymptomsBoard consultationId={consultationId} readOnly={readOnly} />
    case 'diagnoses':
      return <DiseasesBoard consultationId={consultationId} readOnly={readOnly} />
    case 'treatment':
      return <TreatmentSection index={index} consultation={consultation} readOnly={readOnly} />
    case 'anthropometry':
      return (
        <AnthropometrySection
          index={index}
          consultationId={consultationId}
          patientId={patientId}
          consultationDate={consultationDate}
          readOnly={readOnly}
        />
      )
    case 'physicalExam':
      return <PhysicalExamSection index={index} consultation={consultation} readOnly={readOnly} />
    case 'paraclinical':
      return <ParaclinicalSection index={index} patientId={patientId} readOnly={readOnly} />
    case 'risk':
      return <RiskSection index={index} patientId={patientId} consultationId={consultationId} readOnly={readOnly} />
    case 'nutrition':
      return <PlaceholderSection index={index} title="Nutrición" subtitle="Respuestas de ingreso · asignación de plan" />
    case 'lifestyle':
      return <LifeEssential8Section index={index} consultationId={consultationId} patientId={patientId} readOnly={readOnly} />
    case 'problems':
      return <ProblemsSection index={index} consultation={consultation} readOnly={readOnly} />
    case 'previous':
      return <PreviousConsultationSection index={1} consultation={consultation} />
    case 'intakes':
      return <IntakesView patientId={patientId} />
    case 'deliverables':
      return <DeliverablesView consultationId={consultationId} patientId={patientId} readOnly={readOnly} />
  }
}
