import { MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker } from '@/components/ui/CatalogPicker'
import { OptionButtons } from '@/components/ui/OptionButtons'
import { PartialDateField } from '@/components/ui/PartialDateField'
import { useSymptoms, useSymptomSeverities } from '@/features/catalogs'
import { isLettersOnly } from '@/utils/text-validation'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { useAddConsultationSymptom, useCaptureConsultationSymptom } from '../../../hooks/useConsultationDetail'
import { SYMPTOM_STATUSES, SYMPTOM_STATUS_LABELS } from '../../../utils/consultation-format'
import { CaptureActions, CaptureField, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import { LinkedDiagnosesField } from './LinkedDiagnosesField'
import { EMPTY_SYMPTOM_FORM, symptomToForm, toAddSymptomInput, toDiseaseInputs, type SymptomFormValues } from './symptom-form'
import type { ConsultationSymptom, SymptomStatus } from '../../../types'

type SymptomCaptureFormProps = {
  consultationId: number
  // Síntomas ya en la consulta (no se ofrecen de nuevo en el buscador).
  current: ConsultationSymptom[]
  // Síntoma en edición; null = registro nuevo.
  symptom: ConsultationSymptom | null
}

// Captura de un síntoma: buscador, severidad, inicio, estado, notas y
// diagnósticos asociados. Lo escrito queda respaldado como borrador.
export function SymptomCaptureForm({ consultationId, current, symptom }: SymptomCaptureFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const { data: catalog = [] } = useSymptoms()
  const { data: severities = [] } = useSymptomSeverities()
  const addMutation = useAddConsultationSymptom(consultationId)
  const captureMutation = useCaptureConsultationSymptom(consultationId)
  const [values, setValues, clearDraft] = useConsultationDraftState<SymptomFormValues>(
    `workspace.symptom.${symptom?.id ?? 'new'}`,
    () => (symptom ? symptomToForm(symptom) : EMPTY_SYMPTOM_FORM),
  )
  const set = (patch: Partial<SymptomFormValues>) => setValues((prev) => ({ ...prev, ...patch }))

  const used = new Set(current.map((item) => (item.name ?? '').toLowerCase()))
  const options = catalog.filter((item) => item.active && !used.has(item.name.toLowerCase()))

  function submit() {
    if (symptom) {
      const input = {
        symptomSeverityId: values.severityId,
        status: values.status,
        onsetDate: values.onsetDate,
        notes: values.notes.trim(),
        diseases: toDiseaseInputs(values.diseases),
      }
      captureMutation.mutate(
        { symptomId: symptom.id, input },
        { onSuccess: () => { toast.success('Síntoma actualizado'); clearDraft(); clearEdit() } },
      )
      return
    }
    const name = values.pick?.name.trim()
    if (!name) return toast.error('Busca y selecciona el síntoma.')
    if (!values.pick?.catalogId && !isLettersOnly(name)) {
      return toast.error('El síntoma solo puede contener letras, sin números ni caracteres especiales.')
    }
    if (used.has(name.toLowerCase())) return toast.error('Ese síntoma ya está en la consulta: edítalo desde la lista.')
    addMutation.mutate(toAddSymptomInput(values), {
      onSuccess: () => { toast.success('Síntoma agregado'); setValues(EMPTY_SYMPTOM_FORM) },
    })
  }

  return (
    <Stack spacing={2}>
      {!symptom && (
        <CatalogPicker
          options={options.map((item) => ({ id: item.id, name: item.name }))}
          value={values.pick}
          onChange={(pick) => set({ pick })}
          placeholder="Buscar síntoma…"
        />
      )}

      {values.pick && (
        <>
          <CaptureHeader name={values.pick.name} />
          <CaptureField label="Severidad">
            <OptionButtons
              ariaLabel="Severidad"
              options={severities.filter((item) => item.active).map((item) => ({ value: item.id, label: item.name }))}
              value={values.severityId}
              onChange={(severityId) => set({ severityId })}
            />
          </CaptureField>
          <PartialDateField label="Fecha de inicio" value={values.onsetDate} onChange={(onsetDate) => set({ onsetDate })} />
          <TextField select size="small" label="Estado" value={values.status} onChange={(event) => set({ status: event.target.value as SymptomStatus })}>
            {SYMPTOM_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {SYMPTOM_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Notas del síntoma"
            multiline
            minRows={3}
            value={values.notes}
            onChange={(event) => set({ notes: event.target.value })}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
          <CaptureField label="Diagnósticos asociados">
            <LinkedDiagnosesField consultationId={consultationId} value={values.diseases} onChange={(diseases) => set({ diseases })} />
          </CaptureField>
          <CaptureActions
            editing={!!symptom}
            loading={addMutation.isPending || captureMutation.isPending}
            onSubmit={submit}
            onCancel={symptom ? () => { clearDraft(); clearEdit() } : () => setValues(EMPTY_SYMPTOM_FORM)}
          />
        </>
      )}
    </Stack>
  )
}
