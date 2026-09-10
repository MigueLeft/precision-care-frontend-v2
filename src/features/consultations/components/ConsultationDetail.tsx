import { Box, Chip, Stack, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { usePrescriptionsByConsultation } from '@/features/patient-medications'
import { useConsultationRecorded } from '../hooks/useConsultationDetail'
import {
  ADHERENCE_LABELS,
  DISEASE_STATUS_COLORS,
  DISEASE_STATUS_LABELS,
  RAM_LABELS,
  SYMPTOM_STATUS_LABELS,
} from '../utils/consultation-format'
import type { Consultation } from '../types'

interface ConsultationDetailProps {
  consultation: Consultation
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'text.secondary' }}>
        {title}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  )
}

const Empty = () => <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>—</Typography>

export function ConsultationDetail({ consultation }: ConsultationDetailProps) {
  const { data: recorded } = useConsultationRecorded(consultation.id)
  const { data: prescriptions = [] } = usePrescriptionsByConsultation(consultation.id)

  const symptoms = recorded?.symptoms ?? []
  const diseases = recorded?.diseases ?? []
  const medications = recorded?.medications ?? []

  return (
    <SectionCard
      title={
        <Box>
          <Typography variant="h3">{consultation.consultationReason ?? 'Consulta'}</Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {formatShortDate(consultation.startAt)}
            {consultation.specialistName ? ` · ${consultation.specialistName}` : ''}
          </Typography>
        </Box>
      }
    >
      <Stack spacing={2.5}>
        <Block title="SÍNTOMAS">
          {symptoms.length === 0 ? (
            <Empty />
          ) : (
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {symptoms.map((symptom) => (
                <Chip
                  key={symptom.id}
                  label={[
                    symptom.name ?? '—',
                    symptom.severityName,
                    SYMPTOM_STATUS_LABELS[symptom.status],
                    symptom.diseaseName,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </Block>

        <Block title="ENFERMEDADES">
          {diseases.length === 0 ? (
            <Empty />
          ) : (
            <Stack spacing={0.5}>
              {diseases.map((disease) => (
                <Stack key={disease.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {disease.name ?? '—'}
                  </Typography>
                  {disease.code && (
                    <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{disease.code}</Typography>
                  )}
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {disease.bodySystemName ?? ''}
                  </Typography>
                  <Chip
                    size="small"
                    label={DISEASE_STATUS_LABELS[disease.status]}
                    color={DISEASE_STATUS_COLORS[disease.status]}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </Block>

        <Block title="ENFERMEDAD ACTUAL">
          <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
            {consultation.currentIllness ?? '—'}
          </Typography>
        </Block>

        <Block title="TRATAMIENTO ACTUAL">
          {medications.length === 0 ? (
            <Empty />
          ) : (
            <Stack spacing={0.75}>
              {medications.map((medication) => (
                <Box key={medication.id}>
                  <Typography sx={{ fontSize: '13px' }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {medication.brandName ?? medication.genericName ?? 'Medicamento'}
                    </Box>
                    {medication.dose ? ` ${medication.dose}` : ''}
                    {medication.frequency ? ` · ${medication.frequency}` : ''}
                    {medication.status === 'previous' && (
                      <Box component="span" sx={{ color: 'error.main', fontWeight: 600 }}>
                        {' '}
                        · Finalizado
                        {medication.discontinuationReason
                          ? ` (${medication.discontinuationReason})`
                          : ''}
                      </Box>
                    )}
                  </Typography>
                  {(medication.adherence ||
                    (medication.ramStatus && medication.ramStatus !== 'none')) && (
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.25, flexWrap: 'wrap' }}>
                      {medication.adherence && (
                        <Chip size="small" label={`Adherencia: ${ADHERENCE_LABELS[medication.adherence]}`} />
                      )}
                      {medication.ramStatus && medication.ramStatus !== 'none' && (
                        <Chip
                          size="small"
                          color={medication.ramStatus === 'confirmed' ? 'error' : 'warning'}
                          label={`RAM: ${RAM_LABELS[medication.ramStatus]}`}
                        />
                      )}
                    </Stack>
                  )}
                  {(medication.adherenceNotes || medication.ramNotes) && (
                    <Typography sx={{ fontSize: '12px', fontStyle: 'italic', color: 'text.secondary' }}>
                      {[medication.adherenceNotes, medication.ramNotes].filter(Boolean).join(' · ')}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Block>

        <Block title="NOTA EVOLUTIVA">
          <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
            {consultation.evolution ?? '—'}
          </Typography>
        </Block>

        <Block title="PLAN DE TRATAMIENTO">
          <Typography sx={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>
            {consultation.treatmentPlan ?? consultation.diagnosticPlan ?? '—'}
          </Typography>
        </Block>

        <Block title="PRESCRIPCIONES">
          {prescriptions.length === 0 ? (
            <Empty />
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
