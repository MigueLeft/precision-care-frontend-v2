import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useMedications } from '@/features/catalogs'
import type { Allergy } from '@/features/patients'
import {
  medicationFormSchema,
  medicationFormDefaultValues,
  type MedicationFormValues,
} from '../schemas/medication-form.schema'

interface AddMedicationModalProps {
  open: boolean
  allergies: Allergy[]
  isSubmitting: boolean
  onSubmit: (values: MedicationFormValues) => void
  onClose: () => void
}

export function AddMedicationModal({
  open,
  allergies,
  isSubmitting,
  onSubmit,
  onClose,
}: AddMedicationModalProps) {
  const { data: catalog = [] } = useMedications()
  const { control, handleSubmit, reset } = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: medicationFormDefaultValues,
  })

  useEffect(() => {
    if (open) reset(medicationFormDefaultValues)
  }, [open, reset])

  const medicationId = useWatch({ control, name: 'medicationId' })
  const selectedMedication = catalog.find((m) => m.id === medicationId)
  // El catálogo de alergias es texto libre: se coteja el nombre del agente contra
  // la sustancia activa o el nombre comercial del medicamento seleccionado.
  const conflict = selectedMedication
    ? allergies.find((allergy) => {
        const agent = allergy.name?.trim().toLowerCase()
        if (!agent) return false
        return (
          selectedMedication.genericName.toLowerCase().includes(agent) ||
          selectedMedication.brandName.toLowerCase().includes(agent)
        )
      })
    : undefined

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar medicamento</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="medicationId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Autocomplete
                  options={catalog}
                  getOptionLabel={(option) =>
                    `${option.brandName} · ${option.genericName}${
                      option.concentration ? ` ${option.concentration}` : ''
                    }`
                  }
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={catalog.find((m) => m.id === field.value) ?? null}
                  onChange={(_event, option) => field.onChange(option?.id ?? 0)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Medicamento"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {conflict && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error">
                El paciente tiene una alergia registrada que coincide con este medicamento
                {conflict.name ? ` (${conflict.name})` : ''}. Revisa antes de agregar.
              </Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="dose"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label="Dosis" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label="Frecuencia" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label="Duración" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label="Cantidad" />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="startAt"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  type="date"
                  label="Desde"
                  error={!!error}
                  helperText={error?.message}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton
          variant="contained"
          loading={isSubmitting}
          disabled={!!conflict}
          onClick={handleSubmit(onSubmit)}
        >
          Agregar
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
