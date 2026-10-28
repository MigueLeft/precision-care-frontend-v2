import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import {
  referralProviderFormDefaultValues,
  referralProviderFormSchema,
  type ReferralProviderFormValues,
} from '../schemas/referral-provider-form.schema'

type ReferralProviderFormModalProps = {
  open: boolean
  title: string
  initialValues?: Partial<ReferralProviderFormValues>
  isSubmitting?: boolean
  onSubmit: (values: ReferralProviderFormValues) => void
  onClose: () => void
}

type ContentProps = Omit<ReferralProviderFormModalProps, 'open'>

const FIELDS: { name: keyof ReferralProviderFormValues; label: string; placeholder: string; max: number }[] = [
  { name: 'name', label: 'Nombre', placeholder: 'Dra. Norma Salcedo', max: 150 },
  { name: 'specialty', label: 'Especialidad o tipo de centro', placeholder: 'Ecografía', max: 120 },
  { name: 'address', label: 'Dirección', placeholder: 'Urb. El Parque, calle 1-A…', max: 300 },
  { name: 'phone', label: 'Teléfonos', placeholder: '0251-2546902 / 0414-7463499', max: 100 },
]

// Se monta al abrir: el formulario nace con los valores recibidos.
function ReferralProviderFormContent({ title, initialValues, isSubmitting, onSubmit, onClose }: ContentProps) {
  const { control, handleSubmit } = useForm<ReferralProviderFormValues>({
    resolver: zodResolver(referralProviderFormSchema),
    defaultValues: { ...referralProviderFormDefaultValues, ...initialValues },
  })

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {FIELDS.map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={item.label}
                  placeholder={item.placeholder}
                  multiline={item.name === 'address'}
                  error={!!error}
                  helperText={error?.message}
                  slotProps={{ htmlInput: { maxLength: item.max } }}
                />
              )}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          Guardar
        </AppButton>
      </DialogActions>
    </>
  )
}

// Alta o edición de un centro o especialista de referencia.
export function ReferralProviderFormModal({ open, ...props }: ReferralProviderFormModalProps) {
  return (
    <Dialog open={open} onClose={props.onClose} maxWidth="sm" fullWidth>
      {open && <ReferralProviderFormContent {...props} />}
    </Dialog>
  )
}
