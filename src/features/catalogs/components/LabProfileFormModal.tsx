import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import {
  labProfileFormDefaultValues,
  labProfileFormSchema,
  type LabProfileFormValues,
} from '../schemas/lab-profile-form.schema'
import type { LabStudyOption } from '../utils/lab-studies'
import { LabStudiesPicker } from './LabStudiesPicker'

type LabProfileFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialValues?: LabProfileFormValues
  studyOptions: LabStudyOption[]
  isSubmitting: boolean
  onSubmit: (values: LabProfileFormValues) => void
  onClose: () => void
}

type ContentProps = Omit<LabProfileFormModalProps, 'open'>

// El contenido se monta al abrir: el formulario nace con los valores del perfil.
function LabProfileFormContent({
  mode,
  initialValues,
  studyOptions,
  isSubmitting,
  onSubmit,
  onClose,
}: ContentProps) {
  const { control, handleSubmit } = useForm<LabProfileFormValues>({
    resolver: zodResolver(labProfileFormSchema),
    defaultValues: initialValues ?? labProfileFormDefaultValues,
  })

  return (
    <>
      <DialogTitle>
        {mode === 'create' ? 'Nuevo perfil de laboratorio' : 'Editar perfil de laboratorio'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nombre del perfil"
                placeholder="Perfil lipídico"
                error={!!error}
                helperText={error?.message}
                slotProps={{ htmlInput: { maxLength: 120 } }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                label="Descripción"
                multiline
                minRows={2}
                error={!!error}
                helperText={error?.message}
                slotProps={{ htmlInput: { maxLength: 300 } }}
              />
            )}
          />
          <Controller
            name="paraclinicalIds"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <LabStudiesPicker
                options={studyOptions}
                value={field.value}
                onChange={field.onChange}
                error={!!error}
                helperText={error?.message ?? 'El orden de selección es el orden del perfil.'}
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
          {mode === 'create' ? 'Crear perfil' : 'Guardar cambios'}
        </AppButton>
      </DialogActions>
    </>
  )
}

export function LabProfileFormModal({ open, ...contentProps }: LabProfileFormModalProps) {
  return (
    <Dialog open={open} onClose={contentProps.onClose} maxWidth="md" fullWidth>
      <LabProfileFormContent {...contentProps} />
    </Dialog>
  )
}
