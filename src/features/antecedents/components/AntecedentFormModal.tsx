import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { AntecedentFormFields } from './AntecedentFormFields'
import {
  antecedentFormSchema,
  antecedentFormDefaultValues,
  type AntecedentFormValues,
} from '../schemas/antecedent-form.schema'

interface AntecedentFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: AntecedentFormValues
  lockType?: boolean
  isSubmitting: boolean
  onSubmit: (values: AntecedentFormValues) => void
  onClose: () => void
}

export function AntecedentFormModal({
  open,
  mode,
  initialValues,
  lockType,
  isSubmitting,
  onSubmit,
  onClose,
}: AntecedentFormModalProps) {
  const values = initialValues ?? antecedentFormDefaultValues
  const { control, handleSubmit, reset } = useForm<AntecedentFormValues>({
    resolver: zodResolver(antecedentFormSchema),
    defaultValues: values,
  })

  useEffect(() => {
    if (open) reset(values)
  }, [open, values, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Nuevo antecedente' : 'Editar antecedente'}
      </DialogTitle>
      <DialogContent>
        <AntecedentFormFields control={control} lockType={lockType} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {mode === 'create' ? 'Agregar' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
