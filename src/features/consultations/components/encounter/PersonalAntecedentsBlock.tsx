import { useState } from 'react'
import { MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { useAntecedentPersonalCatalog } from '@/features/catalogs'
import {
  AntecedentListTable,
  useCreateAntecedent,
  useDeleteAntecedent,
  ANTECEDENT_STATUS_LABELS,
  isMockAntecedent,
} from '@/features/antecedents'
import type { Antecedent, AntecedentStatus } from '@/features/antecedents'

const STATUSES = Object.keys(ANTECEDENT_STATUS_LABELS) as AntecedentStatus[]

interface PersonalAntecedentsBlockProps {
  patientId: number
  antecedents: Antecedent[]
  readOnly: boolean
}

export function PersonalAntecedentsBlock({
  patientId,
  antecedents,
  readOnly,
}: PersonalAntecedentsBlockProps) {
  const createMutation = useCreateAntecedent(patientId, { onSuccess: () => reset() })
  const deleteMutation = useDeleteAntecedent(patientId)
  const { data: catalog = [] } = useAntecedentPersonalCatalog()
  const [condition, setCondition] = useState<CatalogPick | null>(null)
  const [since, setSince] = useState('')
  const [status, setStatus] = useState<AntecedentStatus>('active')

  function reset() {
    setCondition(null)
    setSince('')
    setStatus('active')
  }

  function submit() {
    if (!condition?.name.trim()) {
      toast.error('Selecciona la condición o padecimiento del catálogo.')
      return
    }
    createMutation.mutate({
      patientId,
      type: 'personal',
      name: condition.name.trim(),
      personalCatalogId: condition.catalogId,
      eventDate: since || undefined,
      status,
    })
  }

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
        Antecedentes personales
        <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
          {antecedents.length} {antecedents.length === 1 ? 'registro' : 'registros'}
        </Typography>
      </Typography>

      <AntecedentListTable
        antecedents={antecedents}
        variant="personal"
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
          <CatalogPicker
            options={catalog.filter((item) => item.active)}
            value={condition}
            onChange={setCondition}
            placeholder="Buscar condición o padecimiento…"
            sx={{ flex: '1 1 260px', minWidth: 220 }}
          />
          <TextField
            size="small"
            type="date"
            label="Desde"
            slotProps={{ inputLabel: { shrink: true } }}
            value={since}
            onChange={(event) => setSince(event.target.value)}
            sx={{ width: 160 }}
          />
          <Select
            size="small"
            value={status}
            onChange={(event) => setStatus(event.target.value as AntecedentStatus)}
            sx={{ minWidth: 150 }}
          >
            {STATUSES.map((value) => (
              <MenuItem key={value} value={value}>
                {ANTECEDENT_STATUS_LABELS[value]}
              </MenuItem>
            ))}
          </Select>
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
