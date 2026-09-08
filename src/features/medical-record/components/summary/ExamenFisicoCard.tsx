import { Grid } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatTile } from '@/components/ui/StatTile'
import { EmptyState } from '@/components/EmptyState'
import { toNumber, formatNumber } from '@/utils/parse-numeric'
import { usePhysicalExamsByPatient } from '@/features/physical-exam'
import {
  useBodyCompositionsByPatient,
  getLatestBodyComposition,
  getSegment,
} from '@/features/body-composition'
import {
  formatShortDate,
  bmiTone,
  bmiLabel,
  bloodPressureTone,
  bloodPressureLabel,
} from '../../utils/clinical-format'

interface ExamenFisicoCardProps {
  patientId: number
}

// "Examen físico" del Resumen: combina signos vitales (última consulta) con la
// última composición corporal para mostrar peso, talla, IMC, presión y masas.
export function ExamenFisicoCard({ patientId }: ExamenFisicoCardProps) {
  const { data: physicalExams = [], isLoading: loadingExams } =
    usePhysicalExamsByPatient(patientId)
  const { data: compositions = [], isLoading: loadingComp } =
    useBodyCompositionsByPatient(patientId)

  const latestExam = physicalExams[0]
  const latestComp = getLatestBodyComposition(compositions)
  const totalSegment = getSegment(latestComp, 'total')

  const vitals = latestExam?.vitalSigns ?? null
  const systolic = vitals?.ta_sistolica ?? null
  const diastolic = vitals?.ta_diastolica ?? null

  const bmi = toNumber(latestComp?.bmi ?? null)
  const heightCm = toNumber(latestComp?.heightCm ?? null)
  const lastMeasuredAt = latestComp?.assessmentDate ?? latestExam?.examDate

  const isLoading = loadingExams || loadingComp
  const hasData = latestExam || latestComp

  return (
    <SectionCard
      title={
        hasData
          ? `Examen físico — última medición ${formatShortDate(lastMeasuredAt)}`
          : 'Examen físico'
      }
    >
      {!isLoading && !hasData && (
        <EmptyState message="Sin mediciones registradas." />
      )}

      {hasData && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile label="Peso" value={formatNumber(latestComp?.weightKg)} unit="kg" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile
              label="Talla"
              value={heightCm !== null ? formatNumber(heightCm / 100, 2) : '—'}
              unit="m"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile
              label="IMC"
              value={formatNumber(bmi)}
              tone={bmiTone(bmi)}
              caption={bmiLabel(bmi)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile
              label="Presión arterial"
              value={
                systolic !== null && diastolic !== null
                  ? `${systolic}/${diastolic}`
                  : '—'
              }
              unit="mmHg"
              tone={bloodPressureTone(systolic, diastolic)}
              caption={bloodPressureLabel(systolic, diastolic)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile
              label="Grasa corporal"
              value={formatNumber(totalSegment?.fatMassKg)}
              unit="kg"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile
              label="Masa magra"
              value={formatNumber(totalSegment?.leanMassKg)}
              unit="kg"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatTile
              label="Masa muscular"
              value={formatNumber(totalSegment?.skeletalMuscleMassKg)}
              unit="kg"
            />
          </Grid>
        </Grid>
      )}
    </SectionCard>
  )
}
