import { Grid, Stack } from '@mui/material'
import { MANDATORY_SYSTEMS, PHYSICAL_EXAM_SYSTEMS } from '../config'
import { usePhysicalExam } from '../hooks/usePhysicalExam'
import type { AlteredVital, PhysicalExam } from '../types'
import { findElement } from '../utils/config-lookup'
import { buildNarrative } from '../utils/narrative'
import { countErrors } from '../utils/validation'
import { ExamToolbar } from './ExamToolbar'
import { NarrativePanel } from './NarrativePanel'
import { SystemCard } from './SystemCard'

type PhysicalExamFormProps = {
  saved: PhysicalExam | null
  sex: 'male' | 'female' | null
  alteredVitals: AlteredVital[]
  readOnly: boolean
  onChange: (exam: PhysicalExam) => void
}

// Examen físico: 13 sistemas (Sistema → Elemento → Hallazgo) y la narrativa
// generada en vivo a un lado (debajo en pantallas chicas).
export function PhysicalExamForm({ saved, sex, alteredVitals, readOnly, onChange }: PhysicalExamFormProps) {
  const api = usePhysicalExam({ saved, sex, ctx: { alteredVitals }, onChange })
  const { exam, errors } = api
  const lines = buildNarrative(exam).lines
  const documented = exam.sistemas.filter((s) => s.estado !== 'SIN_DOCUMENTAR').length
  const pendingMandatory = MANDATORY_SYSTEMS.filter(
    (code) => exam.sistemas.find((s) => s.codigo === code)?.estado === 'SIN_DOCUMENTAR',
  ).length
  // Conciencia alterada en Estado general → Glasgow en Neurológico.
  const showGlasgow = findElement(exam, { system: 'GENERAL', element: 'CONCIENCIA' })?.estado === 'A'

  function reviewFirst() {
    const first = PHYSICAL_EXAM_SYSTEMS.find((system) => errors[system.code])
    document.getElementById(`exam-system-${first?.code}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 8 }}>
        <ExamToolbar
          documented={documented}
          total={PHYSICAL_EXAM_SYSTEMS.length}
          pendingMandatory={pendingMandatory}
          warnings={countErrors(errors)}
          readOnly={readOnly}
          onAllNormal={api.setAllNormal}
          onReview={reviewFirst}
        />
        <Stack spacing={1}>
          {PHYSICAL_EXAM_SYSTEMS.map((config, index) => {
            const data = exam.sistemas.find((s) => s.codigo === config.code)
            if (!data) return null
            return (
              <SystemCard
                key={config.code}
                config={config}
                data={data}
                index={index + 1}
                narrative={lines.find((line) => line.code === config.code)?.text}
                errors={errors[config.code] ?? []}
                mandatory={MANDATORY_SYSTEMS.includes(config.code)}
                api={api}
                readOnly={readOnly}
                lockedAbnormal={(system, element) =>
                  alteredVitals.length > 0 && system === 'GENERAL' && element === 'SIGNOS_VITALES'
                }
                showGlasgow={showGlasgow}
              />
            )
          })}
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <NarrativePanel exam={exam} readOnly={readOnly} onEdit={api.setFinalNarrative} onReset={api.resetNarrative} />
      </Grid>
    </Grid>
  )
}
