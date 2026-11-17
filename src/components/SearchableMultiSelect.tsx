import { Autocomplete, Box, TextField, Chip } from '@mui/material'
import type { SearchableOption } from './SearchableSelect'

interface SearchableMultiSelectProps {
  label: string
  options: SearchableOption[]
  value: number[]
  onChange: (ids: number[]) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
  placeholder?: string
  /** Máximo de opciones visibles en la lista antes de hacer scroll. */
  maxVisibleOptions?: number
  /** Selección acotada con scroll y opciones elegidas ocultas en la lista. */
  compact?: boolean
}

// Alto de cada fila de la lista (px); coincide con el `minHeight` fijado abajo.
const OPTION_HEIGHT = 40

// Variante múltiple de `SearchableSelect` — para "Otras especialidades" y
// campos similares de selección múltiple con búsqueda.
export function SearchableMultiSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  error,
  helperText,
  placeholder,
  maxVisibleOptions,
  compact = false,
}: SearchableMultiSelectProps) {
  const selected = options.filter((option) => value.includes(option.id))

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      filterSelectedOptions
      options={options}
      value={selected}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onChange={(_event, next) => onChange(next.map((option) => option.id))}
      slotProps={
        maxVisibleOptions
          ? {
              listbox: {
                sx: {
                  maxHeight: maxVisibleOptions * OPTION_HEIGHT + 16,
                  '& .MuiAutocomplete-option': { minHeight: OPTION_HEIGHT },
                },
              },
            }
          : undefined
      }
      renderValue={(items, getItemProps) => {
        const chips = items.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index })
          return (
            <Chip
              {...itemProps}
              key={key}
              label={option.label}
              size="small"
              sx={compact ? { maxWidth: '100%' } : undefined}
            />
          )
        })
        return compact && items.length > 0 ? (
          <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 88, overflowY: 'auto', width: '100%', pr: 3, py: 0.5 }}>
            {chips}
          </Box>
        ) : chips
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={selected.length === 0 ? placeholder : undefined}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}
