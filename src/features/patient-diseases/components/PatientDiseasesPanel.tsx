import { useMemo, useState } from 'react'
import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { QueryBoundary } from '@/components/ui/QueryBoundary'
import { SectionCard } from '@/components/ui/SectionCard'
import {
  ACTIVE_DISEASE_STATUSES,
  DISEASE_STATUS_LABELS,
} from '@/features/consultations'
import type { DiseaseStatus } from '@/features/consultations'
import {
  usePatientDiseases,
  useAddPatientDisease,
  useUpdatePatientDisease,
} from '../hooks/usePatientDiseases'
import { DiseaseCard } from './DiseaseCard'
import { AddPatientDiseaseModal } from './AddPatientDiseaseModal'
import type { PatientDisease } from '../types'

interface PatientDiseasesPanelProps {
  patientId: number
}

type Filter = 'active' | 'all' | DiseaseStatus

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '28px', fontWeight: 700 }}>{value}</Typography>
    </Paper>
  )
}

export function PatientDiseasesPanel({ patientId }: PatientDiseasesPanelProps) {
  const [view, setView] = useState<'system' | 'chronological'>('chronological')
  const [filter, setFilter] = useState<Filter>('active')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { data: diseases = [], isLoading, isError, error } = usePatientDiseases(patientId)
  const addMutation = useAddPatientDisease(patientId, { onSuccess: () => setIsAddOpen(false) })
  const updateMutation = useUpdatePatientDisease(patientId)

  const isActive = (d: PatientDisease) => ACTIVE_DISEASE_STATUSES.includes(d.status)

  const stats = useMemo(() => {
    const active = diseases.filter(isActive)
    return {
      vigentes: active.length,
      cronicas: diseases.filter((d) => d.isChronic).length,
      sistemas: new Set(active.map((d) => d.bodySystemId)).size,
      resueltas: diseases.filter((d) => d.status === 'resolved').length,
    }
  }, [diseases])

  const filtered = diseases.filter((d) => {
    if (filter === 'all') return true
    if (filter === 'active') return isActive(d)
    return d.status === filter
  })

  const bySystem = useMemo(() => {
    const groups = new Map<string, PatientDisease[]>()
    for (const disease of filtered) {
      const key = disease.bodySystemName ?? 'Sin asignar'
      groups.set(key, [...(groups.get(key) ?? []), disease])
    }
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  const chronological = [...filtered].sort((a, b) =>
    (b.dxDate ?? '').localeCompare(a.dxDate ?? ''),
  )

  if (isLoading || isError) {
    return (
      <QueryBoundary isLoading={isLoading} isError={isError} error={error}>
        {null}
      </QueryBoundary>
    )
  }

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Tile label="VIGENTES" value={stats.vigentes} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Tile label="CRÓNICAS" value={stats.cronicas} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Tile label="SISTEMAS AFECTADOS" value={stats.sistemas} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Tile label="RESUELTAS" value={stats.resueltas} />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_event, next) => next && setView(next)}
        >
          <ToggleButton value="chronological">Lista cronológica</ToggleButton>
          <ToggleButton value="system">Por aparato / sistema</ToggleButton>
        </ToggleButtonGroup>
        <Select
          size="small"
          value={filter}
          onChange={(event) => setFilter(event.target.value as Filter)}
        >
          <MenuItem value="active">Vigentes (activa, controlada, en remisión)</MenuItem>
          <MenuItem value="all">Todas</MenuItem>
          {(Object.keys(DISEASE_STATUS_LABELS) as DiseaseStatus[]).map((status) => (
            <MenuItem key={status} value={status}>
              {DISEASE_STATUS_LABELS[status]}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ flex: 1 }} />
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => setIsAddOpen(true)}
        >
          Añadir enfermedad
        </AppButton>
      </Stack>

      {filtered.length === 0 && <EmptyState message="Sin enfermedades con este filtro." />}

      {view === 'system' &&
        bySystem.map(([systemName, rows]) => (
          <SectionCard
            key={systemName}
            title={
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h3" sx={{ textTransform: 'uppercase', fontSize: '13px' }}>
                  {systemName}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{rows.length}</Typography>
              </Stack>
            }
          >
            {rows.map((disease) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                onStatusChange={(status) =>
                  updateMutation.mutate({ diseaseId: disease.id, input: { status } })
                }
                disabled={updateMutation.isPending}
              />
            ))}
          </SectionCard>
        ))}

      {view === 'chronological' && filtered.length > 0 && (
        <SectionCard>
          {chronological.map((disease) => (
            <DiseaseCard
              key={disease.id}
              disease={disease}
              showSystem
              onStatusChange={(status) =>
                updateMutation.mutate({ diseaseId: disease.id, input: { status } })
              }
              disabled={updateMutation.isPending}
            />
          ))}
        </SectionCard>
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic' }}>
        Los diagnósticos registrados en consulta se agregan aquí automáticamente; el cambio de estado
        queda en el historial del expediente.
      </Typography>

      <AddPatientDiseaseModal
        open={isAddOpen}
        isSaving={addMutation.isPending}
        onSubmit={addMutation.mutate}
        onClose={() => setIsAddOpen(false)}
      />
    </Stack>
  )
}
