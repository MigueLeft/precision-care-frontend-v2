import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Stack, Typography, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { SectionCard } from '@/components/ui/SectionCard'
import {
  getSpecialistFormSchema,
  specialistFormDefaultValues,
  type SpecialistFormValues,
} from '../schemas/specialist-form.schema'
import {
  mapFormToCreatePayload,
  mapFormToUpdatePayload,
  mapSpecialistToFormValues,
} from '../utils/map-specialist-form'
import { useSpecialist } from '../hooks/useSpecialists'
import { useCreateSpecialist, useUpdateSpecialist } from '../hooks/useSpecialistMutations'
import { SpecialistDataFields } from './SpecialistDataFields'
import { SpecialistAccessFields } from './SpecialistAccessFields'
import { TemporaryPasswordDialog } from './TemporaryPasswordDialog'

interface Props {
  mode: 'create' | 'edit'
  specialistId?: number
}

export function SpecialistFormPage({ mode, specialistId }: Props) {
  const navigate = useNavigate()
  const { data: specialist } = useSpecialist(specialistId ?? 0)
  const [tempPassword, setTempPassword] = useState<{ pwd: string; id: number } | null>(null)

  const { control, handleSubmit, setValue } = useForm<SpecialistFormValues>({
    resolver: zodResolver(getSpecialistFormSchema(mode)),
    defaultValues:
      mode === 'edit' && specialist
        ? mapSpecialistToFormValues(specialist)
        : specialistFormDefaultValues,
  })

  const createMutation = useCreateSpecialist({
    onSuccess: (result) => {
      if (result.temporaryPassword) {
        setTempPassword({ pwd: result.temporaryPassword, id: result.specialist.id })
      } else {
        navigate({ to: '/especialistas/$specialistId', params: { specialistId: String(result.specialist.id) } })
      }
    },
  })
  const updateMutation = useUpdateSpecialist(specialistId, {
    onSuccess: () =>
      navigate({ to: '/especialistas/$specialistId', params: { specialistId: String(specialistId) } }),
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  function onSubmit(values: SpecialistFormValues) {
    if (mode === 'create') {
      createMutation.mutate(mapFormToCreatePayload(values))
    } else {
      updateMutation.mutate(mapFormToUpdatePayload(values))
    }
  }

  if (mode === 'edit' && !specialist) return null

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <IconButton size="small" aria-label="Volver" onClick={() => navigate({ to: '/especialistas' })}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="h1">
          {mode === 'create' ? 'Crear especialista' : 'Editar especialista'}
        </Typography>
      </Stack>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, ml: 5 }}>
        {mode === 'create'
          ? 'Registra al profesional y decide si tendrá acceso al sistema.'
          : 'Actualiza la información profesional y de contacto.'}
      </Typography>

      <Stack spacing={3}>
        <SectionCard title="Datos del especialista">
          <SpecialistDataFields control={control} setValue={setValue} />
        </SectionCard>

        {mode === 'create' && (
          <SectionCard title="Acceso al sistema">
            <SpecialistAccessFields control={control} />
          </SectionCard>
        )}

        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <AppButton variant="outlined" disabled={isSubmitting} onClick={() => navigate({ to: '/especialistas' })}>
            Cancelar
          </AppButton>
          <AppButton variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
            {mode === 'create' ? 'Crear especialista' : 'Guardar cambios'}
          </AppButton>
        </Stack>
      </Stack>

      <TemporaryPasswordDialog
        open={tempPassword !== null}
        password={tempPassword?.pwd ?? ''}
        onClose={() => {
          const id = tempPassword?.id
          setTempPassword(null)
          if (id) navigate({ to: '/especialistas/$specialistId', params: { specialistId: String(id) } })
        }}
      />
    </Box>
  )
}
