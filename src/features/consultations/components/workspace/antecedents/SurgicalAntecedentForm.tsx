import { Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { PartialDateField } from '@/components/ui/PartialDateField'
import { useHospitalizationCatalog, useSurgeryCatalog } from '@/features/catalogs'
import { useCreateAntecedent } from '@/features/antecedents'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { buildSurgicalAntecedentPayload } from '../../../utils/surgical-antecedent-payload'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'

type SurgicalValues = { event: CatalogPick | null; date: string; complications: string }
const EMPTY: SurgicalValues = { event: null, date: '', complications: '' }

type SurgicalAntecedentFormProps = {
  patientId: number
  type: 'surgery' | 'hospitalization'
}

// Cirugía (surgery_catalog) u hospitalización (hospitalization_catalog) con
// su fecha y complicaciones.
export function SurgicalAntecedentForm({ patientId, type }: SurgicalAntecedentFormProps) {
  const { data: surgeries = [] } = useSurgeryCatalog()
  const { data: hospitalizations = [] } = useHospitalizationCatalog()
  const [values, setValues] = useConsultationDraftState<SurgicalValues>(`workspace.antecedent.${type}`, EMPTY)
  const set = (patch: Partial<SurgicalValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const create = useCreateAntecedent(patientId, { onSuccess: () => setValues(EMPTY) })
  const catalog = (type === 'surgery' ? surgeries : hospitalizations).filter((item) => item.active)
  const isSurgery = type === 'surgery'

  function submit() {
    const name = values.event?.name.trim()
    if (!name) return toast.error(isSurgery ? 'Busca y selecciona el procedimiento.' : 'Busca y selecciona el motivo de hospitalización.')
    create.mutate(
      buildSurgicalAntecedentPayload({
        patientId,
        type,
        name,
        catalogId: values.event?.catalogId,
        date: values.date,
        complications: values.complications,
      }),
    )
  }

  return (
    <Stack spacing={2}>
      <CatalogPicker
        options={catalog}
        value={values.event}
        onChange={(event) => set({ event })}
        placeholder={isSurgery ? 'Buscar procedimiento…' : 'Buscar motivo de hospitalización…'}
      />
      {values.event && (
        <>
          <CaptureHeader name={values.event.name} code={isSurgery ? 'Cirugía' : 'Hospitalización'} />
          <PartialDateField label="Fecha" value={values.date} onChange={(date) => set({ date })} />
          <TextField
            size="small"
            label="Complicaciones"
            multiline
            minRows={2}
            value={values.complications}
            onChange={(event) => set({ complications: event.target.value })}
          />
          <CaptureActions editing={false} loading={create.isPending} onSubmit={submit} onCancel={() => setValues(EMPTY)} />
        </>
      )}
    </Stack>
  )
}
