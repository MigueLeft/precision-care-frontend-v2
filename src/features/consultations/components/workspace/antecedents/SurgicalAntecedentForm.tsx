import { Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { CatalogPicker, type CatalogPick } from '@/components/ui/CatalogPicker'
import { PartialDateField } from '@/components/ui/PartialDateField'
import { useHospitalizationCatalog, useSurgeryCatalog } from '@/features/catalogs'
import { useCreateAntecedent, type Antecedent } from '@/features/antecedents'
import { useCaptureDraftState } from '@/hooks/useCaptureDraftState'
import { buildSurgicalAntecedentPayload } from '../../../utils/surgical-antecedent-payload'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import { useAntecedentEdit } from './useAntecedentEdit'

type SurgicalValues = { event: CatalogPick | null; date: string; complications: string }
const EMPTY: SurgicalValues = { event: null, date: '', complications: '' }

type SurgicalAntecedentFormProps = {
  patientId: number
  type: 'surgery' | 'hospitalization'
  // Antecedente en edición; null = registro nuevo.
  antecedent: Antecedent | null
}

function toValues(antecedent: Antecedent): SurgicalValues {
  const surgery = antecedent.surgeryDetail
  const hospitalization = antecedent.hospitalizationDetail
  return {
    event: { name: antecedent.name },
    date: (hospitalization?.admissionDate ?? antecedent.eventDate) || '',
    complications: (surgery?.complications ?? hospitalization?.complications) || '',
  }
}

// Cirugía (surgery_catalog) u hospitalización (hospitalization_catalog) con
// su fecha y complicaciones.
export function SurgicalAntecedentForm({ patientId, type, antecedent }: SurgicalAntecedentFormProps) {
  const { clearEdit } = useEncounterWorkspace()
  const { data: surgeries = [] } = useSurgeryCatalog()
  const { data: hospitalizations = [] } = useHospitalizationCatalog()
  const [values, setValues, clearDraft] = useCaptureDraftState<SurgicalValues>(
    `workspace.antecedent.${type}.${antecedent?.id ?? 'new'}`,
    () => (antecedent ? toValues(antecedent) : EMPTY),
  )
  const set = (patch: Partial<SurgicalValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const create = useCreateAntecedent(patientId, { onSuccess: () => setValues(EMPTY) })
  const done = () => { clearDraft(); clearEdit() }
  const edit = useAntecedentEdit(patientId, antecedent, done)
  const catalog = (type === 'surgery' ? surgeries : hospitalizations).filter((item) => item.active)
  const isSurgery = type === 'surgery'

  function submit() {
    const name = values.event?.name.trim()
    if (!name) return toast.error(isSurgery ? 'Busca y selecciona el procedimiento.' : 'Busca y selecciona el motivo de hospitalización.')
    if (antecedent) {
      return edit.save(
        isSurgery
          ? { eventDate: values.date, surgeryComplications: values.complications }
          : { eventDate: values.date, hospitalizationAdmissionDate: values.date, hospitalizationComplications: values.complications },
      )
    }
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
      {!antecedent && (
        <CatalogPicker
          options={catalog}
          value={values.event}
          onChange={(event) => set({ event })}
          placeholder={isSurgery ? 'Buscar procedimiento…' : 'Buscar motivo de hospitalización…'}
        />
      )}
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
