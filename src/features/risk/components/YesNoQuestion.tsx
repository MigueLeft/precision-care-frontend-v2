import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

export type YesNo = 'yes' | 'no' | ''

type YesNoQuestionProps = {
  label: string
  // Fuente del dato pre-llenado ("inferido", "laboratorio", "sin dato"…).
  source: string
  value: YesNo
  disabled: boolean
  onChange: (value: YesNo) => void
}

// Pregunta sí/no del formulario de factores de riesgo (vacío = sin dato).
export function YesNoQuestion({ label, source, value, disabled, onChange }: YesNoQuestionProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <ToggleButtonGroup
        size="small"
        exclusive
        disabled={disabled}
        value={value}
        onChange={(_e, next: YesNo | null) => onChange(next ?? '')}
        sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1 } }}
      >
        <ToggleButton value="yes">Sí</ToggleButton>
        <ToggleButton value="no">No</ToggleButton>
      </ToggleButtonGroup>
      <Typography sx={{ fontSize: '13px', flex: 1 }}>
        {label}
        <Typography component="span" sx={{ fontSize: '11px', color: 'text.secondary', ml: 0.5 }}>
          ({source})
        </Typography>
      </Typography>
    </Stack>
  )
}
