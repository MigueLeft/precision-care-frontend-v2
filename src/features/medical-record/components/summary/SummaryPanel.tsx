import { Grid, Stack } from '@mui/material'
import type { Patient } from '@/features/patients'
import { AntropometriaCard } from './AntropometriaCard'
import { ProximasCitasCard } from './ProximasCitasCard'
import { EnfermedadActualCard } from './EnfermedadActualCard'
import { ConsultasRecientesCard } from './ConsultasRecientesCard'
import { MedicamentosActivosCard } from './MedicamentosActivosCard'
import { AlergiasCard } from './AlergiasCard'
import { DatosPacienteCard } from './DatosPacienteCard'
import { UltimosLaboratoriosCard } from './UltimosLaboratoriosCard'
import { HistoriaAnteriorCard } from './HistoriaAnteriorCard'

interface SummaryPanelProps {
  patient: Patient
}

// Tab "Resumen" del expediente: dos columnas de tarjetas.
export function SummaryPanel({ patient }: SummaryPanelProps) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Stack spacing={3}>
          <AntropometriaCard patientId={patient.id} />
          <EnfermedadActualCard patientId={patient.id} />
          <ConsultasRecientesCard patientId={patient.id} />
          <UltimosLaboratoriosCard patientId={patient.id} />
          <HistoriaAnteriorCard patientId={patient.id} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={3}>
          <ProximasCitasCard patientId={patient.id} />
          <MedicamentosActivosCard patientId={patient.id} />
          <AlergiasCard patientId={patient.id} />
          <DatosPacienteCard patient={patient} />
        </Stack>
      </Grid>
    </Grid>
  )
}
