import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { REASON_TYPE_LABELS } from '../../utils/consultation-format'
import { AutosaveTextField } from './AutosaveTextField'
import type { Consultation, ConsultationReasonType } from '../../types'

type ConsultationReasonFieldProps = {
  consultation: Consultation
  readOnly: boolean
}

const REASON_TYPES: ConsultationReasonType[] = ['control', 'new']

// Motivo de consulta. En subsecuentes se elige Control o Nuevo (excluyentes);
// el texto libre solo se habilita con "Nuevo". En primera vez es texto libre.
export function ConsultationReasonField({ consultation, readOnly }: ConsultationReasonFieldProps) {
  const update = useUpdateConsultation(consultation.id)
  const isSubsequent = consultation.visitType === 'subsequent'
  const reasonType = consultation.reasonType
  const textEnabled = !isSubsequent || reasonType === 'new'

  const toggle = (type: ConsultationReasonType, checked: boolean) =>
    update.mutate({ reasonType: checked ? type : null })

  return (
    <div>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>Motivo de consulta</Typography>
      {isSubsequent && (
        <Stack direction="row" spacing={1}>
          {REASON_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              label={REASON_TYPE_LABELS[type]}
              disabled={readOnly || update.isPending}
              control={
                <Checkbox
                  size="small"
                  checked={reasonType === type}
                  onChange={(event) => toggle(type, event.target.checked)}
                />
              }
            />
          ))}
        </Stack>
      )}
      <AutosaveTextField
        value={consultation.consultationReason ?? ''}
        onSave={(consultationReason) => update.mutate({ consultationReason })}
        disabled={readOnly || !textEnabled}
        minRows={2}
      />
    </div>
  )
}
