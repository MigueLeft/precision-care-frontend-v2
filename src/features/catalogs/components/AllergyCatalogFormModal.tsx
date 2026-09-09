import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useAllergyTypes } from '../hooks/useAllergyTypes'
import {
  allergyCatalogFormSchema,
  type AllergyCatalogFormValues,
} from '../schemas/allergy-catalog-form.schema'

interface AllergyCatalogFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: AllergyCatalogFormValues
  isSubmitting: boolean
  onSubmit: (values: AllergyCatalogFormValues) => void
  onClose: () => void
}

export function AllergyCatalogFormModal({
  open,
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onClose,
}: AllergyCatalogFormModalProps) {
  const { data: types = [] } = useAllergyTypes()
  const { control, handleSubmit, reset } = useForm<AllergyCatalogFormValues>({
    resolver: zodResolver(allergyCatalogFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Agregar alergia' : 'Editar alergia'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nombre del agente"
                fullWidth
                autoFocus
                error={!!error}
                helperText={error?.message}
                slotProps={{ htmlInput: { maxLength: 150 } }}
              />
            )}
          />
          <Controller
            name="typeId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel id="allergy-type-label">Tipo</InputLabel>
                <Select
                  labelId="allergy-type-label"
                  label="Tipo"
                  value={field.value || ''}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                >
                  {types
                    .filter((type) => type.active)
                    .map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear alergia' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
