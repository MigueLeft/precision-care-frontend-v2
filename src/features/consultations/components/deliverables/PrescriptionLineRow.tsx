import { Checkbox, Grid, Stack, TextField, Typography } from '@mui/material'
import type { PrescriptionLineState } from './prescription-lines'

type PrescriptionLineRowProps = {
  line: PrescriptionLineState
  readOnly: boolean
  // Muestra los campos obligatorios vacíos como error (tras intentar imprimir).
  showErrors: boolean
  onChange: (patch: Partial<PrescriptionLineState>) => void
}

// Un medicamento del tratamiento: se marca para incluirlo en la receta.
export function PrescriptionLineRow({ line, readOnly, showErrors, onChange }: PrescriptionLineRowProps) {
  const field = (key: keyof PrescriptionLineState, label: string, required = false) => (
    <TextField
      size="small"
      label={label}
      value={line[key] as string}
      onChange={(event) => onChange({ [key]: event.target.value })}
      disabled={readOnly || !line.selected}
      error={showErrors && line.selected && required && (line[key] as string).trim() === ''}
      fullWidth
    />
  )

  return (
    <Stack spacing={1} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Checkbox
          checked={line.selected}
          onChange={(event) => onChange({ selected: event.target.checked })}
          disabled={readOnly}
        />
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{line.name}</Typography>
      </Stack>
      {line.selected && (
        <Grid container spacing={1.5} sx={{ pl: 5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>{field('dose', 'Dosis', true)}</Grid>
          <Grid size={{ xs: 12, sm: 4 }}>{field('frequency', 'Frecuencia', true)}</Grid>
          <Grid size={{ xs: 12, sm: 4 }}>{field('duration', 'Duración', true)}</Grid>
          <Grid size={{ xs: 12, sm: 4 }}>{field('route', 'Vía')}</Grid>
          <Grid size={{ xs: 12, sm: 8 }}>{field('instructions', 'Indicaciones')}</Grid>
        </Grid>
      )}
    </Stack>
  )
}
