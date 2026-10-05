import { createFilterOptions } from '@mui/material'
import type { CatalogOption } from './CatalogSearchInput'

// La búsqueda también encuentra una opción por su alias (p. ej. el nombre
// cotidiano de una enfermedad).
export const filterCatalogOptions = createFilterOptions<CatalogOption>({
  stringify: (option) => `${option.name} ${option.alias ?? ''}`,
})
