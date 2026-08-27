import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { Cie10FormFields } from './Cie10FormFields'
import { cie10FormSchema, cie10FormDefaultValues } from '../schemas/cie10-form.schema'
import type { Cie10FormValues } from '../schemas/cie10-form.schema'

interface Cie10FormModalProps {
  open: boolean
  isSubmitting: boolean
  onSubmit: (values: Cie10FormValues) => void
  onClose: () => void
}

export function Cie10FormModal({ open, isSubmitting, onSubmit, onClose }: Cie10FormModalProps) {
  const { control, handleSubmit, reset } = useForm<Cie10FormValues>({
    resolver: zodResolver(cie10FormSchema),
    defaultValues: cie10FormDefaultValues,
  })

  useEffect(() => {
    if (open) reset(cie10FormDefaultValues)
  }, [open, reset])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar código CIE-10</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2.5 }}>
          <Cie10FormFields control={control} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          Crear
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
