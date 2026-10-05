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
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useParaclinicalCategories, useParaclinicals } from '@/features/catalogs'
import type { ParaclinicalCatalog } from '@/features/catalogs'
import { formatShortDate, todayIsoDate } from '@/utils/format-date'
import { useAddParaclinicalResult } from '../hooks/useAddParaclinicalResult'
import { buildSingleStudyInput, formatStudyValue } from '../utils/single-study-result'
import type { CreateParaclinicalResultInput } from '../types'

interface AddParaclinicalResultFormProps {
  patientId: number
  /** Se llama cuando el resultado quedó registrado. */
  onAdded?: (input: CreateParaclinicalResultInput) => void
}

// Alta rápida de un estudio: se crea como un resultado independiente con un
// solo analito (el modelo de paraclínicos no exige una orden previa). Si el
// estudio ya tiene resultado en esa fecha, se ofrece reemplazarlo.
export function AddParaclinicalResultForm({ patientId, onAdded }: AddParaclinicalResultFormProps) {
  const { data: categories = [] } = useParaclinicalCategories()
  const { data: catalog = [] } = useParaclinicals()

  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [study, setStudy] = useState<ParaclinicalCatalog | null>(null)
  const [result, setResult] = useState('')
  const [unit, setUnit] = useState('')
  const [date, setDate] = useState(todayIsoDate())

  const { add, isAdding, pending, confirmReplace, cancelReplace } = useAddParaclinicalResult(
    patientId,
    (input) => {
      // El formulario se limpia solo cuando el resultado quedó guardado.
      setStudy(null)
      setResult('')
      setUnit('')
      onAdded?.(input)
    },
  )

  const options = catalog.filter(
    (item) => item.active && (categoryId === '' || item.categoryId === categoryId),
  )

  function submit() {
    if (!study) {
      toast.error('Elige un estudio del catálogo.')
      return
    }
    if (!result.trim()) {
      toast.error('Indica el resultado.')
      return
    }
    add(buildSingleStudyInput({ patientId, study, result, unit, date }))
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

      <ConfirmDialog
        open={pending !== null}
        title="Este estudio ya está registrado"
        description={
          pending
            ? `${pending.existing.value.paraclinicalName ?? 'El estudio'} ya tiene un resultado del ${formatShortDate(pending.existing.resultDate)} (${formatStudyValue(pending.existing.value)}). ¿Quieres reemplazarlo por el nuevo?`
            : ''
        }
        confirmLabel="Reemplazar"
        color="primary"
        isConfirming={isAdding}
        onConfirm={confirmReplace}
        onClose={cancelReplace}
      />
    </Stack>
  )
}
