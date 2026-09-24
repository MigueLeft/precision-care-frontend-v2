import { useState } from 'react'
import { MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { useAntecedentFamilyCatalog } from '@/features/catalogs'
import {
  AntecedentListTable,
  useCreateAntecedent,
  useDeleteAntecedent,
  isMockAntecedent,
} from '@/features/antecedents'
import type { Antecedent } from '@/features/antecedents'

const RELATIONSHIPS = [
  'Padre',
  'Madre',
  'Hermano/a',
  'Abuelo paterno',
  'Abuela paterna',
  'Abuelo materno',
  'Abuela materna',
  'Tío/a',
  'Hijo/a',
  'Otro',
]

interface FamilyAntecedentsBlockProps {
  patientId: number
  antecedents: Antecedent[]
  readOnly: boolean
}

export function FamilyAntecedentsBlock({
  patientId,
  antecedents,
  readOnly,
}: FamilyAntecedentsBlockProps) {
  const createMutation = useCreateAntecedent(patientId, { onSuccess: () => reset() })
  const deleteMutation = useDeleteAntecedent(patientId)
  const { data: catalog = [] } = useAntecedentFamilyCatalog()
  const [relationship, setRelationship] = useState('')
  const [condition, setCondition] = useState<CatalogPick | null>(null)
  const [notes, setNotes] = useState('')

  function reset() {
    setRelationship('')
    setCondition(null)
    setNotes('')
  }

  function submit() {
    if (!relationship) {
      toast.error('Selecciona el parentesco.')
      return
    }
    if (!condition?.name.trim()) {
      toast.error('Selecciona la condición del catálogo.')
      return
    }
    createMutation.mutate({
      patientId,
      type: 'family',
      relationship,
      name: condition.name.trim(),
      familyCatalogId: condition.catalogId,
      description: notes.trim() || undefined,
    })
  }

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
        Antecedentes heredofamiliares
        <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
          {antecedents.length} {antecedents.length === 1 ? 'registro' : 'registros'}
        </Typography>
      </Typography>

      <AntecedentListTable
        antecedents={antecedents}
        variant="family"
        onDelete={(antecedent) => {
          if (isMockAntecedent(antecedent)) {
            toast.info('Este es un registro de ejemplo.')
            return
          }
          if (!readOnly) deleteMutation.mutate(antecedent.id)
        }}
      />

      {!readOnly && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Select
            size="small"
            displayEmpty
            value={relationship}
            onChange={(event) => setRelationship(event.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">Parentesco…</MenuItem>
            {RELATIONSHIPS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <CatalogPicker
            options={catalog.filter((item) => item.active)}
            value={condition}
            onChange={setCondition}
            placeholder="Buscar condición…"
            sx={{ flex: '1 1 240px', minWidth: 200 }}
          />
          <TextField
            size="small"
            placeholder="Notas…"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            sx={{ flex: '1 1 200px', minWidth: 180 }}
          />
          <AppButton
            variant="outlined"
            loading={createMutation.isPending}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={submit}
          >
            Añadir
          </AppButton>
        </Stack>
      )}
    </Stack>
  )
}
