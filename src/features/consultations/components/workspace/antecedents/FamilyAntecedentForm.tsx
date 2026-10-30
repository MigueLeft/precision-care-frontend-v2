import { MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { useDiseases } from '@/features/catalogs'
import { FAMILY_RELATIONSHIPS, useAntecedentDiseaseOptions, useCreateAntecedent, type Antecedent } from '@/features/antecedents'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import { useAntecedentEdit } from './useAntecedentEdit'

type FamilyValues = { condition: CatalogPick | null; relationship: string; notes: string }
const EMPTY: FamilyValues = { condition: null, relationship: '', notes: '' }

type FamilyAntecedentFormProps = {
  patientId: number
  // Antecedente en edición; null = registro nuevo.
  antecedent: Antecedent | null
}

// Antecedente heredofamiliar: condición del catálogo, parentesco y notas.
export function FamilyAntecedentForm({ patientId, antecedent }: FamilyAntecedentFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const options = useAntecedentDiseaseOptions()
  const { data: diseases = [] } = useDiseases()
  const [values, setValues, clearDraft] = useConsultationDraftState<FamilyValues>(
    `workspace.antecedent.family.${antecedent?.id ?? 'new'}`,
    () =>
      antecedent
        ? { condition: { name: antecedent.name, catalogId: antecedent.diseaseCatalogId ?? undefined }, relationship: antecedent.relationship ?? '', notes: antecedent.description ?? '' }
        : EMPTY,
  )
  const set = (patch: Partial<FamilyValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const create = useCreateAntecedent(patientId, { onSuccess: () => setValues(EMPTY) })
  const done = () => { clearDraft(); clearEdit() }
  const edit = useAntecedentEdit(patientId, antecedent, done)
  const code = antecedent?.cie10Code ?? diseases.find((disease) => disease.id === values.condition?.catalogId)?.code

  function submit() {
    const name = values.condition?.name.trim()
    if (!name) return toast.error('Busca y selecciona la condición.')
    if (!values.relationship) return toast.error('Selecciona el parentesco.')
    if (antecedent) return edit.save({ relationship: values.relationship, description: values.notes })
    create.mutate({
      patientId,
      type: 'family',
      relationship: values.relationship,
      name,
      diseaseCatalogId: values.condition?.catalogId,
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
          <TextField select size="small" label="Parentesco" value={values.relationship} onChange={(event) => set({ relationship: event.target.value })}>
            {FAMILY_RELATIONSHIPS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
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
