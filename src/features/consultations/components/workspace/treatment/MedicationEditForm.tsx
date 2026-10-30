import { Autocomplete, Checkbox, Divider, FormControlLabel, Stack, TextField, Typography } from '@mui/material'
import { useMedications } from '@/features/catalogs'
import { MedicationFrequencyField } from '@/features/patient-medications'
import { useCaptureDraftState } from '@/hooks/useCaptureDraftState'
import { useCaptureConsultationMedication } from '../../../hooks/useConsultationMedications'
import { ADHERENCE_LABELS, TOLERANCE_LABELS } from '../../../utils/consultation-format'
import { CaptureToggleField } from '../../encounter/CaptureToggleField'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import { medicationName } from './medication-name'
import { MedicationFinishBox } from './MedicationFinishBox'
import type { CaptureMedicationInput, ConsultationMedication, MedicationAdherence, MedicationRamStatus } from '../../../types'

const ADHERENCES: MedicationAdherence[] = ['good', 'partial', 'poor']
const TOLERANCES: MedicationRamStatus[] = ['none', 'suspected', 'confirmed']

type EditValues = {
  dose: string
  frequency: string
  replacementId: number | null
  adherence: MedicationAdherence | null
  adherenceNotes: string
  ramStatus: MedicationRamStatus | null
  ramNotes: string
  suspendForRam: boolean
}

const toValues = (m: ConsultationMedication): EditValues => ({
  dose: m.dose ?? '',
  frequency: m.frequency ?? '',
  replacementId: null,
  adherence: m.adherence,
  adherenceNotes: m.adherenceNotes ?? '',
  ramStatus: m.ramStatus,
  ramNotes: m.ramNotes ?? '',
  suspendForRam: false,
})

type MedicationEditFormProps = {
  consultationId: number
  medication: ConsultationMedication
}

// Revisión de un medicamento: dosis y frecuencia, reemplazo, adherencia,
// tolerancia y fin del tratamiento.
export function MedicationEditForm({ consultationId, medication }: MedicationEditFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const { data: catalog = [] } = useMedications()
  const capture = useCaptureConsultationMedication(consultationId)
  const [values, setValues, clearDraft] = useCaptureDraftState<EditValues>(`workspace.medication.${medication.id}`, () => toValues(medication))
  const set = (patch: Partial<EditValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const done = () => { clearDraft(); clearEdit() }
  const save = (input: CaptureMedicationInput) => capture.mutate({ medicationId: medication.id, input }, { onSuccess: done })

  const replacement = catalog.find((item) => item.id === values.replacementId) ?? null
  const doseChanged = values.dose.trim() !== (medication.dose ?? '')
  const frequencyChanged = values.frequency.trim() !== (medication.frequency ?? '')

  function submit() {
    save({
      dose: doseChanged ? values.dose.trim() : undefined,
      frequency: frequencyChanged ? values.frequency.trim() : undefined,
      adherence: values.adherence ?? undefined,
      adherenceNotes: values.adherence ? values.adherenceNotes.trim() || undefined : undefined,
      ramStatus: values.ramStatus ?? undefined,
      ramNotes: values.ramStatus && values.ramStatus !== 'none' ? values.ramNotes.trim() || undefined : undefined,
      replacementMedicationId: replacement && replacement.id !== medication.medicationId ? replacement.id : undefined,
      discontinue: values.suspendForRam || undefined,
      discontinuationReason: values.suspendForRam ? 'Efecto adverso limitante' : undefined,
    })
  }

  return (
    <Stack spacing={2}>
      <CaptureHeader name={medicationName(medication)} code={[medication.genericName, medication.presentationName].filter(Boolean).join(' · ')} />
      <TextField size="small" label="Dosis" value={values.dose} onChange={(event) => set({ dose: event.target.value })} />
      <MedicationFrequencyField value={values.frequency} onChange={(frequency) => set({ frequency })} />
      <Autocomplete
        size="small"
        options={catalog.filter((item) => item.active)}
        getOptionLabel={(item) => (item.concentration ? `${item.brandName || item.genericName} ${item.concentration}` : item.brandName || item.genericName)}
        value={replacement}
        onChange={(_event, item) => set({ replacementId: item?.id ?? null })}
        renderInput={(params) => <TextField {...params} label="Reemplazar por otro medicamento (opcional)" />}
      />
      <CaptureToggleField
        title="Adherencia"
        options={ADHERENCES}
        labels={ADHERENCE_LABELS}
        value={values.adherence}
        onChange={(adherence) => set({ adherence })}
        showNotes={values.adherence !== null}
        notes={values.adherenceNotes}
        onNotesChange={(adherenceNotes) => set({ adherenceNotes })}
        notesPlaceholder="Notas de adherencia…"
      />
      <CaptureToggleField
        title="Tolerancia"
        options={TOLERANCES}
        labels={TOLERANCE_LABELS}
        value={values.ramStatus}
        onChange={(ramStatus) => set({ ramStatus, suspendForRam: ramStatus === 'confirmed' && values.suspendForRam })}
        showNotes={values.ramStatus !== null && values.ramStatus !== 'none'}
        notes={values.ramNotes}
        onNotesChange={(ramNotes) => set({ ramNotes })}
        notesPlaceholder="Notas de tolerancia…"
        dangerOption="confirmed"
      >
        {values.ramStatus === 'confirmed' && (
          <FormControlLabel
            sx={{ mt: 0.5 }}
            control={<Checkbox size="small" color="error" checked={values.suspendForRam} onChange={(event) => set({ suspendForRam: event.target.checked })} />}
            label={<Typography sx={{ fontSize: '12px' }}>Suspender el medicamento por este efecto adverso limitante</Typography>}
          />
        )}
      </CaptureToggleField>
      <CaptureActions editing loading={capture.isPending} onSubmit={submit} onCancel={done} />
      <Divider />
      <MedicationFinishBox loading={capture.isPending} onFinish={(reason) => save({ discontinue: true, discontinuationReason: reason })} />
    </Stack>
  )
}
