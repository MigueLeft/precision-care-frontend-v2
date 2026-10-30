import { useState } from 'react'
import { Autocomplete, Checkbox, FormControlLabel, MenuItem, Stack, TextField } from '@mui/material'
import { toast } from '@/utils/toast'
import { useMedicationPresentations, useMedications, type Medication } from '@/features/catalogs'
import { MedicationFrequencyField } from '@/features/patient-medications'
import { useCaptureDraftState } from '@/hooks/useCaptureDraftState'
import { useAddConsultationMedication } from '../../../hooks/useConsultationMedications'
import { EMPTY_MANUAL_MEDICATION, type ManualMedicationValue } from '../../../utils/manual-medication'
import { CaptureActions, CaptureHeader } from '../capture/CaptureLayout'

type AddValues = { medicationId: number | null; manual: boolean; manualMedication: ManualMedicationValue; dose: string; frequency: string }
const EMPTY: AddValues = { medicationId: null, manual: false, manualMedication: EMPTY_MANUAL_MEDICATION, dose: '', frequency: '' }

const optionLabel = (option: Medication) =>
  `${option.brandName} · ${option.genericName}${option.concentration ? ` ${option.concentration}` : ''}`

// Alta de un medicamento: del catálogo (o escrito a mano con su presentación),
// con su dosis y frecuencia.
export function MedicationAddForm({ consultationId }: { consultationId: number }) {
  const { data: catalog = [] } = useMedications()
  const { data: presentations = [] } = useMedicationPresentations()
  const [values, setValues] = useCaptureDraftState<AddValues>('workspace.medication.new', EMPTY)
  // Remonta el selector de frecuencia (cierra el "Otro" abierto) al limpiar.
  const [resetCount, setResetCount] = useState(0)
  const reset = () => {
    setValues(EMPTY)
    setResetCount((count) => count + 1)
  }
  const add = useAddConsultationMedication(consultationId, { onSuccess: reset })
  const set = (patch: Partial<AddValues>) => setValues((prev) => ({ ...prev, ...patch }))
  const setManual = (patch: Partial<ManualMedicationValue>) => set({ manualMedication: { ...values.manualMedication, ...patch } })

  const options = catalog.filter((item) => item.active)
  const selected = options.find((item) => item.id === values.medicationId) ?? null
  const manualName = values.manualMedication.name.trim()
  const headerName = values.manual ? manualName : selected ? `${selected.brandName} ${selected.concentration ?? ''}`.trim() : ''

  function submit() {
    if (!values.manual && !selected) return toast.error('Busca y selecciona el medicamento.')
    if (values.manual && (!manualName || !/\p{L}/u.test(manualName))) return toast.error('Indica el nombre del medicamento.')
    if (values.manual && values.manualMedication.presentationId === '') return toast.error('Elige la presentación del medicamento.')
    add.mutate({
      ...(values.manual
        ? {
            newMedication: {
              name: manualName,
              presentationId: Number(values.manualMedication.presentationId),
              concentration: values.manualMedication.concentration.trim() || undefined,
            },
          }
        : { medicationId: selected?.id }),
      dose: values.dose.trim() || undefined,
      frequency: values.frequency.trim() || undefined,
    })
  }

  return (
    <Stack spacing={2}>
      {values.manual ? (
        <Stack spacing={1.5}>
          <TextField size="small" label="Nombre del medicamento" value={values.manualMedication.name} onChange={(event) => setManual({ name: event.target.value })} />
          <TextField
            select
            size="small"
            label="Presentación"
            value={values.manualMedication.presentationId}
            onChange={(event) => setManual({ presentationId: Number(event.target.value) })}
          >
            {presentations.filter((item) => item.active).map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField size="small" label="Concentración" value={values.manualMedication.concentration} onChange={(event) => setManual({ concentration: event.target.value })} />
        </Stack>
      ) : (
        <Autocomplete
          options={options}
          getOptionLabel={optionLabel}
          value={selected}
          onChange={(_event, option) => set({ medicationId: option?.id ?? null })}
          renderInput={(params) => <TextField {...params} size="small" placeholder="Buscar medicamento…" />}
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={values.manual}
            onChange={(event) => set({ manual: event.target.checked, medicationId: null, manualMedication: EMPTY_MANUAL_MEDICATION })}
          />
        }
        label="No está en el catálogo · escribir manualmente"
        sx={{ mt: '-8px !important', '& .MuiFormControlLabel-label': { fontSize: '12px', color: 'text.secondary' } }}
      />

      {headerName && (
        <>
          <CaptureHeader name={headerName} code={values.manual ? null : selected?.genericName} />
          <TextField size="small" label="Dosis" value={values.dose} onChange={(event) => set({ dose: event.target.value })} />
          <MedicationFrequencyField key={resetCount} value={values.frequency} onChange={(frequency) => set({ frequency })} />
          <CaptureActions editing={false} loading={add.isPending} onSubmit={submit} onCancel={reset} />
        </>
      )}
    </Stack>
  )
}
