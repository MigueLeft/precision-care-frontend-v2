import { MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { PartialDateField } from '@/components/ui/PartialDateField'
import { useDiseases } from '@/features/catalogs'
import {
  ANTECEDENT_STATUS_LABELS,
  useAntecedentDiseaseOptions,
  useCreateAntecedent,
  type Antecedent,
  type AntecedentStatus,
} from '@/features/antecedents'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import { useAntecedentEdit } from './useAntecedentEdit'

const STATUSES = Object.keys(ANTECEDENT_STATUS_LABELS) as AntecedentStatus[]

type PersonalValues = { condition: CatalogPick | null; since: string; status: AntecedentStatus; notes: string }
const EMPTY: PersonalValues = { condition: null, since: '', status: 'active', notes: '' }

type PersonalAntecedentFormProps = {
  patientId: number
  // Antecedente en edición; null = registro nuevo.
  antecedent: Antecedent | null
}

// Antecedente personal patológico: condición, desde cuándo, estado y notas.
export function PersonalAntecedentForm({ patientId, antecedent }: PersonalAntecedentFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const options = useAntecedentDiseaseOptions()
  const { data: diseases = [] } = useDiseases()
  const [values, setValues, clearDraft] = useConsultationDraftState<PersonalValues>(
    `workspace.antecedent.personal.${antecedent?.id ?? 'new'}`,
    () =>
      antecedent
        ? {
            condition: { name: antecedent.name, catalogId: antecedent.diseaseCatalogId ?? undefined },
            since: antecedent.eventDate ?? '',
            status: antecedent.status ?? 'active',
            notes: antecedent.description ?? '',
          }
        : EMPTY,
  )
  const set = (patch: Partial<PersonalValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const create = useCreateAntecedent(patientId, { onSuccess: () => setValues(EMPTY) })
  const done = () => { clearDraft(); clearEdit() }
  const edit = useAntecedentEdit(patientId, antecedent, done)
  const code = antecedent?.cie10Code ?? diseases.find((disease) => disease.id === values.condition?.catalogId)?.code

  function submit() {
    const name = values.condition?.name.trim()
    if (!name) return toast.error('Busca y selecciona la condición o padecimiento.')
    if (antecedent) return edit.save({ eventDate: values.since, status: values.status, description: values.notes })
    create.mutate({
      patientId,
      type: 'personal',
      name,
      diseaseCatalogId: values.condition?.catalogId,
      eventDate: values.since || undefined,
      status: values.status,
      description: values.notes.trim() || undefined,
    })
  }

  return (
    <Stack spacing={2}>
      {!antecedent && (
        <CatalogPicker
          options={options}
          value={values.condition}
          onChange={(condition) => set({ condition })}
          placeholder="Buscar condición o padecimiento…"
        />
      )}
      {values.condition && (
        <>
          <CaptureHeader name={values.condition.name} code={code} />
          <PartialDateField label="Desde" value={values.since} onChange={(since) => set({ since })} />
          <TextField select size="small" label="Estado" value={values.status} onChange={(event) => set({ status: event.target.value as AntecedentStatus })}>
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {ANTECEDENT_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>
          <TextField size="small" label="Notas" multiline minRows={2} value={values.notes} onChange={(event) => set({ notes: event.target.value })} />
          <CaptureActions
            editing={!!antecedent}
            loading={create.isPending || edit.isPending}
            onSubmit={submit}
            onCancel={antecedent ? done : () => setValues(EMPTY)}
          />
        </>
      )}
    </Stack>
  )
}
