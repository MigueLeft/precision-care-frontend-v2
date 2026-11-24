import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { antecedentFormSchema, type AntecedentFormValues } from '../schemas/antecedent-form.schema'
import { ANTECEDENT_TYPE_LABELS } from '../utils/antecedent-format'
import { AntecedentFormFields } from './AntecedentFormFields'

type Props = {
  initialValues: AntecedentFormValues
  isSubmitting: boolean
  onSubmit: (values: AntecedentFormValues[]) => Promise<AntecedentFormValues[]>
  onClose: () => void
}

export function CreateAntecedentsModal({ initialValues, isSubmitting, onSubmit, onClose }: Props) {
  const [queued, setQueued] = useState<AntecedentFormValues[]>([])
  const [formKey, setFormKey] = useState(0)
  const { control, setValue, handleSubmit, reset, formState: { isDirty } } = useForm<AntecedentFormValues>({
    resolver: zodResolver(antecedentFormSchema),
    defaultValues: initialValues,
  })
  const currentName = useWatch({ control, name: 'name' })
  const hasCurrent = isDirty || !!currentName.trim()

  function resetForm(values: AntecedentFormValues) {
    reset(values)
    // Los selectores también deben reiniciar su modo de captura manual.
    setFormKey((previous) => previous + 1)
  }

  const addAnother = handleSubmit((values) => {
    setQueued((previous) => [...previous, values])
    resetForm({ ...initialValues, type: values.type })
  })

  async function save(values: AntecedentFormValues[]) {
    const failed = await onSubmit(values)
    setQueued(failed)
    resetForm(initialValues)
  }

  function editQueued(index: number) {
    const edit = (current?: AntecedentFormValues) => {
      setQueued([...queued.filter((_value, entryIndex) => entryIndex !== index), ...(current ? [current] : [])])
      resetForm(queued[index])
    }
    if (hasCurrent) void handleSubmit((values) => edit(values))()
    else edit()
  }

  function submit() {
    if (queued.length && !hasCurrent) void save(queued)
    else void handleSubmit((values) => save([...queued, values]))()
  }

  return (
    <Dialog open onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar antecedentes</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">Completa un antecedente y pulsa «Añadir otro» para incluir varios antes de guardar.</Typography>
        <Box component="fieldset" disabled={isSubmitting} sx={{ p: 0, m: 0, border: 0, minWidth: 0 }}>
          {queued.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {queued.map((values, index) => (
                <Stack key={index} direction="row" spacing={1} sx={{ alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{values.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{[ANTECEDENT_TYPE_LABELS[values.type], values.relationship, values.eventDate].filter(Boolean).join(' · ')}</Typography>
                  </Box>
                  <Button size="small" onClick={() => editQueued(index)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => setQueued(queued.filter((_entry, entryIndex) => entryIndex !== index))}>Quitar</Button>
                </Stack>
              ))}
            </Stack>
          )}
          <AntecedentFormFields key={formKey} control={control} setValue={setValue} />
          <Button variant="outlined" onClick={() => void addAnother()} sx={{ mt: 2 }}>Añadir otro antecedente</Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
        <AppButton variant="contained" loading={isSubmitting} onClick={submit}>Guardar antecedentes{queued.length ? ` (${queued.length + (hasCurrent ? 1 : 0)})` : ''}</AppButton>
      </DialogActions>
    </Dialog>
  )
}
