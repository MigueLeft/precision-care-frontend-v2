import { ToggleButton, ToggleButtonGroup } from '@mui/material'

type OptionButtonsProps<T extends string | number> = {
  options: { value: T; label: string }[]
  value: T | null
  onChange: (value: T | null) => void
  // Sin deselección: un clic sobre la opción activa la mantiene.
  required?: boolean
  disabled?: boolean
  ariaLabel: string
}

// Selección rápida de una opción con botones (severidad, tipo de registro…).
export function OptionButtons<T extends string | number>({
  options,
  value,
  onChange,
  required,
  disabled,
  ariaLabel,
}: OptionButtonsProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(_event, next: T | null) => {
        if (next === null && required) return
        onChange(next)
      }}
      sx={{ flexWrap: 'wrap', gap: 0.5, '& .MuiToggleButtonGroup-grouped': { border: '1px solid', borderColor: 'divider', borderRadius: '6px !important', m: 0 } }}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          sx={{
            px: 1.25,
            py: 0.5,
            fontSize: '12.5px',
            textTransform: 'none',
            '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main' },
            '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
