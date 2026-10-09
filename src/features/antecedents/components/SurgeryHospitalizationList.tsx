import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { EmptyState } from '@/components/EmptyState'
import { formatFreeDate } from '@/utils/format-date'
import type { Antecedent } from '../types'
import { ANTECEDENT_TYPE_LABELS } from '../utils/antecedent-format'

interface SurgeryHospitalizationListProps {
  antecedents: Antecedent[]
  onEdit?: (antecedent: Antecedent) => void
  onDelete: (antecedent: Antecedent) => void
}

interface FieldProps {
  label: string
  value: string | null | undefined
  /** Texto a mostrar cuando no hay valor; sin él, el campo se oculta. */
  emptyLabel?: string
}

function Field({ label, value, emptyLabel }: FieldProps) {
  if (!value && !emptyLabel) return null
  return (
    <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
      {label}:{' '}
      <Box component="span" sx={{ color: value ? 'text.primary' : 'text.secondary' }}>
        {value || emptyLabel}
      </Box>
    </Typography>
  )
}

export function SurgeryHospitalizationList({
  antecedents,
  onEdit,
  onDelete,
}: SurgeryHospitalizationListProps) {
  if (antecedents.length === 0) {
    return <EmptyState message="Sin registros." />
  }

  return (
    <Stack spacing={1.5}>
      {antecedents.map((antecedent) => {
        const surgery = antecedent.surgeryDetail
        const hospitalization = antecedent.hospitalizationDetail
        const cie10 =
          antecedent.cie10Code ?? hospitalization?.dischargeDiagnosisCie10
        const complications = surgery?.complications || hospitalization?.complications
        // Las notas solo se repiten si son distintas de las complicaciones.
        const notes =
          antecedent.description !== complications ? antecedent.description : null

        return (
          <Box
            key={antecedent.id}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip label={ANTECEDENT_TYPE_LABELS[antecedent.type]} size="small" />
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{antecedent.name}</Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                {cie10 && (
                  <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                    CIE-10: {cie10}
                  </Typography>
                )}
                {onEdit && (
                  <IconButton size="small" onClick={() => onEdit(antecedent)} aria-label="Editar">
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
                <IconButton size="small" onClick={() => onDelete(antecedent)} aria-label="Eliminar">
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Stack>
            </Stack>

            <Stack spacing={0.25} sx={{ mt: 1 }}>
              <Field label="Procedimiento" value={surgery?.procedure} />
              <Field
                label="Fecha"
                value={surgery && antecedent.eventDate ? formatFreeDate(antecedent.eventDate) : null}
              />
              <Field
                label="Institución"
                value={surgery?.institution ?? hospitalization?.institution}
              />
              <Field
                label="Ingreso"
                value={hospitalization?.admissionDate ? formatFreeDate(hospitalization.admissionDate) : null}
              />
              <Field
                label="Egreso"
                value={hospitalization?.dischargeDate ? formatFreeDate(hospitalization.dischargeDate) : null}
              />
              <Field label="Motivo" value={hospitalization?.reason} />
              <Field label="Médico tratante" value={surgery?.treatingPhysician} />
              <Field label="Complicaciones" value={complications} emptyLabel="Sin registrar" />
              <Field label="Notas" value={notes} />
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}
