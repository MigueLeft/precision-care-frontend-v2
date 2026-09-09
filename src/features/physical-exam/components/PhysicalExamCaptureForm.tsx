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
import { AppButton } from '@/components/AppButton'
import { formatNumber } from '@/utils/parse-numeric'
import { PHYSICAL_EXAM_PARAMS, computePhysicalExam } from '../config'
import type { PhysicalExam, SavePhysicalExamInput } from '../types'

interface PhysicalExamCaptureFormProps {
  patientId: number
  consultationId: number
  existing: PhysicalExam | null
  previous: PhysicalExam | undefined
  readOnly: boolean
  isSaving: boolean
  onSave: (input: SavePhysicalExamInput) => void
}

function seed(existing: PhysicalExam | null): Record<string, string> {
  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries(existing?.measurements ?? {})) {
    next[key] = String(value)
  }
  return next
}

export function PhysicalExamCaptureForm({
  patientId,
  consultationId,
  existing,
  previous,
  readOnly,
  isSaving,
  onSave,
}: PhysicalExamCaptureFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => seed(existing))

  const numeric: Record<string, number | undefined> = {}
  for (const param of PHYSICAL_EXAM_PARAMS) {
    const raw = values[param.key]
    numeric[param.key] = raw !== undefined && raw !== '' ? Number(raw) : undefined
  }
  const computed = computePhysicalExam(numeric)
  const previousComputed = computePhysicalExam(previous?.measurements ?? {})

  function handleSave() {
    const measurements: Record<string, number> = {}
    for (const param of PHYSICAL_EXAM_PARAMS) {
      if (param.calc) continue
      const value = numeric[param.key]
      if (value !== undefined && !Number.isNaN(value)) measurements[param.key] = value
    }
    onSave({ patientId, consultationId, measurements })
  }

  return (
    <>
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
                Anterior
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PHYSICAL_EXAM_PARAMS.map((param) => (
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
                <TableCell align="right" sx={{ width: 110 }}>
                  {param.calc ? (
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'primary.main' }}>
                      {formatNumber(computed[param.key] ?? null)}
                    </Typography>
                  ) : (
                    <TextField
                      size="small"
                      type="number"
                      value={values[param.key] ?? ''}
                      onChange={(event) =>
                        setValues((prev) => ({ ...prev, [param.key]: event.target.value }))
                      }
                      disabled={readOnly}
                      sx={{ width: 90 }}
                    />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '13px', color: 'text.secondary' }}>
                  {formatNumber(previousComputed[param.key] ?? null)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Las filas "calc." (IMC, grasa en kg, masa magra) se calculan a partir de peso, altura y grasa
        corporal. "Anterior" muestra el valor de la consulta previa.
      </Typography>

      {!readOnly && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 2 }}>
          <AppButton variant="contained" loading={isSaving} onClick={handleSave}>
            Guardar examen
          </AppButton>
        </Stack>
      )}
    </>
  )
}
