import { Autocomplete, Chip, TextField, createFilterOptions } from '@mui/material'
import { useParaclinicalCategories, useParaclinicals } from '@/features/catalogs'

// Estudio de la orden: del catálogo (id) o escrito a mano (id null).
export type StudyItemValue = { paraclinicalCatalogId: number | null; name: string }

type StudyOption = StudyItemValue & { group: string }

type StudyItemsPickerProps = {
  value: StudyItemValue[]
  onChange: (value: StudyItemValue[]) => void
  disabled: boolean
}

const filter = createFilterOptions<StudyOption>({ stringify: (option) => `${option.name} ${option.group}` })
const sameStudy = (a: StudyItemValue, b: StudyItemValue) =>
  a.paraclinicalCatalogId !== null
    ? a.paraclinicalCatalogId === b.paraclinicalCatalogId
    : b.paraclinicalCatalogId === null && a.name.toLowerCase() === b.name.toLowerCase()

// Estudios del catálogo de paraclínicos (por categoría) o escritos a mano:
// lo que no esté en la lista se agrega con Enter.
export function StudyItemsPicker({ value, onChange, disabled }: StudyItemsPickerProps) {
  const { data: paraclinicals = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()
  const categoryName = new Map(categories.map((c) => [c.id, c.name]))
  const options: StudyOption[] = paraclinicals
    .filter((p) => p.active)
    .map((p) => ({ paraclinicalCatalogId: p.id, name: p.name, group: categoryName.get(p.categoryId) ?? 'Otros' }))
    .sort((a, b) => a.group.localeCompare(b.group, 'es') || a.name.localeCompare(b.name, 'es'))
  const selected: StudyOption[] = value.map((item) => ({ ...item, group: '' }))

  return (
    <Autocomplete<StudyOption, true, false, true>
      multiple
      freeSolo
      disableCloseOnSelect
      disabled={disabled}
      options={options}
      value={selected}
      groupBy={(option) => option.group}
      filterOptions={filter}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      isOptionEqualToValue={(option, val) => typeof val !== 'string' && sameStudy(option, val)}
      onChange={(_event, next) => {
        const items = next
          .map((item) =>
            typeof item === 'string'
              ? { paraclinicalCatalogId: null, name: item.trim() }
              : { paraclinicalCatalogId: item.paraclinicalCatalogId, name: item.name },
          )
          .filter((item) => item.name)
        // Sin repetidos (un texto igual a otro ya elegido se ignora).
        onChange(items.filter((item, index) => items.findIndex((other) => sameStudy(other, item)) === index))
      }}
      renderValue={(items, getItemProps) =>
        items.map((option, index) => {
          const { key, ...itemProps } = getItemProps({ index })
          const label = typeof option === 'string' ? option : option.name
          const manual = typeof option !== 'string' && option.paraclinicalCatalogId === null
          return <Chip {...itemProps} key={key} label={label} size="small" variant={manual ? 'outlined' : 'filled'} />
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Estudios"
          placeholder={value.length === 0 ? 'Eco abdominal, radiografía de tórax… (Enter para texto libre)' : undefined}
          helperText={`${value.length} estudio(s). Los escritos a mano se muestran con borde.`}
        />
      )}
    />
  )
}
