import { Box, Chip, Stack, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { SectionCard } from '@/components/ui/SectionCard'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import { usePrescriptionsByConsultation } from '@/features/patient-medications'
import {
  useConsultationDiagnoses,
  useConsultationSymptoms,
} from '../hooks/useConsultationDetail'
import { DIAGNOSIS_TYPE_LABELS } from '../utils/consultation-format'
import type { Consultation } from '../types'

interface ConsultationDetailProps {
  consultation: Consultation
}

interface BlockProps {
  title: string
  children: React.ReactNode
}

function Block({ title, children }: BlockProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary' }}>
        {title}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  )
}

export function ConsultationDetail({ consultation }: ConsultationDetailProps) {
  const { data: diagnoses = [] } = useConsultationDiagnoses(consultation.id)
  const { data: symptoms = [] } = useConsultationSymptoms(consultation.id)
  const { data: prescriptions = [] } = usePrescriptionsByConsultation(consultation.id)

  return (
    <SectionCard
      title={
        <Box>
          <Typography variant="h3">
            {consultation.consultationReason ?? 'Consulta'}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(consultation.startAt)}
            {consultation.specialistName ? ` · ${consultation.specialistName}` : ''}
          </Typography>
        </Box>
      }
      action={
        <Stack direction="row" spacing={1}>
          <AppButton size="small" variant="outlined" disabled>
            Editar
          </AppButton>
          <AppButton size="small" variant="outlined" disabled>
            Versiones
          </AppButton>
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        <Block title="SÍNTOMAS">
          {symptoms.length === 0 ? (
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>—</Typography>
          ) : (
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {symptoms.map((symptom) => (
                <Chip
                  key={symptom.id}
                  label={
                    symptom.bodySystemName
                      ? `${symptom.name ?? '—'} · ${symptom.bodySystemName}`
                      : (symptom.name ?? '—')
                  }
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Block>

        <Block title="DIAGNÓSTICOS">
          {diagnoses.length === 0 ? (
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>—</Typography>
          ) : (
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {diagnoses.map((diagnosis) => (
                <Chip
                  key={diagnosis.id}
                  label={`${diagnosis.name} · ${DIAGNOSIS_TYPE_LABELS[diagnosis.type]}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Block>

        <Block title="ENFERMEDAD ACTUAL">
          <Typography sx={{ fontSize: '13px' }}>
            {consultation.currentIllness ?? '—'}
          </Typography>
        </Block>

        <Block title="NOTA EVOLUTIVA">
          <Typography sx={{ fontSize: '13px' }}>{consultation.evolution ?? '—'}</Typography>
        </Block>

        <Block title="PLAN">
          <Typography sx={{ fontSize: '13px' }}>
            {consultation.treatmentPlan ?? consultation.diagnosticPlan ?? '—'}
          </Typography>
        </Block>

        <Block title="PRESCRIPCIONES">
          {prescriptions.length === 0 ? (
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>—</Typography>
          ) : (
            <Stack spacing={0.75}>
              {prescriptions.map((prescription) => (
                <Stack
                  key={prescription.id}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', fontSize: '13px' }}
                >
                  <LinkIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {prescription.brandName ?? prescription.genericName ?? 'Medicamento'}{' '}
                    {prescription.dose}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    · {prescription.frequency} · {prescription.duration}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Block>
      </Stack>
    </SectionCard>
  )
}
