import { useState } from 'react'
import { Autocomplete, Chip, Stack, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from '@/utils/toast'
import { AppButton } from '@/components/AppButton'
import { useIntakeCatalogs } from '../../hooks/useIntakeCatalogs'
import type { QuestionFieldProps } from '../../types'
import { parseFoodAllergyNames, toFoodAllergyDraft } from '../../utils/food-allergy-list'

// Opción que habilita escribir una alergia que no está en el catálogo.
const OTHER = 'Otra (no está en la lista)'

// Alergias alimentarias: se eligen del catálogo; "Otra" habilita un campo libre
// y lo escrito se agrega al catálogo cuando el paciente envía el formulario.
export function FoodAllergyListField({ value, onChange }: QuestionFieldProps) {
  const { foodAllergies } = useIntakeCatalogs()
  const names = parseFoodAllergyNames(value)
  const [otherOpen, setOtherOpen] = useState(false)
  const [otherName, setOtherName] = useState('')

  const catalogNames = foodAllergies.map((item) => item.name)
  const isCatalog = (name: string) =>
    catalogNames.some((item) => item.toLowerCase() === name.toLowerCase())
  const selected = names.filter(isCatalog)
  const custom = names.filter((name) => !isCatalog(name))

  function addOther() {
    if (!otherName.trim()) {
      toast.error('Escribe la alergia alimentaria.')
      return
    }
    onChange(toFoodAllergyDraft([...names, otherName]))
    setOtherName('')
  }

  return (
    <Stack spacing={1.5}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        size="small"
        options={[...catalogNames, OTHER]}
        value={otherOpen ? [...selected, OTHER] : selected}
        onChange={(_event, options) => {
          setOtherOpen(options.includes(OTHER))
          onChange(toFoodAllergyDraft([...options.filter((name) => name !== OTHER), ...custom]))
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={selected.length === 0 ? 'Busca y elige tus alergias…' : ''} />
        )}
      />

      {custom.length > 0 && (
        <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }}>
          {custom.map((name) => (
            <Chip
              key={name}
              label={name}
              onDelete={() => onChange(toFoodAllergyDraft(names.filter((item) => item !== name)))}
            />
          ))}
        </Stack>
      )}

      {otherOpen && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            size="small"
            label="Otra alergia alimentaria"
            value={otherName}
            onChange={(event) => setOtherName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addOther()
              }
            }}
            fullWidth
          />
          <AppButton
            variant="outlined"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={addOther}
            sx={{ flexShrink: 0 }}
          >
            Añadir
          </AppButton>
        </Stack>
      )}
    </Stack>
  )
}
