import { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import type { Consultation } from '../../types'

interface EncounterHeaderProps {
  consultation: Consultation
  readOnly: boolean
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
        description="Al finalizar, la consulta queda cerrada y su información se refleja en la historia. ¿Continuar?"
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
