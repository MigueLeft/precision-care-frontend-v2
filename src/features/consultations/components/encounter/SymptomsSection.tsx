import { useEffect, useRef, useState } from 'react'
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'sonner'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { CatalogSearchInput } from '@/components/ui/CatalogSearchInput'
import { useBodySystems, useSymptoms } from '@/features/catalogs'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { formatShortDate } from '@/utils/format-date'
import { isLettersOnly } from '@/utils/text-validation'
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
    if (!isLettersOnly(clean)) {
      toast.error(
        'El síntoma solo puede contener letras, sin números ni caracteres especiales.',
      )
      return
    }
    if (rows.some((row) => row.name.toLowerCase() === clean.toLowerCase())) return
    commit([
      ...rows,
      { key: nextKey(), name: clean, symptomCatalogId: catalogId, bodySystemId: null },
    ])
  }

  const currentNames = new Set(rows.map((row) => row.name.toLowerCase()))
  // Los síntomas ya capturados en esta consulta no vuelven a ofrecerse en la búsqueda.
  const availableOptions = catalog.filter(
    (option) => !currentNames.has(option.name.toLowerCase()),
  )

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
        <CatalogSearchInput
          sx={{ mt: 2 }}
          options={availableOptions.map((s) => ({ id: s.id, name: s.name }))}
          placeholder="Buscar síntoma…"
          onAdd={(name, id) => addSymptom(name, id)}
          manualLabel="El síntoma no está en el catálogo · escribir manualmente"
        />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Síntomas del catálogo configurable. Si no existe, marca la casilla para escribirlo (se agrega
        al catálogo sin duplicar). El aparato/sistema que elijas queda asociado solo a esta consulta.
      </Typography>
    </CollapsibleSection>
  )
}
