import { Autocomplete, TextField } from '@mui/material'
import type { ParaclinicalCatalog } from '@/features/catalogs'

type AddStudyToBlockProps = {
  options: ParaclinicalCatalog[]
  onAdd: (studyId: number) => void
}

// Buscador para sumar al bloque un estudio que no vino por defecto.
export function AddStudyToBlock({ options, onAdd }: AddStudyToBlockProps) {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={null}
      blurOnSelect
      getOptionLabel={(option) => option.name}
      onChange={(_event, study) => study && onAdd(study.id)}
      renderInput={(params) => <TextField {...params} placeholder="Agregar examen…" />}
      sx={{ width: { xs: 170, sm: 240 } }}
    />
  )
}
