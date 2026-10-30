import { useEffect, useRef, useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { useAntecedentsByPatient } from '@/features/antecedents'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { useConsultationDiseases } from '../../hooks/useConsultationDiseases'
import { ProblemsList } from './ProblemsList'
import {
  appendSources,
  buildProblemSources,
  dropRemovedSources,
  sameProblems,
  seedProblems,
  syncProblems,
} from '../../utils/problems-sync'
import type { Consultation, ConsultationProblems } from '../../types'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

interface ProblemsSectionProps {
  index: number
  consultation: Consultation
  readOnly: boolean
}

// "Problemas" del Cierre Clínico (se guarda en consultation.problems): el sistema
// agrega solo los diagnósticos de esta consulta y las cirugías/hospitalizaciones
// del expediente (las que aterrizan del formulario), y cada nota se puede editar.
// Los diagnósticos activos van a "Actuales"; los de otro estado y los eventos, a
// "Previos". Si el origen se quita, su nota también se quita.
export function ProblemsSection({ index, consultation, readOnly }: ProblemsSectionProps) {
  const consultationId = consultation.id
  const diseasesQuery = useConsultationDiseases(consultationId)
  const antecedentsQuery = useAntecedentsByPatient(consultation.patientId)
  const update = useUpdateConsultation(consultationId)
  const ready = diseasesQuery.isSuccess && antecedentsQuery.isSuccess
  const diseases = diseasesQuery.data
  const antecedents = antecedentsQuery.data

  // Orígenes vistos en la pasada anterior (null = aún no hay pasada), para
  // detectar los que se agregan o se quitan durante la consulta.
  const knownPrefixes = useRef<string[] | null>(null)
  const [problems, setProblems] = useConsultationDraftState<ConsultationProblems>('consultation.problems', () =>
    consultation.problems
      ? { actuales: consultation.problems.actuales, previos: consultation.problems.previos }
      : { actuales: [], previos: [] },
  )
  const [tab, setTab] = useState(0)

  const save = useDebouncedCallback((next: ConsultationProblems) => {
    update.mutate({ problems: next })
  }, 700)

  // Lo recuperado del respaldo local que no llegó al servidor se reenvía.
  useEffect(() => {
    const saved = consultation.problems
    const pending = !saved || !sameProblems(problems, { actuales: saved.actuales, previos: saved.previos })
    if (!readOnly && pending && problems.actuales.length + problems.previos.length > 0) save(problems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Primera pasada: precarga si aún no hay problemas guardados. Después: agrega
  // los orígenes nuevos, quita los eliminados y reubica cada nota según su estado.
  useEffect(() => {
    if (readOnly || !ready || !diseases || !antecedents) return
    const sources = buildProblemSources(diseases, antecedents)
    const prefixes = sources.map((source) => source.prefix)
    const known = knownPrefixes.current
    knownPrefixes.current = prefixes

    let next: ConsultationProblems
    if (known === null) {
      const saved = consultation.problems
      if (!saved) next = seedProblems(sources)
      // Precargados desde la cita: se suman los diagnósticos y eventos.
      else if (saved.fromPreload) next = appendSources(syncProblems(problems, sources), sources)
      else next = syncProblems(problems, sources)
    } else {
      const removed = known.filter((prefix) => !prefixes.includes(prefix))
      const added = sources.filter((source) => !known.includes(source.prefix))
      next = appendSources(syncProblems(dropRemovedSources(problems, removed), sources), added)
    }
    if (sameProblems(next, problems)) return
    setProblems(next)
    save(next)
  }, [readOnly, ready, consultation.problems, diseases, antecedents, problems, save, setProblems])

  const commit = (next: ConsultationProblems) => {
    setProblems(next)
    save(next)
  }

  return (
    <CollapsibleSection
      title={`${index}. Problemas`}
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
          placeholder="Agregar problema…"
          draftKey="problems.actuales"
          emptyLabel="Sin problemas actuales."
          onChange={(actuales) => commit({ ...problems, actuales })}
        />
      </Box>
      <Box hidden={tab !== 1}>
        <ProblemsList
          items={problems.previos}
          readOnly={readOnly}
          placeholder="Agregar problema previo…"
          draftKey="problems.previos"
          emptyLabel="Sin problemas previos."
          onChange={(previos) => commit({ ...problems, previos })}
        />
      </Box>

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1.5 }}>
        Se agregan automáticamente los diagnósticos de esta consulta (los activos en "Actuales", el
        resto en "Previos") y las cirugías y hospitalizaciones del expediente (en "Previos"). Usa el
        lápiz para agregar detalles. Puedes pegar varias líneas para agregarlas de una vez.
      </Typography>
    </CollapsibleSection>
  )
}
