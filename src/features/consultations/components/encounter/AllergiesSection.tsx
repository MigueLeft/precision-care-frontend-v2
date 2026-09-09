import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { formatShortDate } from '@/utils/format-date'
import {
  useConsultationAllergies,
  useAddConsultationAllergy,
  useRemoveConsultationAllergy,
  useSetNoKnownAllergies,
} from '../../hooks/useConsultationAllergies'
import { AllergyHistory } from './AllergyHistory'
import { AllergyAddForm } from './AllergyAddForm'
import type { ConsultationAllergy } from '../../types'

interface AllergiesSectionProps {
  index: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

const isSevere = (allergy: ConsultationAllergy) =>
  /grave|severa/i.test(allergy.severityName ?? '')

export function AllergiesSection({
  index,
  consultationId,
  consultationDate,
  readOnly,
}: AllergiesSectionProps) {
  const { data } = useConsultationAllergies(consultationId)
  const allergies = data?.allergies ?? []
  const noKnownAllergies = data?.noKnownAllergies ?? false

  const addMutation = useAddConsultationAllergy(consultationId)
  const removeMutation = useRemoveConsultationAllergy(consultationId)
  const flagMutation = useSetNoKnownAllergies(consultationId)

  const severe = allergies.find(isSevere)
  const usedCatalogIds = new Set(allergies.map((allergy) => allergy.allergyCatalogId))

  return (
    <CollapsibleSection
      title={`${index}. Alergias`}
      headerMeta={
        severe ? (
          <Chip
            size="small"
            color="error"
            icon={<WarningAmberOutlinedIcon sx={{ fontSize: 14 }} />}
            label={`${severe.name} — ${severe.severityName?.toLowerCase() ?? ''}`}
          />
        ) : undefined
      }
      defaultExpanded
    >
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
          <Box
            key={allergy.id}
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: isSevere(allergy) ? 'error.light' : 'divider',
              bgcolor: isSevere(allergy)
                ? theme.palette.error.light + '14'
                : 'transparent',
            })}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography sx={{ fontSize: '14px' }}>
                <Box component="span" sx={{ fontWeight: 700, color: isSevere(allergy) ? 'error.main' : 'text.primary' }}>
                  {allergy.name ?? '—'}
                </Box>
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {allergy.typeName ? `  ${allergy.typeName}` : ''}
                  {allergy.severityName ? `  ${allergy.severityName}` : ''}
                  {allergy.onsetYear ? `  desde ${allergy.onsetYear}` : ''}
                </Box>
              </Typography>
              {!readOnly && (
                <IconButton
                  size="small"
                  aria-label="Quitar alergia"
                  onClick={() => removeMutation.mutate(allergy.id)}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Stack>
            {allergy.reaction && (
              <Typography sx={{ fontSize: '13px', fontStyle: 'italic', color: 'text.secondary' }}>
                {allergy.reaction}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>

      {!readOnly && (
        <AllergyAddForm
          onAdd={addMutation.mutate}
          isAdding={addMutation.isPending}
          usedCatalogIds={usedCatalogIds}
        />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Las alergias se guardan en el expediente, no solo en esta consulta. Las de severidad grave se
        muestran en la barra del paciente y validan las prescripciones.
      </Typography>
    </CollapsibleSection>
  )
}
