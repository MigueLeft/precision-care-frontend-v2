import { Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { OptionButtons } from '@/components/ui/OptionButtons'
import { useAllergyCatalog, useAllergySeverities, useAllergyTypes } from '@/features/catalogs'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import {
  useAddConsultationAllergy,
  useConsultationAllergies,
  useSetNoKnownAllergies,
  useUpdateConsultationAllergy,
} from '../../../hooks/useConsultationAllergies'
import { CaptureActions, CaptureField, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import type { ConsultationAllergy } from '../../../types'

type AllergyValues = { typeId: number | ''; agent: CatalogPick | null; severityId: number | null; onsetYear: string; reaction: string }
const EMPTY: AllergyValues = { typeId: '', agent: null, severityId: null, onsetYear: '', reaction: '' }

const toValues = (allergy: ConsultationAllergy): AllergyValues => ({
  typeId: allergy.typeId ?? '',
  agent: { name: allergy.name ?? '—', catalogId: allergy.allergyCatalogId },
  severityId: allergy.severityId,
  onsetYear: allergy.onsetYear ? String(allergy.onsetYear) : '',
  reaction: allergy.reaction ?? '',
})

type AllergyCaptureFormProps = {
  consultationId: number
  // Alergia en edición (el agente no cambia); null = registro nuevo.
  allergy: ConsultationAllergy | null
}

// Alergia: tipo, agente causal, severidad, año de inicio y reacción.
export function AllergyCaptureForm({ consultationId, allergy }: AllergyCaptureFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const { data: catalog = [] } = useAllergyCatalog()
  const { data: types = [] } = useAllergyTypes()
  const { data: severities = [] } = useAllergySeverities()
  const { data: allergyData } = useConsultationAllergies(consultationId)
  const flag = useSetNoKnownAllergies(consultationId)
  const [values, setValues, clearDraft] = useConsultationDraftState<AllergyValues>(
    `workspace.antecedent.allergy.${allergy?.id ?? 'new'}`,
    () => (allergy ? toValues(allergy) : EMPTY),
  )
  const set = (patch: Partial<AllergyValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const done = () => { clearDraft(); clearEdit() }
  const add = useAddConsultationAllergy(consultationId, { onSuccess: () => setValues(EMPTY) })
  const update = useUpdateConsultationAllergy(consultationId, { onSuccess: done })

  const allergies = allergyData?.allergies ?? []
  const used = new Set(allergies.map((item) => item.allergyCatalogId))
  const options = catalog.filter((item) => item.active && !used.has(item.id) && (values.typeId === '' || item.typeId === values.typeId))
  const picked = catalog.find((item) => item.id === values.agent?.catalogId)
  const typeName = allergy?.typeName ?? types.find((type) => type.id === (picked?.typeId ?? values.typeId))?.name

  function submit() {
    if (!values.agent?.name.trim()) return toast.error('Busca y selecciona el agente causal.')
    if (!values.agent.catalogId && values.typeId === '') return toast.error('Indica el tipo de alergia.')
    if (!values.severityId) return toast.error('Selecciona la severidad de la alergia.')
    const year = Number(values.onsetYear)
    const onsetYear = values.onsetYear && !Number.isNaN(year) ? year : undefined
    if (allergy) {
      update.mutate({
        allergyId: allergy.id,
        input: { severityId: values.severityId, reaction: values.reaction.trim() || null, onsetYear: onsetYear ?? null },
      })
      return
    }
    add.mutate({
      allergyCatalogId: values.agent.catalogId,
      name: values.agent.catalogId ? undefined : values.agent.name.trim(),
      typeId: values.agent.catalogId ? undefined : Number(values.typeId),
      severityId: values.severityId,
      reaction: values.reaction.trim() || undefined,
      onsetYear,
    })
  }

  return (
    <Stack spacing={2}>
      {!allergy && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={allergyData?.noKnownAllergies ?? false}
                disabled={allergies.length > 0 || flag.isPending}
                onChange={(event) => flag.mutate(event.target.checked)}
              />
            }
            label="Sin alergias conocidas"
          />
          <TextField select size="small" label="Tipo" value={values.typeId} onChange={(event) => set({ typeId: Number(event.target.value), agent: null })}>
            {types.filter((type) => type.active).map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
          <CatalogPicker options={options} value={values.agent} onChange={(agent) => set({ agent })} placeholder="Buscar agente causal…" />
        </>
      )}
      {values.agent && (
        <>
          <CaptureHeader name={values.agent.name} code={typeName} />
          <CaptureField label="Severidad">
            <OptionButtons
              ariaLabel="Severidad de la alergia"
              options={severities.filter((item) => item.active).map((item) => ({ value: item.id, label: item.name }))}
              value={values.severityId}
              onChange={(severityId) => set({ severityId })}
            />
          </CaptureField>
          <TextField
            size="small"
            label="Año de inicio"
            value={values.onsetYear}
            onChange={(event) => set({ onsetYear: event.target.value.replace(/\D/g, '').slice(0, 4) })}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />
          <TextField size="small" label="Reacción" multiline minRows={2} value={values.reaction} onChange={(event) => set({ reaction: event.target.value })} />
          <CaptureActions
            editing={!!allergy}
            loading={add.isPending || update.isPending}
            onSubmit={submit}
            onCancel={allergy ? done : () => setValues(EMPTY)}
          />
        </>
      )}
    </Stack>
  )
}
