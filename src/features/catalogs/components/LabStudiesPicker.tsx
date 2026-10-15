import { Autocomplete, Box, Chip, TextField, Typography, createFilterOptions } from '@mui/material'
import type { LabStudyOption } from '../utils/lab-studies'

type LabStudiesPickerProps = {
  options: LabStudyOption[]
  value: number[]
  onChange: (ids: number[]) => void
  error?: boolean
  helperText?: string
}

// Se busca por nombre o por código LOINC.
const filterStudies = createFilterOptions<LabStudyOption>({
  stringify: (option) => option.name + ' ' + (option.loincCode ?? ''),
})

// Buscador de estudios de laboratorio agrupado por subcategoría. El orden de
// selección es el orden en que se muestran dentro del perfil.
export function LabStudiesPicker({ options, value, onChange, error, helperText }: LabStudiesPickerProps) {
  const byId = new Map(options.map((option) => [option.id, option]))
  const selected = value.flatMap((id) => {
    const option = byId.get(id)
    return option ? [option] : []
  })

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={options}
      value={selected}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      filterOptions={filterStudies}
      onChange={(_event, next) => onChange(next.map((option) => option.id))}
      renderOption={({ key, ...props }, option) => (
        <Box component="li" key={key} {...props}>
          <Box>
            <Typography sx={{ fontSize: '14px' }}>{option.name}</Typography>
            {option.loincCode && (
              <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                LOINC {option.loincCode}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderValue={(items, getItemProps) =>
        items.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index })
          return <Chip {...itemProps} key={key} label={option.name} size="small" />
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Estudios del perfil"
          placeholder={selected.length === 0 ? 'Buscar por nombre o código LOINC…' : undefined}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}
