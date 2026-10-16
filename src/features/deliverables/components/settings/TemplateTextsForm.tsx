import { Controller, useForm } from 'react-hook-form'
import { Stack, TextField } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { AppButton } from '@/components/AppButton'
import { SectionCard } from '@/components/ui/SectionCard'
import { useUpdateDeliverableTemplate } from '../../hooks/useDeliverableTemplates'
import type { DeliverableTemplate } from '../../types'

export type TemplateTextField = {
  key: string
  label: string
  helper?: string
  multiline?: boolean
}

type TemplateTextsFormProps = {
  title: string
  template: DeliverableTemplate
  fields: TemplateTextField[]
}

type FormValues = Record<string, string>

function valuesOf(template: DeliverableTemplate, fields: TemplateTextField[]): FormValues {
  return Object.fromEntries(
    fields.map(({ key }) => {
      const value = template.baseStructure[key]
      return [key, typeof value === 'string' ? value : '']
    }),
  )
}

// Textos de una plantilla de entregable (encabezado, títulos…). Se guardan en
// base_structure y aplican a lo que se imprima desde entonces.
export function TemplateTextsForm({ title, template, fields }: TemplateTextsFormProps) {
  const update = useUpdateDeliverableTemplate(template.id)
  const { control, handleSubmit, formState } = useForm<FormValues>({
    values: valuesOf(template, fields),
  })

  function onSubmit(values: FormValues) {
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    )
    update.mutate({ ...(template.baseStructure as Record<string, string>), ...cleaned })
  }

  return (
    <SectionCard title={title}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            rules={{ maxLength: { value: 500, message: 'Máximo 500 caracteres.' } }}
            render={({ field: input, fieldState: { error } }) => (
              <TextField
                {...input}
                label={field.label}
                error={!!error}
                helperText={error?.message ?? field.helper}
                multiline={field.multiline}
                minRows={field.multiline ? 3 : undefined}
                size="small"
                fullWidth
              />
            )}
          />
        ))}
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <AppButton
            type="submit"
            variant="contained"
            loading={update.isPending}
            disabled={!formState.isDirty}
            startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
          >
            Guardar
          </AppButton>
        </Stack>
      </Stack>
    </SectionCard>
  )
}
