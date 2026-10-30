import { Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { PartialDateField } from '@/components/ui/PartialDateField'
import { useDiseases } from '@/features/catalogs'
import { useAntecedentDiseaseOptions } from '@/features/antecedents'
import { isLettersOnly } from '@/utils/text-validation'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { useAddConsultationDisease, useUpdateConsultationDisease } from '../../../hooks/useConsultationDiseases'
import { DISEASE_STATUS_LABELS, diseaseStatusOptions } from '../../../utils/consultation-format'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import type { ConsultationDisease, DiseaseStatus } from '../../../types'

type DiseaseFormValues = {
  pick: CatalogPick | null
  // Solo para un diagnóstico escrito a mano (el del catálogo ya lo indica).
  manualChronic: boolean
  status: DiseaseStatus
  dxDate: string
  notes: string
}

const EMPTY: DiseaseFormValues = { pick: null, manualChronic: false, status: 'active', dxDate: '', notes: '' }

type DiseaseCaptureFormProps = {
  consultationId: number
  current: ConsultationDisease[]
  // Diagnóstico en edición; null = registro nuevo.
  disease: ConsultationDisease | null
}

// Captura de un diagnóstico: buscador, estado (según sea crónico o agudo),
// fecha de diagnóstico y notas.
export function DiseaseCaptureForm({ consultationId, current, disease }: DiseaseCaptureFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const { data: catalog = [] } = useDiseases()
  const diseaseOptions = useAntecedentDiseaseOptions()
  const addMutation = useAddConsultationDisease(consultationId)
  const updateMutation = useUpdateConsultationDisease(consultationId)
  const [values, setValues, clearDraft] = useConsultationDraftState<DiseaseFormValues>(
    `workspace.disease.${disease?.id ?? 'new'}`,
    () =>
      disease
        ? { pick: { name: disease.name ?? '', catalogId: disease.diseaseCatalogId }, manualChronic: false, status: disease.status, dxDate: disease.dxDate ?? '', notes: disease.notes ?? '' }
        : EMPTY,
  )
  const set = (patch: Partial<DiseaseFormValues>) => setValues((prev) => ({ ...prev, ...patch }))

  const used = new Set(current.map((item) => item.diseaseCatalogId))
  const selected = catalog.find((item) => item.id === values.pick?.catalogId)
  const isChronic = disease ? !!disease.isChronic : selected ? selected.isChronic : values.manualChronic
  const options = diseaseStatusOptions(isChronic)
  const statusOptions = options.includes(values.status) ? options : disease ? [values.status, ...options] : options
  const status = statusOptions.includes(values.status) ? values.status : statusOptions[0]

  function submit() {
    const notes = values.notes.trim()
    if (disease) {
      updateMutation.mutate(
        { diseaseId: disease.id, input: { status, dxDate: values.dxDate, notes } },
        { onSuccess: () => { clearDraft(); clearEdit() } },
      )
      return
    }
    const name = values.pick?.name.trim()
    if (!name) return toast.error('Busca y selecciona el diagnóstico.')
    const catalogId = values.pick?.catalogId
    if (!catalogId && !isLettersOnly(name)) {
      return toast.error('La enfermedad solo puede contener letras, sin números ni caracteres especiales.')
    }
    if (catalogId && used.has(catalogId)) return toast.error('Ese diagnóstico ya está registrado: edítalo desde la lista.')
    addMutation.mutate(
      {
        diseaseCatalogId: catalogId,
        name: catalogId ? undefined : name,
        isChronic: catalogId ? undefined : values.manualChronic,
        status,
        dxDate: values.dxDate || undefined,
        notes: notes || undefined,
      },
      { onSuccess: () => setValues(EMPTY) },
    )
  }

  return (
    <Stack spacing={2}>
      {!disease && (
        <CatalogPicker
          options={diseaseOptions.filter((option) => !used.has(option.id))}
          value={values.pick}
          onChange={(pick) => set({ pick })}
          placeholder="Buscar diagnóstico…"
        />
      )}

      {values.pick && (
        <>
          <CaptureHeader name={values.pick.name} code={disease?.code ?? selected?.code} />
          {!disease && !values.pick.catalogId && (
            <FormControlLabel
              control={<Checkbox size="small" checked={values.manualChronic} onChange={(event) => set({ manualChronic: event.target.checked })} />}
              label="Enfermedad crónica"
            />
          )}
          <TextField select size="small" label="Estado" value={status} onChange={(event) => set({ status: event.target.value as DiseaseStatus })}>
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {DISEASE_STATUS_LABELS[option]}
              </MenuItem>
            ))}
          </TextField>
          <PartialDateField
            label="Fecha de diagnóstico (vacío = fecha de la consulta)"
            value={values.dxDate}
            onChange={(dxDate) => set({ dxDate })}
          />
          <TextField
            size="small"
            label="Notas del diagnóstico"
            multiline
            minRows={3}
            value={values.notes}
            onChange={(event) => set({ notes: event.target.value })}
          />
          <CaptureActions
            editing={!!disease}
            loading={addMutation.isPending || updateMutation.isPending}
            onSubmit={submit}
            onCancel={disease ? () => { clearDraft(); clearEdit() } : () => setValues(EMPTY)}
          />
        </>
      )}
    </Stack>
  )
}
