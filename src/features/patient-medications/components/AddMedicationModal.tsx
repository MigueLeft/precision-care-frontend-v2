import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useMedications } from '@/features/catalogs'
import type { Allergy } from '@/features/patients'
import { medicationFormSchema, type MedicationFormValues } from '../schemas/medication-form.schema'
import type { PatientMedication } from '../types'
import { medicationToForm } from '../utils/medication-form'
import { MedicationScheduleFields } from './MedicationScheduleFields'

type Props = {
  medication?: PatientMedication
  allergies: Allergy[]
  isSubmitting: boolean
  onSubmit: (values: MedicationFormValues) => void
  onClose: () => void
}

// Se monta al abrir el diálogo para iniciar con los valores del registro elegido.
export function AddMedicationModal({ medication, allergies, isSubmitting, onSubmit, onClose }: Props) {
  const { data: catalog = [], isLoading, isError } = useMedications()
  const { control, handleSubmit } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: medicationToForm(medication),
  })
  const medicationId = useWatch({ control, name: 'medicationId' })
  const selectedMedication = catalog.find((item) => item.id === medicationId)
  const conflict = selectedMedication ? allergies.find((allergy) => {
    const agent = allergy.name?.trim().toLowerCase()
    return agent && (selectedMedication.genericName.toLowerCase().includes(agent) || selectedMedication.brandName.toLowerCase().includes(agent))
  }) : undefined

  return (
    <Dialog open onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{medication ? 'Editar medicamento' : 'Agregar medicamento'}</DialogTitle>
      <DialogContent>
        <Grid component="fieldset" container spacing={2} disabled={isSubmitting} sx={{ mt: 1, p: 0, border: 0, minWidth: 0 }}>
          <Grid size={{ xs: 12 }}>
            <Controller name="medicationId" control={control} render={({ field, fieldState: { error } }) => (
              <Autocomplete
                options={catalog}
                loading={isLoading}
                disabled={!!medication}
                getOptionLabel={(option) => `${option.brandName} · ${option.genericName}${option.concentration ? ` ${option.concentration}` : ''}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedMedication ?? null}
                onChange={(_event, option) => field.onChange(option?.id ?? 0)}
                onBlur={field.onBlur}
                renderInput={(params) => <TextField {...params} inputRef={field.ref} label="Medicamento" error={!!error} helperText={error?.message} />}
              />
            )} />
          </Grid>
          {isError && <Grid size={{ xs: 12 }}><Alert severity="error">No se pudo cargar el catálogo de medicamentos.</Alert></Grid>}
          {conflict && (
            <Grid size={{ xs: 12 }}>
              <Alert severity={medication ? 'warning' : 'error'}>El paciente tiene una alergia registrada que coincide con este medicamento ({conflict.name}). Revisa antes de guardar.</Alert>
            </Grid>
          )}
          <MedicationScheduleFields control={control} />
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
        <AppButton variant="contained" loading={isSubmitting} disabled={(!medication && !!conflict) || isLoading || isError} onClick={handleSubmit(onSubmit)}>
          {medication ? 'Guardar cambios' : 'Agregar'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
