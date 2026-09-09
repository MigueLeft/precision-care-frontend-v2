import { useState } from 'react'
import {
  Box,
  Stack,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { SectionCard } from '@/components/ui/SectionCard'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber, truncateTo } from '@/utils/parse-numeric'
import { PHYSICAL_EXAM_PARAMS, computePhysicalExam, type PhysicalExamParam } from '../config'
import { useUpdatePhysicalExam } from '../hooks/usePhysicalExams'
import type { PhysicalExam } from '../types'

interface PhysicalExamCurrentViewProps {
  exam: PhysicalExam
  previous: PhysicalExam | undefined
}

function deltaColor(param: PhysicalExamParam, delta: number): string {
  if (delta === 0 || !param.betterWhen) return 'text.secondary'
  const improved = param.betterWhen === 'lower' ? delta < 0 : delta > 0
  return improved ? 'success.main' : 'error.main'
}

export function PhysicalExamCurrentView({ exam, previous }: PhysicalExamCurrentViewProps) {
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {}
    for (const [key, value] of Object.entries(exam.measurements ?? {})) next[key] = String(value)
    return next
  })

  const update = useUpdatePhysicalExam(exam.id, { onSuccess: () => setEditing(false) })

  const current = computePhysicalExam(
    editing
      ? Object.fromEntries(
          PHYSICAL_EXAM_PARAMS.map((p) => [p.key, values[p.key] ? Number(values[p.key]) : undefined]),
        )
      : exam.measurements ?? {},
  )
  const prev = computePhysicalExam(previous?.measurements ?? {})

  function handleSave() {
    const measurements: Record<string, number> = {}
    for (const param of PHYSICAL_EXAM_PARAMS) {
      if (param.calc) continue
      const value = values[param.key] ? Number(values[param.key]) : undefined
      if (value !== undefined && !Number.isNaN(value)) measurements[param.key] = value
    }
    update.mutate(measurements)
  }

  return (
    <SectionCard
      title={`Mediciones — ${formatShortDate(exam.examDate)}`}
      action={
        editing ? (
          <Stack direction="row" spacing={1}>
            <AppButton size="small" variant="text" onClick={() => setEditing(false)}>
              Cancelar
            </AppButton>
            <AppButton size="small" variant="contained" loading={update.isPending} onClick={handleSave}>
              Guardar
            </AppButton>
          </Stack>
        ) : (
          <AppButton
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 15 }} />}
            onClick={() => setEditing(true)}
          >
            Editar
          </AppButton>
        )
      }
    >
      <DataTable minWidth={420}>
        <TableHead>
          <TableRow>
            <HeadCell>Parámetro</HeadCell>
            <HeadCell>Unidad</HeadCell>
            <HeadCell align="right">Valor</HeadCell>
            <HeadCell align="right">Δ vs. anterior</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PHYSICAL_EXAM_PARAMS.map((param) => {
            const value = current[param.key]
            const prevValue = prev[param.key]
            const delta =
              value !== undefined && prevValue !== undefined
                ? truncateTo(value - prevValue)
                : null
            return (
              <TableRow key={param.key}>
                <DataCell>
                  {param.label}
                  {param.calc && (
                    <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>
                      calc.
                    </Typography>
                  )}
                </DataCell>
                <DataCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</DataCell>
                <DataCell align="right" calc={param.calc}>
                  {editing && !param.calc ? (
                    <TextField
                      size="small"
                      type="number"
                      value={values[param.key] ?? ''}
                      onChange={(e) => setValues((p) => ({ ...p, [param.key]: e.target.value }))}
                      sx={{ width: 90 }}
                    />
                  ) : (
                    formatNumber(value ?? null)
                  )}
                </DataCell>
                <DataCell align="right">
                  {delta === null ? (
                    '—'
                  ) : (
                    <Box component="span" sx={{ color: deltaColor(param, delta) }}>
                      {delta > 0 ? `+${delta}` : delta === 0 ? '—' : delta}
                    </Box>
                  )}
                </DataCell>
              </TableRow>
            )
          })}
        </TableBody>
      </DataTable>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Set fijo de 15 parámetros. Los marcados "calc." se derivan de peso, altura y grasa corporal.
      </Typography>
    </SectionCard>
  )
}
