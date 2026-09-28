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
  buildProblemSources,
  sameProblems,
  seedProblems,
  syncProblems,
} from '../../utils/problems-sync'
import type { Consultation, ConsultationProblems } from '../../types'

interface ProblemsSectionProps {
  index: number
  consultation: Consultation
  readOnly: boolean
}

// "Notas de diagnósticos" del Cierre Clínico (se guarda en consultation.problems):
// el sistema las precarga con los síntomas + diagnósticos de esta consulta y cada
// nota se puede editar para agregar detalles. En "Actuales" solo quedan los que
// están activos; al cambiar de estado, la nota pasa a "Previos" (y viceversa).
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

  // Precarga única (si aún no hay problemas guardados) y, después, reubicación de
  // cada nota según el estado vigente de su diagnóstico o síntoma.
  useEffect(() => {
    if (readOnly || (symptoms.length === 0 && diseases.length === 0)) return
    const sources = buildProblemSources(diseases, symptoms)
    const shouldSeed = !seeded.current && !consultation.problems
    seeded.current = true
    const next = shouldSeed ? seedProblems(sources) : syncProblems(problems, sources)
    if (sameProblems(next, problems)) return
    setProblems(next)
    save(next)
  }, [readOnly, consultation.problems, symptoms, diseases, problems, save])

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
        Se precarga con los diagnósticos y síntomas registrados en esta consulta: los activos van a
        "Actuales" y los de otro estado a "Previos". Usa el lápiz para agregar detalles a cada nota.
        Puedes pegar varias líneas para agregarlas de una vez.
      </Typography>
    </CollapsibleSection>
  )
}
