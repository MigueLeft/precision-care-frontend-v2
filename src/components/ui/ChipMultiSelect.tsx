import { Chip, Stack, type SxProps, type Theme } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

type ChipMultiSelectProps = {
  options: readonly string[]
  value: string[]
  onChange: (value: string[]) => void
  sx?: SxProps<Theme>
}

// Selección múltiple con chips: cada clic marca o desmarca una opción.
export function ChipMultiSelect({ options, value, onChange, sx }: ChipMultiSelectProps) {
  const toggle = (option: string) =>
    onChange(
      value.includes(option) ? value.filter((item) => item !== option) : [...value, option],
    )

  return (
    <Stack direction="row" useFlexGap spacing={0.75} sx={[{ flexWrap: 'wrap' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {options.map((option) => {
        const selected = value.includes(option)
        return (
          <Chip
            key={option}
            label={option}
            size="small"
            clickable
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            icon={selected ? <CheckIcon /> : undefined}
            onClick={() => toggle(option)}
            aria-pressed={selected}
          />
        )
      })}
    </Stack>
  )
}
