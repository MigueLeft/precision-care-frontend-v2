import { Stack, Typography } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { AppButton } from '@/components/AppButton'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { AutosaveTextField } from './AutosaveTextField'
import { ConsultationReasonField } from './ConsultationReasonField'
import { SidebarAntecedents } from './SidebarAntecedents'
import type { Consultation } from '../../types'

type SidebarClinicalFieldsProps = {
  consultation: Consultation
  readOnly: boolean
  onShowEvolution: () => void
}

function FieldTitle({ children }: { children: string }) {
  return <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>{children}</Typography>
}

// Campos de la barra lateral: Motivo, (Antecedentes en subsecuentes),
// Enfermedad actual, Nota evolutiva y Plan de tratamiento.
export function SidebarClinicalFields({
  consultation,
  readOnly,
  onShowEvolution,
}: SidebarClinicalFieldsProps) {
  const update = useUpdateConsultation(consultation.id)
  const isSubsequent = consultation.visitType === 'subsequent'

  return (
    <Stack spacing={2.5}>
      <ConsultationReasonField consultation={consultation} readOnly={readOnly} />

      {isSubsequent && <SidebarAntecedents consultation={consultation} readOnly={readOnly} />}

      <div>
        <FieldTitle>Enfermedad actual</FieldTitle>
        <AutosaveTextField
          value={consultation.currentIllness ?? ''}
          onSave={(currentIllness) => update.mutate({ currentIllness })}
          disabled={readOnly}
          minRows={3}
        />
      </div>

      <div>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Nota evolutiva</Typography>
          {isSubsequent && (
            <AppButton
              size="small"
              variant="text"
              startIcon={<CompareArrowsIcon sx={{ fontSize: 16 }} />}
              onClick={onShowEvolution}
            >
              Ver cambios
            </AppButton>
          )}
        </Stack>
        <AutosaveTextField
          value={consultation.evolution ?? ''}
          onSave={(evolution) => update.mutate({ evolution })}
          disabled={readOnly}
          minRows={6}
        />
      </div>

      <div>
        <FieldTitle>Plan de tratamiento</FieldTitle>
        <AutosaveTextField
          value={consultation.treatmentPlan ?? ''}
          onSave={(treatmentPlan) => update.mutate({ treatmentPlan })}
          disabled={readOnly}
          minRows={4}
        />
      </div>
    </Stack>
  )
}
