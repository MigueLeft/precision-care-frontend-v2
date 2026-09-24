import { useState } from 'react'
import { MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { useHospitalizationCatalog, useSurgeryCatalog } from '@/features/catalogs'
import {
  SurgeryHospitalizationList,
  useCreateAntecedent,
  useDeleteAntecedent,
  isMockAntecedent,
} from '@/features/antecedents'
import type { Antecedent, AntecedentType } from '@/features/antecedents'

type SurgicalType = Extract<AntecedentType, 'surgery' | 'hospitalization'>

interface SurgicalAntecedentsBlockProps {
  patientId: number
  antecedents: Antecedent[]
  readOnly: boolean
}

export function SurgicalAntecedentsBlock({
  patientId,
  antecedents,
  readOnly,
}: SurgicalAntecedentsBlockProps) {
  const createMutation = useCreateAntecedent(patientId, { onSuccess: () => reset() })
  const deleteMutation = useDeleteAntecedent(patientId)
  const { data: surgeryCatalog = [] } = useSurgeryCatalog()
  const { data: hospitalizationCatalog = [] } = useHospitalizationCatalog()
  const [type, setType] = useState<SurgicalType>('surgery')
  const [event, setEvent] = useState<CatalogPick | null>(null)
  const [date, setDate] = useState('')
  const [complications, setComplications] = useState('')

  // Cirugías se eligen de surgery_catalog; hospitalizaciones de hospitalization_catalog.
  const catalog = (type === 'surgery' ? surgeryCatalog : hospitalizationCatalog).filter(
    (item) => item.active,
  )

  function reset() {
    setEvent(null)
    setDate('')
    setComplications('')
  }

  function submit() {
    const name = event?.name.trim()
    if (!name) {
      toast.error(
        type === 'surgery'
          ? 'Selecciona el procedimiento del catálogo.'
          : 'Selecciona el motivo de hospitalización del catálogo.',
      )
      return
    }
    createMutation.mutate({
      patientId,
      type,
      name,
      eventDate: date || undefined,
      description: complications.trim() || undefined,
      surgeryDetail:
        type === 'surgery'
          ? {
              procedure: name,
              procedureCatalogId: event?.catalogId,
              complications: complications.trim() || undefined,
            }
          : undefined,
      hospitalizationDetail:
        type === 'hospitalization'
          ? { reason: name, reasonCatalogId: event?.catalogId, admissionDate: date || undefined }
          : undefined,
    })
  }

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>
        Cirugías y hospitalizaciones
        <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 1 }}>
          {antecedents.length} {antecedents.length === 1 ? 'evento' : 'eventos'}
        </Typography>
      </Typography>

      <SurgeryHospitalizationList
        antecedents={antecedents}
        onDelete={(antecedent) => {
          if (isMockAntecedent(antecedent)) {
            toast.info('Este es un registro de ejemplo.')
            return
          }
          if (!readOnly) deleteMutation.mutate(antecedent.id)
        }}
      />

      {!readOnly && (
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
        >
          <Select
            size="small"
            value={type}
            onChange={(e) => {
              setType(e.target.value as SurgicalType)
              setEvent(null)
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="surgery">Cirugía</MenuItem>
            <MenuItem value="hospitalization">Hospitalización</MenuItem>
          </Select>
          <CatalogPicker
            key={type}
            options={catalog}
            value={event}
            onChange={setEvent}
            placeholder={type === 'surgery' ? 'Buscar procedimiento…' : 'Buscar motivo…'}
            sx={{ flex: '1 1 240px', minWidth: 220 }}
          />
          <TextField
            size="small"
            type="date"
            label="Fecha"
            slotProps={{ inputLabel: { shrink: true } }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 160 }}
          />
          <TextField
            size="small"
            placeholder="Complicaciones…"
            value={complications}
            onChange={(e) => setComplications(e.target.value)}
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
