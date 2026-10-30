import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import { toast } from '@/utils/toast'
import {
  printDeliverable,
  useConsultationDrafts,
  usePrintConsultationDeliverable,
  useSavePrescription,
  type PrescriptionData,
  type PrescriptionDraftItem,
} from '@/features/deliverables'
import { useMedications, type Medication } from '@/features/catalogs'
import { DeliverableDialogActions } from '@/features/deliverables'
import { useConsultationMedications } from '../../hooks/useConsultationMedications'
import type { ConsultationMedication } from '../../types'
import { PrescriptionLineRow } from './PrescriptionLineRow'
import { fillIndication, isLineComplete, type PrescriptionLineState } from './prescription-lines'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

type PrescriptionDialogProps = {
  consultationId: number
  readOnly: boolean
  open: boolean
  onClose: () => void
}

const medName = (m: { brandName: string | null; genericName: string | null; concentration: string | null }) =>
  [m.brandName ?? m.genericName ?? 'Medicamento', m.concentration].filter(Boolean).join(' ')

// Líneas iniciales: el tratamiento vigente; lo que ya está en la receta va
// marcado. La indicación se precarga del catálogo; sin predefinida, en blanco.
function initialLines(
  meds: ConsultationMedication[],
  draft: PrescriptionDraftItem[],
  catalog: Medication[],
): PrescriptionLineState[] {
  return meds
    .filter((med) => med.status === 'current')
    .map((med) => {
      const saved = draft.find((item) => item.medicationId === med.medicationId)
      // La dosis por defecto es la concentración del medicamento.
      const dose = saved?.dose ?? med.concentration ?? med.dose ?? ''
      const frequency = saved?.frequency ?? med.frequency ?? ''
      const duration = saved?.duration ?? ''
      const name = medName(med)
      const predefined = catalog.find((item) => item.id === med.medicationId)?.defaultIndication
      const defaultInstructions = predefined ? fillIndication(predefined, name) : ''
      return {
        medicationId: med.medicationId,
        name,
        selected: !!saved,
        dose,
        frequency,
        duration,
        route: saved?.route ?? '',
        instructions: saved?.instructions || defaultInstructions,
        defaultInstructions,
      }
    })
}

type ContentProps = Omit<PrescriptionDialogProps, 'open'> & { initial: PrescriptionLineState[] }

function PrescriptionContent({ consultationId, readOnly, onClose, initial }: ContentProps) {
  const [lines, setLines] = useConsultationDraftState('prescription.lines', initial)
  const [showErrors, setShowErrors] = useState(false)
  const save = useSavePrescription(consultationId)
  const print = usePrintConsultationDeliverable(consultationId)

  const selected = lines.filter((line) => line.selected)
  // Última versión guardada: define si hay cambios pendientes.
  const [saved, setSaved] = useState(initial)
  const dirty = JSON.stringify(lines) !== JSON.stringify(saved)

  // Guardar reemplaza la receta de esta consulta (los errores se avisan con toast).
  async function handleSave() {
    if (!selected.every(isLineComplete)) {
      setShowErrors(true)
      toast.error('Escribe la indicación de cada medicamento marcado.')
      return
    }
    try {
      await save.mutateAsync({
        items: selected.map((line) => ({
          medicationId: line.medicationId,
          dose: line.dose.trim() || undefined,
          frequency: line.frequency.trim() || undefined,
          duration: line.duration.trim() || undefined,
          route: line.route.trim() || undefined,
          instructions: line.instructions.trim(),
        })),
      })
      setSaved(lines)
    } catch {
      /* toast */
    }
  }

  async function handlePrint() {
    try {
      const { deliverable } = await print.mutateAsync('prescription')
      printDeliverable({ type: 'prescription', data: deliverable.data as unknown as PrescriptionData })
    } catch {
      /* toast */
    }
  }

  return (
    <>
      <DialogTitle>Receta médica</DialogTitle>
      <DialogContent>
        {lines.length === 0 ? (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontStyle: 'italic' }}>
            El paciente no tiene medicamentos vigentes en el tratamiento.
          </Typography>
        ) : (
          lines.map((line) => (
            <PrescriptionLineRow
              key={line.medicationId}
              line={line}
              readOnly={readOnly}
              showErrors={showErrors}
              onChange={(patch) =>
                setLines((prev) =>
                  prev.map((l) => (l.medicationId === line.medicationId ? { ...l, ...patch } : l)),
                )
              }
            />
          ))
        )}
      </DialogContent>
      <DeliverableDialogActions
        readOnly={readOnly}
        dirty={dirty}
        hasSaved={saved.some((line) => line.selected)}
        canSave={selected.length > 0 || saved.some((line) => line.selected)}
        saving={save.isPending}
        printing={print.isPending}
        onClose={onClose}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    </>
  )
}

export function PrescriptionDialog({ open, ...props }: PrescriptionDialogProps) {
  const { data: drafts } = useConsultationDrafts(props.consultationId)
  const { data: medications } = useConsultationMedications(props.consultationId)
  const { data: catalog } = useMedications()
  const ready = !!drafts && !!medications && !!catalog
  return (
    // Sin cierre por clic afuera: "Cerrar" guarda los cambios en espera.
    <Dialog open={open && ready} maxWidth="md" fullWidth>
      {ready && (
        <PrescriptionContent
          {...props}
          initial={initialLines(medications, drafts.prescription.items, catalog)}
        />
      )}
    </Dialog>
  )
}
