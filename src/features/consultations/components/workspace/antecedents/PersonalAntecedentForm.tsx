import { MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { PartialDateField } from '@/components/ui/PartialDateField'
import { useDiseases } from '@/features/catalogs'
import {
  ANTECEDENT_STATUS_LABELS,
  useAntecedentDiseaseOptions,
  useCreateAntecedent,
  type AntecedentStatus,
} from '@/features/antecedents'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'

const STATUSES = Object.keys(ANTECEDENT_STATUS_LABELS) as AntecedentStatus[]

type PersonalValues = { condition: CatalogPick | null; since: string; status: AntecedentStatus; notes: string }
const EMPTY: PersonalValues = { condition: null, since: '', status: 'active', notes: '' }

// Antecedente personal patológico: condición, desde cuándo, estado y notas.
export function PersonalAntecedentForm({ patientId }: { patientId: number }) {
  const options = useAntecedentDiseaseOptions()
  const { data: diseases = [] } = useDiseases()
  const [values, setValues] = useConsultationDraftState<PersonalValues>('workspace.antecedent.personal', EMPTY)
  const set = (patch: Partial<PersonalValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const create = useCreateAntecedent(patientId, { onSuccess: () => setValues(EMPTY) })
  const code = diseases.find((disease) => disease.id === values.condition?.catalogId)?.code

  function submit() {
    const name = values.condition?.name.trim()
    if (!name) return toast.error('Busca y selecciona la condición o padecimiento.')
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
      <CatalogPicker
        options={options}
        value={values.condition}
        onChange={(condition) => set({ condition })}
        placeholder="Buscar condición o padecimiento…"
      />
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
          <CaptureActions editing={false} loading={create.isPending} onSubmit={submit} onCancel={() => setValues(EMPTY)} />
        </>
      )}
    </Stack>
  )
}
