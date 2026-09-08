import { Autocomplete, TextField } from '@mui/material'

export interface SearchableOption {
  id: number
  label: string
  sublabel?: string
}

interface SearchableSelectProps {
  label: string
  options: SearchableOption[]
  value: number | null | undefined
  onChange: (id: number | undefined) => void
  disabled?: boolean
  error?: boolean
  helperText?: string
  required?: boolean
  placeholder?: string
  fullWidth?: boolean
}

// Wrapper de `Autocomplete` de MUI para elegir un elemento de catálogo por id,
// con búsqueda. Reemplaza a los `Select` planos donde la lista es larga
// (países, especialidades, estados, ciudades).
export function SearchableSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  error,
  helperText,
  required,
  placeholder,
  fullWidth = true,
}: SearchableSelectProps) {
  const selected = options.find((option) => option.id === value) ?? null

  return (
    <Autocomplete
      options={options}
      value={selected}
      disabled={disabled}
      fullWidth={fullWidth}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onChange={(_event, option) => onChange(option?.id ?? undefined)}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props
        return (
          <li {...optionProps} key={key}>
            {option.sublabel
              ? `${option.label} — ${option.sublabel}`
              : option.label}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}
