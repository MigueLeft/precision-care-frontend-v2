import { useState } from 'react'
import { Checkbox, Chip, FormControlLabel, Stack, Typography } from '@mui/material'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { formatShortDate } from '@/utils/format-date'
import {
  useConsultationAllergies,
  useAddConsultationAllergy,
  useRemoveConsultationAllergy,
  useSetNoKnownAllergies,
} from '../../hooks/useConsultationAllergies'
import { AllergyHistory } from './AllergyHistory'
import { AllergyAddForm } from './AllergyAddForm'
import { AllergyCard } from './AllergyCard'
import { isSevereAllergy } from '../../utils/allergy'
import { AllergyEditDialog } from './AllergyEditDialog'
import type { ConsultationAllergy } from '../../types'

interface AllergiesBlockProps {
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

// Bloque "Alergias" dentro de Antecedentes (se guardan a nivel paciente).
export function AllergiesBlock({
  consultationId,
  consultationDate,
  readOnly,
}: AllergiesBlockProps) {
  const { data } = useConsultationAllergies(consultationId)
  const allergies = data?.allergies ?? []
  const noKnownAllergies = data?.noKnownAllergies ?? false
  const [editing, setEditing] = useState<ConsultationAllergy | null>(null)

  const addMutation = useAddConsultationAllergy(consultationId)
  const removeMutation = useRemoveConsultationAllergy(consultationId)
  const flagMutation = useSetNoKnownAllergies(consultationId)

  const severe = allergies.find(isSevereAllergy)
  const usedCatalogIds = new Set(allergies.map((allergy) => allergy.allergyCatalogId))

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Alergias</Typography>
        {severe && (
          <Chip
            size="small"
            color="error"
            icon={<WarningAmberOutlinedIcon sx={{ fontSize: 14 }} />}
            label={`${severe.name} — ${severe.severityName?.toLowerCase() ?? ''}`}
          />
        )}
      </Stack>

      <AllergyHistory consultationId={consultationId} />

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={noKnownAllergies}
            disabled={readOnly || allergies.length > 0}
            onChange={(event) => flagMutation.mutate(event.target.checked)}
          />
        }
        label="Sin alergias conocidas"
      />

      <Stack spacing={1} sx={{ my: 1.5 }}>
        {allergies.map((allergy) => (
          <AllergyCard
            key={allergy.id}
            allergy={allergy}
            readOnly={readOnly}
            onEdit={() => setEditing(allergy)}
            onRemove={() => removeMutation.mutate(allergy.id)}
          />
        ))}
      </Stack>

      {!readOnly && (
        <AllergyAddForm
          onAdd={addMutation.mutate}
          isAdding={addMutation.isPending}
          usedCatalogIds={usedCatalogIds}
        />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic' }}>
        Las alergias severas se muestran en la barra del paciente y validan las prescripciones.
      </Typography>

      <AllergyEditDialog consultationId={consultationId} allergy={editing} onClose={() => setEditing(null)} />
    </Stack>
  )
}
