import { useState } from 'react'
import {
  Stack,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
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
      <DataTable minWidth={420}>
        <TableHead>
          <TableRow>
            <HeadCell>Parámetro</HeadCell>
            <HeadCell>Unidad</HeadCell>
            <HeadCell align="right">Valor</HeadCell>
            <HeadCell align="right">Anterior</HeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {PHYSICAL_EXAM_PARAMS.map((param) => (
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
              <DataCell align="right" calc={param.calc} sx={{ width: 110 }}>
                {param.calc ? (
                  formatNumber(computed[param.key] ?? null)
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
              </DataCell>
              <DataCell align="right" sx={{ color: 'text.secondary' }}>
                {formatNumber(previousComputed[param.key] ?? null)}
              </DataCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

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
