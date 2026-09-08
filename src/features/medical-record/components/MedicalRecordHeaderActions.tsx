import { IconButton, Stack } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import StethoscopeIcon from '@mui/icons-material/MedicalServicesOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { AppButton } from '@/components/AppButton'

// Acciones del encabezado del expediente. Sin lógica todavía (fase posterior).
export function MedicalRecordHeaderActions() {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
      <AppButton
        variant="outlined"
        startIcon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />}
        disabled
      >
        Agendar cita
      </AppButton>
      <AppButton
        variant="contained"
        startIcon={<StethoscopeIcon sx={{ fontSize: 16 }} />}
        disabled
      >
        Nueva consulta
      </AppButton>
      <IconButton size="small" disabled aria-label="Más acciones">
        <MoreHorizIcon />
      </IconButton>
    </Stack>
  )
}
