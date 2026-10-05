import type { ReactNode } from 'react'
import { Stack } from '@mui/material'
import { PhysicalExamSection } from '@/features/physical-exam'
import { BodyCompositionSection } from '@/features/body-composition'
import { AntecedentsSection } from './AntecedentsSection'
import { PreviousConsultationSection } from './PreviousConsultationSection'
import { SymptomsSection } from './SymptomsSection'
import { TreatmentSection } from './TreatmentSection'
import { DiseasesSection } from './DiseasesSection'
import { ParaclinicalSection } from './ParaclinicalSection'
import type { Consultation } from '../../types'

type EncounterMainSectionsProps = {
  consultation: Consultation
  readOnly: boolean
}

// Contenido principal de la consulta. Primera vez abre con Antecedentes;
// subsecuente abre con la nota de la consulta anterior (los antecedentes pasan
// a la barra lateral). El resto del orden es el mismo y termina en Diagnósticos.
export function EncounterMainSections({ consultation, readOnly }: EncounterMainSectionsProps) {
  const consultationId = consultation.id
  const patientId = consultation.patientId
  const consultationDate = consultation.startAt
  const isSubsequent = consultation.visitType === 'subsequent'

  const sections: ((index: number) => ReactNode)[] = [
    isSubsequent
      ? (index) => (
          <PreviousConsultationSection key="previous" index={index} consultation={consultation} />
        )
      : (index) => (
          <AntecedentsSection
            key="antecedents"
            index={index}
            patientId={patientId}
            consultationId={consultationId}
            consultationDate={consultationDate}
            readOnly={readOnly}
          />
        ),
    (index) => (
      <SymptomsSection
        key="symptoms"
        index={index}
        consultationId={consultationId}
        consultationDate={consultationDate}
        readOnly={readOnly}
      />
    ),
    (index) => (
      <TreatmentSection key="treatment" index={index} consultation={consultation} readOnly={readOnly} />
    ),
    (index) => (
      <PhysicalExamSection
        key="physical-exam"
        index={index}
        consultationId={consultationId}
        patientId={patientId}
        consultationDate={consultationDate}
        readOnly={readOnly}
      />
    ),
    (index) => (
      <BodyCompositionSection
        key="body-composition"
        index={index}
        consultationId={consultationId}
        patientId={patientId}
        consultationDate={consultationDate}
        readOnly={readOnly}
      />
    ),
    (index) => (
      <ParaclinicalSection key="paraclinical" index={index} patientId={patientId} readOnly={readOnly} />
    ),
    // Los diagnósticos cierran la parte médica: se establecen después de revisar
    // síntomas, tratamiento, exploración y estudios.
    (index) => (
      <DiseasesSection
        key="diagnoses"
        index={index}
        consultationId={consultationId}
        consultationDate={consultationDate}
        readOnly={readOnly}
      />
    ),
  ]

  return <Stack spacing={1.5}>{sections.map((render, i) => render(i + 1))}</Stack>
}
