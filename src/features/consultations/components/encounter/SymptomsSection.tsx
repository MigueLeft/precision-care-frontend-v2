import { useEffect, useRef, useState } from 'react'
import {
  Autocomplete,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { useBodySystems, useSymptoms } from '@/features/catalogs'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { formatShortDate } from '@/utils/format-date'
import {
  useConsultationSymptoms,
  useReplaceConsultationSymptoms,
} from '../../hooks/useConsultationDetail'
import { SymptomHistory } from './SymptomHistory'

interface SymptomsSectionProps {
  index: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

interface SymptomRow {
  key: string
  name: string
  symptomCatalogId?: number
  bodySystemId: number | null
}

let rowSeq = 0
const nextKey = () => `row-${rowSeq++}`

export function SymptomsSection({
  index,
  consultationId,
  consultationDate,
  readOnly,
}: SymptomsSectionProps) {
  const { data: symptoms = [] } = useConsultationSymptoms(consultationId)
  const { data: bodySystems = [] } = useBodySystems()
  const { data: catalog = [] } = useSymptoms()
  const replaceMutation = useReplaceConsultationSymptoms(consultationId)

  const [rows, setRows] = useState<SymptomRow[]>([])
  const dirtyRef = useRef(false)

  useEffect(() => {
    if (dirtyRef.current) return
    setRows(
      symptoms.map((symptom) => ({
        key: nextKey(),
        name: symptom.name ?? '',
        symptomCatalogId: symptom.symptomCatalogId,
        bodySystemId: symptom.bodySystemId,
      })),
    )
  }, [symptoms])

  const save = useDebouncedCallback((next: SymptomRow[]) => {
    dirtyRef.current = false
    replaceMutation.mutate(
      next
        .filter((row) => row.name.trim())
        .map((row) => ({
          name: row.name.trim(),
          symptomCatalogId: row.symptomCatalogId,
          bodySystemId: row.bodySystemId,
        })),
    )
  }, 900)

  function commit(next: SymptomRow[]) {
    dirtyRef.current = true
    setRows(next)
    save(next)
  }

  function addSymptom(name: string, catalogId?: number) {
    const clean = name.trim()
    if (!clean) return
    if (rows.some((row) => row.name.toLowerCase() === clean.toLowerCase())) return
    commit([
      ...rows,
      { key: nextKey(), name: clean, symptomCatalogId: catalogId, bodySystemId: null },
    ])
  }

  const currentNames = new Set(rows.map((row) => row.name.toLowerCase()))

  return (
    <CollapsibleSection
      title={`${index}. Síntomas`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {rows.length} en esta consulta
        </Typography>
      }
      defaultExpanded
    >
      <SymptomHistory consultationId={consultationId} currentNames={currentNames} />

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      <Stack spacing={1}>
        {rows.map((row, rowIndex) => (
          <Stack key={row.key} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>
              {row.name}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }} disabled={readOnly}>
              <InputLabel id={`bs-${row.key}`}>Aparato / sistema</InputLabel>
              <Select<number | ''>
                labelId={`bs-${row.key}`}
                label="Aparato / sistema"
                value={row.bodySystemId ?? ''}
                onChange={(event) => {
                  const raw = event.target.value
                  const nextRows = [...rows]
                  nextRows[rowIndex] = {
                    ...row,
                    bodySystemId: raw === '' ? null : Number(raw),
                  }
                  commit(nextRows)
                }}
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {bodySystems.map((system) => (
                  <MenuItem key={system.id} value={system.id}>
                    {system.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!readOnly && (
              <IconButton
                size="small"
                aria-label="Quitar síntoma"
                onClick={() => commit(rows.filter((_, i) => i !== rowIndex))}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Stack>
        ))}
      </Stack>

      {!readOnly && (
        <Autocomplete
          sx={{ mt: 2 }}
          freeSolo
          options={catalog}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.name
          }
          value={null}
          blurOnSelect
          clearOnBlur
          onChange={(_event, option) => {
            if (!option) return
            if (typeof option === 'string') addSymptom(option)
            else addSymptom(option.name, option.id)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar o agregar síntoma…"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const value = (event.target as HTMLInputElement).value
                  if (value.trim()) {
                    addSymptom(value)
                    ;(event.target as HTMLInputElement).blur()
                  }
                }
              }}
            />
          )}
        />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Síntomas del catálogo configurable. Si no existe, se agrega al catálogo (sin duplicar). El
        aparato/sistema que elijas queda asociado solo a esta consulta.
      </Typography>
    </CollapsibleSection>
  )
}
