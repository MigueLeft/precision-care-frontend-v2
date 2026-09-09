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
import type { Consultation, ConsultationProblems } from '../../types'

interface ProblemsSectionProps {
  consultation: Consultation
  readOnly: boolean
}

// "Problemas" del Cierre Clínico: precargado con los síntomas + enfermedades de
// esta consulta y editable para añadir notas específicas.
export function ProblemsSection({ consultation, readOnly }: ProblemsSectionProps) {
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
      ...symptoms.map((s) => s.name ?? '').filter(Boolean),
      ...diseases.map((d) =>
        [d.name, d.code ? `(${d.code})` : null].filter(Boolean).join(' '),
      ),
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
      title="Problemas"
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
          placeholder="Agregar problema actual…"
          emptyLabel="Sin problemas actuales."
          onChange={(actuales) => commit({ ...problems, actuales })}
        />
      </Box>
      <Box hidden={tab !== 1}>
        <ProblemsList
          items={problems.previos}
          readOnly={readOnly}
          placeholder="Agregar problema previo…"
          emptyLabel="Sin problemas previos."
          onChange={(previos) => commit({ ...problems, previos })}
        />
      </Box>

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
        Se precarga con los síntomas y enfermedades registrados en esta consulta. Puedes pegar varias
        líneas para agregarlas de una vez.
      </Typography>
    </CollapsibleSection>
  )
}
