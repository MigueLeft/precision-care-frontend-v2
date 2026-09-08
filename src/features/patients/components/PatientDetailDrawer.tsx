import { Drawer, Box, Divider, Stack } from '@mui/material'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { Link } from '@tanstack/react-router'
import { AppButton } from '@/components/AppButton'
import { PatientDrawerHeader } from './PatientDrawerHeader'
import { PatientDrawerInfo } from './PatientDrawerInfo'
import { PatientDrawerCareTeam } from './PatientDrawerCareTeam'
import { PatientDrawerAllergies } from './PatientDrawerAllergies'
import { PatientDrawerUpcomingAppointments } from './PatientDrawerUpcomingAppointments'
import { PatientDrawerRecentConsultations } from './PatientDrawerRecentConsultations'
import type { Patient } from '../types'

interface PatientDetailDrawerProps {
  patient: Patient | null
  countryNameById: Map<number, string>
  onClose: () => void
  onEditRequest: () => void
}

export function PatientDetailDrawer({
  patient,
  countryNameById,
  onClose,
  onEditRequest,
}: PatientDetailDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={!!patient}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 480 } } }}
    >
      {patient && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <PatientDrawerHeader patient={patient} onClose={onClose} />
          <Divider />

          <Box sx={{ p: 2, pb: 0 }}>
            <Stack direction="row" spacing={1.5}>
              <Link
                to="/pacientes/$patientId/resumen"
                params={{ patientId: String(patient.id) }}
                style={{ textDecoration: 'none', flex: 1 }}
              >
                <AppButton
                  variant="contained"
                  fullWidth
                  startIcon={<OpenInFullIcon sx={{ fontSize: 16 }} />}
                >
                  Abrir expediente completo
                </AppButton>
              </Link>
              <AppButton
                variant="outlined"
                startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />}
                disabled
              >
                Agendar cita
              </AppButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
            <PatientDrawerInfo patient={patient} countryNameById={countryNameById} />
            <PatientDrawerCareTeam patientId={patient.id} />
            <PatientDrawerAllergies patientId={patient.id} />
            <PatientDrawerUpcomingAppointments patientId={patient.id} />
            <PatientDrawerRecentConsultations patientId={patient.id} />
          </Box>

          <Divider />
          <Box sx={{ p: 2 }}>
            <AppButton variant="text" fullWidth onClick={onEditRequest}>
              Editar datos del paciente
            </AppButton>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}
