import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { diseaseFormSchema, type DiseaseFormValues } from '../schemas/disease-form.schema'

interface DiseaseFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: DiseaseFormValues
  isSubmitting: boolean
  onSubmit: (values: DiseaseFormValues) => void
  onClose: () => void
}

export function DiseaseFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: DiseaseFormModalProps) {
  const { control, handleSubmit, reset } = useForm<DiseaseFormValues>({
    resolver: zodResolver(diseaseFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Agregar enfermedad' : 'Editar enfermedad'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nombre"
                fullWidth
                autoFocus
                error={!!error}
                helperText={error?.message}
                slotProps={{ htmlInput: { maxLength: 150 } }}
              />
            )}
          />
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                label="Código (opcional)"
                placeholder="Ej. E11.9"
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{ htmlInput: { maxLength: 20 } }}
              />
            )}
          />
          <Controller
            name="isChronic"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                }
                label="Enfermedad crónica"
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear enfermedad' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
