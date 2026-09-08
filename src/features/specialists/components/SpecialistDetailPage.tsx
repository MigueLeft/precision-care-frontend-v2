import { useState } from 'react'
import { Box, Grid, Stack, Typography, Chip, IconButton, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import { useNavigate } from '@tanstack/react-router'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { AppButton } from '@/components/AppButton'
import { SectionCard } from '@/components/ui/SectionCard'
import { formatShortDate } from '@/utils/format-date'
import { useSpecialist } from '../hooks/useSpecialists'
import { useSetSpecialistStatus } from '../hooks/useSpecialistMutations'
import {
  formatSpecialistInitials,
  formatSpecialistLocation,
} from '../utils/specialist-format'
import { SpecialistDetailSidebar } from './SpecialistDetailSidebar'
import { DeactivateSpecialistDialog } from './DeactivateSpecialistDialog'

interface Props {
  specialistId: number
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', color: 'text.secondary' }}>
        {label.toUpperCase()}
      </Typography>
      <Typography sx={{ fontSize: '14px', mt: 0.25 }}>{value}</Typography>
    </Grid>
  )
}

export function SpecialistDetailPage({ specialistId }: Props) {
  const navigate = useNavigate()
  const { data: specialist } = useSpecialist(specialistId)
  const [confirming, setConfirming] = useState(false)
  const statusMutation = useSetSpecialistStatus({ onSuccess: () => setConfirming(false) })

  if (!specialist) return null

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', minWidth: 0 }}>
          <IconButton size="small" aria-label="Volver" onClick={() => navigate({ to: '/especialistas' })}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <InitialsAvatar initials={formatSpecialistInitials(specialist)} size={48} />
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h1">
                {specialist.name} {specialist.lastName}
              </Typography>
              <Chip
                label={specialist.active ? 'Activo' : 'Desactivado'}
                size="small"
                color={specialist.active ? 'success' : 'default'}
              />
              <Chip
                label={specialist.hasUser ? `Usuario · ${specialist.roleName ?? 'Sin rol'}` : 'Sin usuario'}
                size="small"
                variant="outlined"
                color={specialist.hasUser ? 'info' : 'warning'}
              />
            </Stack>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 0.5 }}>
              {specialist.primarySpecialtyName ?? 'Sin especialidad'} · {formatSpecialistLocation(specialist)} ·
              alta {formatShortDate(specialist.createdAt)}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <AppButton
            variant="outlined"
            startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
            onClick={() =>
              navigate({
                to: '/especialistas/$specialistId/editar',
                params: { specialistId: String(specialist.id) },
              })
            }
          >
            Editar
          </AppButton>
          <AppButton
            variant="outlined"
            color={specialist.active ? 'error' : 'primary'}
            startIcon={
              specialist.active ? (
                <PersonOffOutlinedIcon sx={{ fontSize: 16 }} />
              ) : (
                <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16 }} />
              )
            }
            onClick={() => setConfirming(true)}
          >
            {specialist.active ? 'Desactivar' : 'Activar'}
          </AppButton>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionCard title="Datos del especialista">
            <Grid container spacing={2.5}>
              <Field label="Nombre" value={specialist.name} />
              <Field label="Apellido" value={specialist.lastName} />
              <Field label="Correo" value={specialist.email} />
              <Field label="Teléfono" value={specialist.phone ?? '—'} />
              <Field label="Nacionalidad" value={specialist.nationalityName ?? specialist.nationalityCountryName ?? '—'} />
              <Field label="País de residencia" value={specialist.residenceCountryName ?? '—'} />
              <Field label="Estado / provincia" value={specialist.stateName ?? '—'} />
              <Field label="Ciudad" value={specialist.cityName ?? '—'} />
              <Field label="Especialidad" value={specialist.primarySpecialtyName ?? '—'} />
              <Field
                label="Otras especialidades"
                value={
                  specialist.otherSpecialties.length > 0
                    ? specialist.otherSpecialties.map((o) => o.name).join(', ')
                    : '—'
                }
              />
              <Grid size={12}>
                <Divider />
              </Grid>
              <Field label="Dirección física donde atiende" value={specialist.practiceAddress ?? '—'} />
            </Grid>
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SpecialistDetailSidebar specialist={specialist} />
        </Grid>
      </Grid>

      <DeactivateSpecialistDialog
        specialist={confirming ? specialist : null}
        isSubmitting={statusMutation.isPending}
        onConfirm={() => statusMutation.mutate({ id: specialist.id, active: !specialist.active })}
        onClose={() => setConfirming(false)}
      />
    </Box>
  )
}
