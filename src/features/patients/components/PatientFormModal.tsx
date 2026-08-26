import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { PatientFormFields } from './PatientFormFields'
import { patientFormSchema } from '../schemas/patient-form.schema'
import type { PatientFormValues } from '../schemas/patient-form.schema'
import type { Country } from '@/features/catalogs'

interface PatientFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: PatientFormValues
  countries: Country[]
  isSubmitting: boolean
  onSubmit: (values: PatientFormValues) => void
  onClose: () => void
}

export function PatientFormModal({
  open,
  mode,
  initialValues,
  countries,
  isSubmitting,
  onSubmit,
  onClose,
}: PatientFormModalProps) {
  const { control, handleSubmit, reset } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (open) reset(initialValues)
  }, [open, initialValues, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nuevo paciente' : 'Editar paciente'}</DialogTitle>
      <DialogContent>
        <PatientFormFields control={control} countries={countries} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          {mode === 'create' ? 'Crear paciente' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
