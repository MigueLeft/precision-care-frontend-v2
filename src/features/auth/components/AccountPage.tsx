import { Stack, Typography } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { useSession } from '../hooks/useSession'
import { ChangePasswordForm } from './ChangePasswordForm'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{value}</Typography>
    </Stack>
  )
}

// "Mi cuenta": datos del usuario con sesión iniciada y cambio de contraseña.
export function AccountPage() {
  const { user } = useSession()

  return (
    <Stack spacing={3} sx={{ maxWidth: 720 }}>
      <Typography variant="h1" sx={{ fontSize: '22px', fontWeight: 700 }}>
        Mi cuenta
      </Typography>

      <SectionCard title="Datos de acceso">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 6 }}>
          <InfoRow label="Nombre" value={user?.name ?? '—'} />
          <InfoRow label="Correo electrónico" value={user?.email ?? '—'} />
        </Stack>
      </SectionCard>

      <SectionCard title="Cambiar contraseña">
        <Typography sx={{ fontSize: '13px', color: 'text.secondary', mb: 2 }}>
          Al cambiarla se cerrarán tus sesiones abiertas en otros dispositivos.
        </Typography>
        <ChangePasswordForm />
      </SectionCard>
    </Stack>
  )
}
