import { Stack, Typography } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { usePrescriptionsByConsultation } from '@/features/patient-medications'
import { NoteEmpty } from './NoteBlock'

export function NotePrescriptions({ consultationId }: { consultationId: number }) {
  const { data: prescriptions = [] } = usePrescriptionsByConsultation(consultationId)

  if (prescriptions.length === 0) return <NoteEmpty />
  return (
    <Stack spacing={0.75}>
      {prescriptions.map((prescription) => (
        <Stack key={prescription.id} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <LinkIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
            {prescription.brandName ?? prescription.genericName ?? 'Medicamento'} {prescription.dose}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            · {prescription.frequency} · {prescription.duration}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
