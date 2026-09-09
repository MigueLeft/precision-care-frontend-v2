import { useState } from 'react'
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { SectionCard } from '@/components/ui/SectionCard'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import { formatNumber } from '@/utils/parse-numeric'
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
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Parámetro</TableCell>
              <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }}>Unidad</TableCell>
              <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }} align="right">
                Valor
              </TableCell>
              <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: 'grey.700' }} align="right">
                Δ vs. anterior
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PHYSICAL_EXAM_PARAMS.map((param) => {
              const value = current[param.key]
              const prevValue = prev[param.key]
              const delta =
                value !== undefined && prevValue !== undefined
                  ? Number((value - prevValue).toFixed(1))
                  : null
              return (
                <TableRow key={param.key}>
                  <TableCell sx={{ fontSize: '13px' }}>
                    {param.label}
                    {param.calc && (
                      <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>
                        calc.
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>{param.unit}</TableCell>
                  <TableCell align="right">
                    {editing && !param.calc ? (
                      <TextField
                        size="small"
                        type="number"
                        value={values[param.key] ?? ''}
                        onChange={(e) => setValues((p) => ({ ...p, [param.key]: e.target.value }))}
                        sx={{ width: 90 }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: param.calc ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {formatNumber(value ?? null)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '13px' }}>
                    {delta === null ? (
                      '—'
                    ) : (
                      <Box component="span" sx={{ color: deltaColor(param, delta) }}>
                        {delta > 0 ? `+${delta}` : delta === 0 ? '—' : delta}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Set fijo de 15 parámetros. Los marcados "calc." se derivan de peso, altura y grasa corporal.
      </Typography>
    </SectionCard>
  )
}
