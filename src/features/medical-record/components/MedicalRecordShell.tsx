import { Box, Stack } from '@mui/material'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import type { Patient } from '@/features/patients'
import { MedicalRecordHeader } from './MedicalRecordHeader'
import { MedicalRecordSidebar } from './MedicalRecordSidebar'
import { useMedicalRecordCounts } from '../hooks/useMedicalRecordCounts'

interface MedicalRecordShellProps {
  patient: Patient
}

// Layout del expediente: encabezado + submenú lateral + contenido de la sección activa.
export function MedicalRecordShell({ patient }: MedicalRecordShellProps) {
  const counts = useMedicalRecordCounts(patient.id)
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <Box>
      <MedicalRecordHeader patient={patient} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
        <MedicalRecordSidebar patientId={patient.id} counts={counts} />
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <ErrorBoundary resetKey={pathname} title="No se pudo cargar esta sección">
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Stack>
    </Box>
  )
}
