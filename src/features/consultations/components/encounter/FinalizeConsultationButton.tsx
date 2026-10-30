import { useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useUpdateConsultation } from '../../hooks/useConsultationDetail'
import {
  clearConsultationDraft,
  flushBeforeFinalize,
} from '../../hooks/useConsultationLocalBackup'
import { countErrors, validateExam } from '@/features/physical-exam'
import type { Consultation } from '../../types'

interface FinalizeConsultationButtonProps {
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

// "Finalizar consulta" (en curso) o "Volver al expediente" (solo lectura), en la
// barra del paciente.
export function FinalizeConsultationButton({ consultation, readOnly }: FinalizeConsultationButtonProps) {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [flushing, setFlushing] = useState(false)
  const finalize = useUpdateConsultation(consultation.id)

  function goBack() {
    navigate({
      to: '/pacientes/$patientId/consultas',
      params: { patientId: String(consultation.patientId) },
    })
  }

  // Primero llega a la base lo pendiente del respaldo local; al finalizar se borra.
  async function finalizeConsultation() {
    setFlushing(true)
    const ready = await flushBeforeFinalize(consultation.id)
    setFlushing(false)
    if (!ready) return
    finalize.mutate(
      { status: 'completed' },
      {
        onSuccess: () => {
          clearConsultationDraft(consultation.id)
          goBack()
        },
      },
    )
  }

  if (readOnly) {
    return (
      <AppButton
        variant="contained"
        size="small"
        color="inherit"
        startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
        onClick={goBack}
        sx={{ color: 'text.primary' }}
      >
        Volver al expediente
      </AppButton>
    )
  }

  return (
    <>
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
      <ConfirmDialog
        open={confirmOpen}
        title="Finalizar consulta"
        description={finalizeDescription(consultation)}
        confirmLabel="Finalizar"
        color="primary"
        isConfirming={flushing || finalize.isPending}
        onConfirm={finalizeConsultation}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}
