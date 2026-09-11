import { useState } from 'react'
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { useParaclinicalCategories, useParaclinicals } from '@/features/catalogs'
import type { ParaclinicalCatalog } from '@/features/catalogs'
import { todayIsoDate } from '@/utils/format-date'
import type { CreateParaclinicalResultInput } from '../types'

interface AddParaclinicalResultFormProps {
  patientId: number
  isAdding: boolean
  onAdd: (input: CreateParaclinicalResultInput) => void
}

function computeStatus(value: number | undefined, min?: number, max?: number) {
  if (value === undefined) return undefined
  if (min !== undefined && value < min) return 'low' as const
  if (max !== undefined && value > max) return 'high' as const
  return 'normal' as const
}

// Alta rápida de un estudio: se crea como un resultado independiente con un
// solo analito (el modelo de paraclínicos no exige una orden previa).
export function AddParaclinicalResultForm({
  patientId,
  isAdding,
  onAdd,
}: AddParaclinicalResultFormProps) {
  const { data: categories = [] } = useParaclinicalCategories()
  const { data: catalog = [] } = useParaclinicals()

  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [study, setStudy] = useState<ParaclinicalCatalog | null>(null)
  const [result, setResult] = useState('')
  const [unit, setUnit] = useState('')
  const [date, setDate] = useState(todayIsoDate())

  const options = catalog.filter(
    (item) => item.active && (categoryId === '' || item.categoryId === categoryId),
  )

  function reset() {
    setStudy(null)
    setResult('')
    setUnit('')
  }

  function submit() {
    if (!study) {
      toast.error('Elige un estudio del catálogo.')
      return
    }
    if (!result.trim()) {
      toast.error('Indica el resultado.')
      return
    }
    const numericValue = Number(result.replace(',', '.'))
    const isNumeric = result.trim() !== '' && !Number.isNaN(numericValue)
    const referenceMin = study.referenceMin ? Number(study.referenceMin) : undefined
    const referenceMax = study.referenceMax ? Number(study.referenceMax) : undefined

    onAdd({
      patientId,
      resultDate: new Date(`${date}T12:00:00.000Z`).toISOString(),
      values: [
        {
          paraclinicalCatalogId: study.id,
          numericValue: isNumeric ? numericValue : undefined,
          textValue: isNumeric ? undefined : result.trim(),
          unit: unit.trim() || study.defaultUnit || undefined,
          referenceMin,
          referenceMax,
          status: isNumeric ? computeStatus(numericValue, referenceMin, referenceMax) : undefined,
        },
      ],
    })
    reset()
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="paraclinical-category">Categoría</InputLabel>
        <Select<number | ''>
          labelId="paraclinical-category"
          label="Categoría"
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value === '' ? '' : Number(event.target.value))
            setStudy(null)
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
        size="small"
        sx={{ flex: '1 1 220px', minWidth: 200 }}
        options={options}
        getOptionLabel={(option) => option.name}
        value={study}
        onChange={(_event, option) => {
          setStudy(option)
          setUnit(option?.defaultUnit ?? '')
        }}
        renderInput={(params) => <TextField {...params} placeholder="Estudio del catálogo…" />}
      />

      <TextField
        size="small"
        placeholder="Resultado"
        value={result}
        onChange={(event) => setResult(event.target.value)}
        sx={{ width: 130 }}
      />
      <TextField
        size="small"
        placeholder="Unidad"
        value={unit}
        onChange={(event) => setUnit(event.target.value)}
        sx={{ width: 100 }}
      />
      <TextField
        size="small"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        sx={{ width: 160 }}
      />

      <AppButton
        variant="outlined"
        loading={isAdding}
        startIcon={<AddIcon sx={{ fontSize: 18 }} />}
        onClick={submit}
      >
        Añadir
      </AppButton>
    </Stack>
  )
}
