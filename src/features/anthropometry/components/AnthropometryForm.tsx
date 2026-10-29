import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { ANTHROPOMETRY_GROUPS } from '../config'
import { useAnthropometryForm } from '../hooks/useAnthropometryForm'
import type { ValueMap } from '../utils/anthropometry-calculations'
import type { Anthropometry, SaveAnthropometryInput } from '../types'
import { AnthropometryGroupInputs } from './AnthropometryGroupInputs'
import { SegmentInputsTable } from './SegmentInputsTable'

type AnthropometryFormProps = {
  patientId: number
  consultationId?: number
  appointmentId?: number
  existing?: Anthropometry | null
  previous?: ValueMap
  readOnly?: boolean
  // En la consulta la fecha es la de la consulta; en el expediente se elige.
  showDate?: boolean
  isSaving: boolean
  onSave: (input: SaveAnthropometryInput) => void
  onCancel?: () => void
}

export function AnthropometryForm({
  patientId,
  consultationId,
  appointmentId,
  existing,
  previous,
  readOnly = false,
  showDate = false,
  isSaving,
  onSave,
  onCancel,
}: AnthropometryFormProps) {
  const form = useAnthropometryForm(existing)

  return (
    <Stack spacing={2.5}>
      {showDate && (
        <TextField
          type="date"
          size="small"
          label="Fecha de medición"
          value={form.date}
          onChange={(event) => form.setDate(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ width: 200 }}
        />
      )}

      <Stack spacing={3}>
        {ANTHROPOMETRY_GROUPS.map((group) => (
          <Box key={group.id}>
            <AnthropometryGroupInputs
              group={group}
              raw={form.raw}
              computed={form.computed}
              previous={previous}
              readOnly={readOnly}
              segmentsEnabled={form.segmentsEnabled}
              onChange={form.setField}
            />
            {/* La composición por segmento va justo después de la composición general. */}
            {group.id === 'composition' && (
              <Box sx={{ mt: 1.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={form.segmentsEnabled}
                      disabled={readOnly}
                      onChange={(event) => form.setSegmentsEnabled(event.target.checked)}
                    />
                  }
                  label="Composición por segmento"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
                />
                {form.segmentsEnabled && (
                  <SegmentInputsTable raw={form.raw} readOnly={readOnly} onChange={form.setField} />
                )}
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic' }}>
        Las filas "calc." se calculan solas: masa magra % = 100 − masa grasa %; masa grasa y magra
        en kg a partir del peso; circunferencia muscular del brazo = circ. braquial − π × pliegue
        tricipital. Con composición por segmento, la masa músculo esquelética (0,566 × masa magra) y
        la masa magra apendicular (brazos + piernas) salen de los segmentos; sin ella se escriben
        del reporte de bioimpedancia. MMA/talla² se calcula siempre.
      </Typography>

      <TextField
        label="Observaciones / Notas"
        multiline
        minRows={2}
        value={form.notes}
        onChange={(event) => form.setNotes(event.target.value)}
        disabled={readOnly}
        fullWidth
      />

      {!readOnly && (
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          {onCancel && (
            <AppButton variant="text" onClick={onCancel} disabled={isSaving}>
              Cancelar
            </AppButton>
          )}
          <AppButton
            variant="contained"
            loading={isSaving}
            onClick={() => onSave(form.buildInput(patientId, consultationId, appointmentId))}
          >
            Guardar antropometría
          </AppButton>
        </Stack>
      )}
    </Stack>
  )
}
