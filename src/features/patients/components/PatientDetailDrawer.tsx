import { Drawer, Box, Divider } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { AppButton } from '@/components/AppButton'
import { PatientDrawerHeader } from './PatientDrawerHeader'
import { PatientDrawerInfo } from './PatientDrawerInfo'
import { PatientDrawerAllergies } from './PatientDrawerAllergies'
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
    <Drawer anchor="right" open={!!patient} onClose={onClose} slotProps={{ paper: { sx: { width: 480 } } }}>
      {patient && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <PatientDrawerHeader patient={patient} onClose={onClose} />
          <Divider />
          <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
            <PatientDrawerInfo patient={patient} countryNameById={countryNameById} />
            <PatientDrawerAllergies patientId={patient.id} />
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <AppButton
              variant="contained"
              fullWidth
              startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={onEditRequest}
            >
              Editar
            </AppButton>
          </Box>
        </Box>
      )}
    </Drawer>
  )
}
