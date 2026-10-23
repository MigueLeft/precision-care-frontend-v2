import { IconButton, Paper, Stack, Typography } from '@mui/material'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { formatPhone } from '@/utils/phone'
import { calculatePatientAge, formatPatientName } from '../../utils/patient-format'
import type { Patient } from '../../types'

type MobilePatientCardProps = {
  patient: Patient
}

// Paciente en la lista de la app de citas: datos básicos y contacto. No
// abre el expediente.
export function MobilePatientCard({ patient }: MobilePatientCardProps) {
  const phone = patient.phone

  return (
    <Paper sx={{ p: 1.75, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
      <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: '15px', fontWeight: 600 }}>
          {formatPatientName(patient)}
        </Typography>
        <Typography noWrap sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
          {calculatePatientAge(patient.birthDate)} años
          {patient.identityDocument ? ` · C.I. ${patient.identityDocument}` : ''}
        </Typography>
        <Typography noWrap sx={{ fontSize: '12.5px', color: phone ? 'text.primary' : 'text.secondary' }}>
          {formatPhone(phone) ?? 'Sin teléfono'}
        </Typography>
      </Stack>
      {phone && (
        <>
          <IconButton href={`tel:${phone}`} aria-label="Llamar" color="primary">
            <PhoneOutlinedIcon />
          </IconButton>
          <IconButton href={`https://wa.me/${phone.replace(/\D/g, '')}`} aria-label="WhatsApp" color="success">
            <WhatsAppIcon />
          </IconButton>
        </>
      )}
    </Paper>
  )
}
