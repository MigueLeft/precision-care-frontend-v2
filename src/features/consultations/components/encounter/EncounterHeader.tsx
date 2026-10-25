import { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import { LandIntakeButton } from './LandIntakeButton'
import { countErrors, validateExam } from '@/features/physical-exam'
import type { Consultation } from '../../types'

interface EncounterHeaderProps {
  consultation: Consultation
  readOnly: boolean
}

const FINALIZE_TEXT =
  'Lo capturado en la consulta es un borrador: al finalizar queda cerrada y toda su información pasa al expediente del paciente. ¿Continuar?'

// Aviso (no bloquea) si el examen físico tiene pendientes.
function finalizeDescription(consultation: Consultation): string {
  const exam = consultation.physicalExam
  if (!exam) return `Aviso: el examen físico no está documentado. ${FINALIZE_TEXT}`
  const warnings = countErrors(validateExam(exam))
  if (warnings === 0) return FINALIZE_TEXT
  return `Aviso: el examen físico tiene ${warnings} ${warnings === 1 ? 'pendiente' : 'pendientes'} por revisar. ${FINALIZE_TEXT}`
}

function elapsed(from: string): string {
  const ms = Date.now() - new Date(from).getTime()
  const mins = Math.max(0, Math.floor(ms / 60000))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function EncounterHeader({ consultation, readOnly }: EncounterHeaderProps) {
  const navigate = useNavigate()
  const [duration, setDuration] = useState(() => elapsed(consultation.startAt))
  const [confirmOpen, setConfirmOpen] = useState(false)

  const finalize = useUpdateConsultation(consultation.id)

  useEffect(() => {
    if (readOnly) return
    const timer = setInterval(() => setDuration(elapsed(consultation.startAt)), 30000)
    return () => clearInterval(timer)
  }, [consultation.startAt, readOnly])

  function goBack() {
    navigate({
      to: '/pacientes/$patientId/consultas',
      params: { patientId: String(consultation.patientId) },
    })
  }

  return (
    <Stack
      direction="row"
      sx={{
        px: 3,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h3">
        {readOnly ? 'Consulta terminada' : 'Consulta en curso'}
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        {!readOnly && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            Duración {duration}
          </Typography>
        )}
        {!readOnly && consultation.visitType === 'first' && (
          <LandIntakeButton consultation={consultation} />
        )}
        {!readOnly && (
          <AppButton
            variant="contained"
            size="small"
            color="success"
            startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
            loading={finalize.isPending}
            onClick={() => setConfirmOpen(true)}
          >
            Finalizar consulta
          </AppButton>
        )}
        {readOnly && (
          <AppButton variant="outlined" size="small" onClick={goBack}>
            Volver al expediente
          </AppButton>
        )}
      </Stack>

      <ConfirmDialog
        open={confirmOpen}
        title="Finalizar consulta"
        description={finalizeDescription(consultation)}
        confirmLabel="Finalizar"
        color="primary"
        isConfirming={finalize.isPending}
        onConfirm={() =>
          finalize.mutate(
            { status: 'completed' },
            { onSuccess: () => goBack() },
          )
        }
        onClose={() => setConfirmOpen(false)}
      />
    </Stack>
  )
}
