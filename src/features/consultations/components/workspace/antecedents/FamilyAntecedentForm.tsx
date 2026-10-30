import { MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { useDiseases } from '@/features/catalogs'
import { FAMILY_RELATIONSHIPS, useAntecedentDiseaseOptions, useCreateAntecedent } from '@/features/antecedents'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'

type FamilyValues = { condition: CatalogPick | null; relationship: string; notes: string }
const EMPTY: FamilyValues = { condition: null, relationship: '', notes: '' }

// Antecedente heredofamiliar: condición del catálogo, parentesco y notas.
export function FamilyAntecedentForm({ patientId }: { patientId: number }) {
  const options = useAntecedentDiseaseOptions()
  const { data: diseases = [] } = useDiseases()
  const [values, setValues] = useConsultationDraftState<FamilyValues>('workspace.antecedent.family', EMPTY)
  const set = (patch: Partial<FamilyValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const create = useCreateAntecedent(patientId, { onSuccess: () => setValues(EMPTY) })
  const code = diseases.find((disease) => disease.id === values.condition?.catalogId)?.code

  function submit() {
    const name = values.condition?.name.trim()
    if (!name) return toast.error('Busca y selecciona la condición.')
    if (!values.relationship) return toast.error('Selecciona el parentesco.')
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
      <CatalogPicker
        options={options}
        value={values.condition}
        onChange={(condition) => set({ condition })}
        placeholder="Buscar condición o padecimiento…"
      />
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
          <CaptureActions editing={false} loading={create.isPending} onSubmit={submit} onCancel={() => setValues(EMPTY)} />
        </>
      )}
    </Stack>
  )
}
