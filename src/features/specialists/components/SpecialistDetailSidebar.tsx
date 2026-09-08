import { Stack, Typography, Divider } from '@mui/material'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import { useNavigate } from '@tanstack/react-router'
import { SectionCard } from '@/components/ui/SectionCard'
import { AppButton } from '@/components/AppButton'
import { formatShortDate } from '@/utils/format-date'
import { useResendSpecialistInvitation } from '../hooks/useSpecialistMutations'
import { formatSpecialistLocation } from '../utils/specialist-format'
import type { Specialist } from '../types'

interface Props {
  specialist: Specialist
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
    </Stack>
  )
}

export function SpecialistDetailSidebar({ specialist }: Props) {
  const navigate = useNavigate()
  const resend = useResendSpecialistInvitation()

  return (
    <Stack spacing={2}>
      <SectionCard
        title={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <EventNoteOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="h3">Actividad</Typography>
          </Stack>
        }
      >
        <Stack spacing={1}>
          <Row label="Pacientes asignados" value={String(specialist.patientsCount)} />
          <Row label="Consultas este mes" value={String(specialist.consultationsThisMonth)} />
          <Row label="Fecha de alta" value={formatShortDate(specialist.createdAt)} />
          <Row label="Último acceso" value={formatShortDate(specialist.lastLoginAt)} />
        </Stack>
      </SectionCard>

      <SectionCard
        title={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ContactMailOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="h3">Contacto</Typography>
          </Stack>
        }
      >
        <Stack spacing={1}>
          <Row label="Correo" value={specialist.email} />
          <Row label="Teléfono" value={specialist.phone ?? '—'} />
          <Row label="Ubicación" value={formatSpecialistLocation(specialist)} />
          <Row label="Dirección de atención" value={specialist.practiceAddress ?? '—'} />
        </Stack>
      </SectionCard>

      <SectionCard
        title={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ManageAccountsOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="h3">Acciones de usuario</Typography>
          </Stack>
        }
      >
        {specialist.hasUser ? (
          <Stack spacing={1} divider={<Divider flexItem />}>
            <AppButton
              variant="text"
              loading={resend.isPending}
              onClick={() => resend.mutate(specialist.id)}
              sx={{ justifyContent: 'flex-start' }}
            >
              Reenviar invitación
            </AppButton>
            <AppButton variant="text" disabled sx={{ justifyContent: 'flex-start' }}>
              Restablecer contraseña (próximamente)
            </AppButton>
            <AppButton
              variant="text"
              onClick={() => navigate({ to: '/usuarios-y-roles' })}
              sx={{ justifyContent: 'flex-start' }}
            >
              Ver permisos del rol
            </AppButton>
          </Stack>
        ) : (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            Este especialista no tiene usuario de acceso. Puedes crearle uno editando el registro.
          </Typography>
        )}
      </SectionCard>
    </Stack>
  )
}
