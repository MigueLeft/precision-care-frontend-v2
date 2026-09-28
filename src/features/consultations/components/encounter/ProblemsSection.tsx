import { useEffect, useRef, useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import {
  useConsultationSymptoms,
  useUpdateConsultation,
} from '../../hooks/useConsultationDetail'
import { useConsultationDiseases } from '../../hooks/useConsultationDiseases'
import { ProblemsList } from './ProblemsList'
import {
  DISEASE_STATUS_LABELS,
  formatSymptomDiseases,
} from '../../utils/consultation-format'
import type {
  Consultation,
  ConsultationDisease,
  ConsultationProblems,
  ConsultationSymptom,
} from '../../types'

// "Hipertensión arterial (I10) — Activa"
const diseaseNote = (disease: ConsultationDisease) =>
  `${disease.name ?? '—'}${disease.code ? ` (${disease.code})` : ''} — ${DISEASE_STATUS_LABELS[disease.status]}`

// "Cefalea (Moderada) — Migraña (Bajo investigación) · HTA (Descartado)"
const symptomNote = (symptom: ConsultationSymptom) =>
  [
    `${symptom.name}${symptom.severityName ? ` (${symptom.severityName})` : ''}`,
    symptom.diseases.length > 0 ? formatSymptomDiseases(symptom.diseases) : null,
  ]
    .filter(Boolean)
    .join(' — ')

interface ProblemsSectionProps {
  index: number
  consultation: Consultation
  readOnly: boolean
}

// "Notas de diagnósticos" del Cierre Clínico (se guarda en consultation.problems):
// el sistema las precarga con los síntomas + diagnósticos de esta consulta y cada
// nota se puede editar para agregar detalles.
export function ProblemsSection({ index, consultation, readOnly }: ProblemsSectionProps) {
  const consultationId = consultation.id
  const { data: symptoms = [] } = useConsultationSymptoms(consultationId)
  const { data: diseases = [] } = useConsultationDiseases(consultationId)
  const update = useUpdateConsultation(consultationId)

  const seeded = useRef(false)
  const [problems, setProblems] = useState<ConsultationProblems>(() =>
    consultation.problems ?? { actuales: [], previos: [] },
  )
  const [tab, setTab] = useState(0)

  const save = useDebouncedCallback((next: ConsultationProblems) => {
    update.mutate({ problems: next })
  }, 700)

  // Precarga única: si aún no hay problemas guardados, sembrar con la captura.
  useEffect(() => {
    if (
      seeded.current ||
      readOnly ||
      consultation.problems ||
      (symptoms.length === 0 && diseases.length === 0)
    ) {
      return
    }
    seeded.current = true
    const actuales = [
      ...diseases.map(diseaseNote),
      ...symptoms.filter((s) => s.name).map(symptomNote),
    ]
    const next = { actuales, previos: [] as string[] }
    setProblems(next)
    save(next)
  }, [readOnly, consultation.problems, symptoms, diseases, save])

  const commit = (next: ConsultationProblems) => {
    setProblems(next)
    save(next)
  }

  return (
    <CollapsibleSection
      title={`${index}. Notas de diagnósticos`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {problems.actuales.length + problems.previos.length}
        </Typography>
      }
      defaultExpanded
    >
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 2, minHeight: 34, '& .MuiTab-root': { minHeight: 34, fontSize: '13px' } }}
      >
        <Tab label={`Actuales (${problems.actuales.length})`} />
        <Tab label={`Previos (${problems.previos.length})`} />
      </Tabs>

      <Box hidden={tab !== 0}>
        <ProblemsList
          items={problems.actuales}
          readOnly={readOnly}
          placeholder="Agregar nota…"
          emptyLabel="Sin notas de diagnóstico."
          onChange={(actuales) => commit({ ...problems, actuales })}
        />
      </Box>
      <Box hidden={tab !== 1}>
        <ProblemsList
          items={problems.previos}
          readOnly={readOnly}
          placeholder="Agregar nota previa…"
          emptyLabel="Sin notas previas."
          onChange={(previos) => commit({ ...problems, previos })}
        />
      </Box>

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
        Se precarga con los diagnósticos y síntomas registrados en esta consulta; usa el lápiz para
        agregar detalles a cada nota. Puedes pegar varias líneas para agregarlas de una vez.
      </Typography>
    </CollapsibleSection>
  )
}
