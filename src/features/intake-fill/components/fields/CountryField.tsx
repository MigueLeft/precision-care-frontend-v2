import { Autocomplete, TextField } from '@mui/material'
import { useIntakeCatalogs } from '../../hooks/useIntakeCatalogs'
import type { QuestionFieldProps } from '../../types'

// Selector del catálogo de países. La variante `nationality` muestra el
// gentilicio ("Mexicana"); `country`, el nombre del país. Se guarda el texto elegido.
export function CountryField({ question, value, onChange }: QuestionFieldProps) {
  const { countries } = useIntakeCatalogs()
  const current = value?.kind === 'text' && value.value ? value.value : null

  const labels =
    question.displayVariant === 'nationality'
      ? countries.map((country) => country.nationalityName ?? country.name)
      : countries.map((country) => country.name)
  const options = [...new Set(labels)].sort((a, b) => a.localeCompare(b, 'es'))

  return (
    <Autocomplete
      options={options}
      value={current}
      onChange={(_event, option) => onChange({ kind: 'text', value: option ?? '' })}
      noOptionsText="Sin coincidencias"
      renderInput={(params) => (
        <TextField {...params} size="small" placeholder="Buscar y seleccionar…" />
      )}
      fullWidth
    />
  )
}
