import { Stack, Typography } from '@mui/material'
import { SearchableMultiSelect } from '@/components/SearchableMultiSelect'
import { MedicationFrequencyField } from '@/features/patient-medications'
import type { QuestionFieldProps } from '../../types'
import { isOtherMedicationOption } from '../../utils/medication-list'

// Máximo de opciones visibles en la lista antes de hacer scroll.
const MAX_VISIBLE_OPTIONS = 5

// Lista larga de medicamentos: selección múltiple con búsqueda (chips) y, por
// cada medicamento elegido, su frecuencia (se guarda en el texto de la opción).
export function SelectMultiField({ question, value, onChange }: QuestionFieldProps) {
  const options = question.options ?? []
  const selected = value?.kind === 'options' ? value.optionIds : []
  const texts = value?.kind === 'options' ? (value.texts ?? {}) : {}
  const withFrequency = options.filter(
    (option) => selected.includes(option.id) && !isOtherMedicationOption(option),
  )

  function select(optionIds: number[]) {
    const nextTexts = Object.fromEntries(
      Object.entries(texts).filter(([id]) => optionIds.includes(Number(id))),
    )
    onChange({ kind: 'options', optionIds, texts: nextTexts })
  }

  return (
    <Stack spacing={1.5}>
      <SearchableMultiSelect
        label="Seleccione para agregar"
        placeholder="Buscar…"
        options={options.map((option) => ({ id: option.id, label: option.text }))}
        value={selected}
        onChange={select}
        maxVisibleOptions={MAX_VISIBLE_OPTIONS}
      />
      {withFrequency.map((option) => (
        <Stack key={option.id} spacing={0.5}>
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{option.text}</Typography>
          <MedicationFrequencyField
            value={texts[option.id] ?? ''}
            onChange={(frequency) =>
              onChange({
                kind: 'options',
                optionIds: selected,
                texts: { ...texts, [option.id]: frequency },
              })
            }
          />
        </Stack>
      ))}
    </Stack>
  )
}
