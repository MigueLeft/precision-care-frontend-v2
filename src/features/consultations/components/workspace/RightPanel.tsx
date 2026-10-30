import { IconButton, Stack, Tooltip, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { IntakeResponseDetailContent } from '@/features/intake-responses'
import { AntecedentCapturePanel } from './antecedents/AntecedentCapturePanel'
import { DiseaseCapturePanel } from './diseases/DiseaseCapturePanel'
import { PinIntakeButton } from './IntakesView'
import { SymptomCapturePanel } from './symptoms/SymptomCapturePanel'
import { MedicationCapturePanel } from './treatment/MedicationCapturePanel'
import { useEncounterWorkspace } from './workspace-context'
import { isCaptureSection, type CaptureSectionId } from './workspace-sections'
import type { Consultation } from '../../types'

type RightPanelProps = {
  consultation: Consultation
  readOnly: boolean
}

const CAPTURE_TITLES: Record<CaptureSectionId, [add: string, edit: string]> = {
  antecedents: ['Agregar antecedente', 'Editar antecedente'],
  symptoms: ['Agregar síntoma', 'Editar síntoma'],
  treatment: ['Agregar medicamento', 'Revisar medicamento'],
  diagnoses: ['Agregar diagnóstico', 'Editar diagnóstico'],
}

// Panel derecho: la captura rápida del apartado (Antecedentes, Síntomas,
// Diagnósticos) y/o el ingresable fijado. Con ambos se alterna con flechas.
export function RightPanel({ consultation, readOnly }: RightPanelProps) {
  const { section, editing, pinnedIntakeId, rightView, setRightView } = useEncounterWorkspace()
  const captureSection = !readOnly && isCaptureSection(section) ? section : null
  const showPinned = pinnedIntakeId !== null && (rightView === 'pinned' || !captureSection)
  const both = pinnedIntakeId !== null && captureSection !== null
  const captureTitle = captureSection ? CAPTURE_TITLES[captureSection][editing ? 1 : 0] : ''

  return (
    <Stack spacing={2}>
      {both && (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', borderRadius: '6px', px: 0.5 }}>
          <Tooltip title="Captura">
            <span>
              <IconButton size="small" aria-label="Ver captura" disabled={!showPinned} onClick={() => setRightView('capture')}>
                <ChevronLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>
            {showPinned ? 'Ingresable fijado · 2/2' : `${captureTitle} · 1/2`}
          </Typography>
          <Tooltip title="Ingresable fijado">
            <span>
              <IconButton size="small" aria-label="Ver ingresable fijado" disabled={showPinned} onClick={() => setRightView('pinned')}>
                <ChevronRightIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      )}

      {showPinned && pinnedIntakeId !== null ? (
        <IntakeResponseDetailContent responseId={pinnedIntakeId} headerAction={<PinIntakeButton responseId={pinnedIntakeId} />} />
      ) : (
        captureSection && (
          <>
            <Typography variant="h3">{captureTitle}</Typography>
            {captureSection === 'symptoms' && <SymptomCapturePanel consultationId={consultation.id} />}
            {captureSection === 'diagnoses' && <DiseaseCapturePanel consultationId={consultation.id} />}
            {captureSection === 'treatment' && <MedicationCapturePanel consultationId={consultation.id} />}
            {captureSection === 'antecedents' && (
              <AntecedentCapturePanel patientId={consultation.patientId} consultationId={consultation.id} />
            )}
          </>
        )
      )}
    </Stack>
  )
}
