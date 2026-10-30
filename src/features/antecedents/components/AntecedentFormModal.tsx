import { useForm } from 'react-hook-form'
import { useConsultationDraftForm } from '@/hooks/useConsultationDraftForm'
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

type AntecedentFormContentProps = Omit<AntecedentFormModalProps, 'open'>

// El contenido del Dialog se monta cada vez que se abre, así el formulario nace
// con los valores del antecedente como defaultValues (sin depender de un reset).
function AntecedentFormContent({
  mode,
  initialValues,
  lockType,
  isSubmitting,
  onSubmit,
  onClose,
}: AntecedentFormContentProps) {
  const form = useForm<AntecedentFormValues>({
    resolver: zodResolver(antecedentFormSchema),
    defaultValues: initialValues ?? antecedentFormDefaultValues,
  })
  const { control, handleSubmit, setValue } = form
  // En la consulta en curso se respalda el alta de un antecedente hasta enviarla.
  const clearDraft = useConsultationDraftForm(mode === 'create' ? 'antecedentForm.create' : null, form)

  return (
    <>
      <DialogTitle>
        {mode === 'create' ? 'Nuevo antecedente' : 'Editar antecedente'}
      </DialogTitle>
      <DialogContent>
        <AntecedentFormFields control={control} setValue={setValue} lockType={lockType} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit((values) => {
            clearDraft()
            onSubmit(values)
          })}
        >
          {mode === 'create' ? 'Agregar' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </>
  )
}

export function AntecedentFormModal({ open, ...contentProps }: AntecedentFormModalProps) {
  return (
    <Dialog open={open} onClose={contentProps.onClose} maxWidth="sm" fullWidth>
      <AntecedentFormContent {...contentProps} />
    </Dialog>
  )
}
