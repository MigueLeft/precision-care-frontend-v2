import { SearchableMultiSelect } from '@/components/SearchableMultiSelect'
import type { QuestionFieldProps } from '../../types'

// Máximo de opciones visibles en la lista antes de hacer scroll.
const MAX_VISIBLE_OPTIONS = 5

// Selección múltiple para listas largas (ej. medicamentos): lista desplegable
// con búsqueda; lo elegido se muestra como chips.
export function SelectMultiField({ question, value, onChange }: QuestionFieldProps) {
  const selected = value?.kind === 'options' ? value.optionIds : []
  return (
    <SearchableMultiSelect
      label="Seleccione para agregar"
      placeholder="Buscar…"
      options={(question.options ?? []).map((option) => ({ id: option.id, label: option.text }))}
      value={selected}
      onChange={(optionIds) => onChange({ kind: 'options', optionIds })}
      maxVisibleOptions={MAX_VISIBLE_OPTIONS}
    />
  )
}
