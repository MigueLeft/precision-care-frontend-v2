import { Autocomplete, TextField, Chip } from '@mui/material'
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
}

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
}: SearchableMultiSelectProps) {
  const selected = options.filter((option) => value.includes(option.id))

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={selected}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onChange={(_event, next) => onChange(next.map((option) => option.id))}
      renderValue={(items, getItemProps) =>
        items.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index })
          return (
            <Chip
              {...itemProps}
              key={key}
              label={option.label}
              size="small"
            />
          )
        })
      }
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
