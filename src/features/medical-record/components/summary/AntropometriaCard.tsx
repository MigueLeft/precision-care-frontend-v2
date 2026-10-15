import { Grid } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatTile } from '@/components/ui/StatTile'
import { EmptyState } from '@/components/EmptyState'
import { formatNumber } from '@/utils/parse-numeric'
import {
  anthropometryValues,
  sortAnthropometries,
  useAnthropometriesByPatient,
} from '@/features/anthropometry'
import {
  formatShortDate,
  bmiTone,
  bmiLabel,
  bloodPressureTone,
  bloodPressureLabel,
} from '../../utils/clinical-format'

interface AntropometriaCardProps {
  patientId: number
}

// "Antropometría" del Resumen: última medición (peso, talla, IMC, presión y masas).
export function AntropometriaCard({ patientId }: AntropometriaCardProps) {
  const { data = [], isLoading } = useAnthropometriesByPatient(patientId)
  const latest = sortAnthropometries(data)[0]
  const values = anthropometryValues(latest)

  const bmi = values.bmi ?? null
  const systolic = values.systolicBp ?? null
  const diastolic = values.diastolicBp ?? null
  const heightCm = values.heightCm ?? null

  const tiles = [
    { label: 'Peso', value: formatNumber(values.weightKg), unit: 'kg' },
    {
      label: 'Talla',
      value: heightCm !== null ? formatNumber(heightCm / 100, 2) : '—',
      unit: 'm',
    },
    { label: 'IMC', value: formatNumber(bmi), tone: bmiTone(bmi), caption: bmiLabel(bmi) },
    {
      label: 'Presión arterial',
      value: systolic !== null && diastolic !== null ? `${systolic}/${diastolic}` : '—',
      unit: 'mmHg',
      tone: bloodPressureTone(systolic, diastolic),
      caption: bloodPressureLabel(systolic, diastolic),
    },
    { label: 'Masa grasa', value: formatNumber(values.fatMassKg), unit: 'kg' },
    { label: 'Masa magra', value: formatNumber(values.leanMassKg), unit: 'kg' },
    { label: 'Masa músculo esq.', value: formatNumber(values.skeletalMuscleMassKg), unit: 'kg' },
    { label: 'Cintura-cadera', value: formatNumber(values.waistHipRatio, 2) },
  ]

  return (
    <SectionCard
      title={
        latest
          ? `Antropometría — última medición ${formatShortDate(latest.assessmentDate)}`
          : 'Antropometría'
      }
    >
      {!isLoading && !latest && <EmptyState message="Sin mediciones registradas." />}

      {latest && (
        <Grid container spacing={2}>
          {tiles.map((tile) => (
            <Grid key={tile.label} size={{ xs: 6, sm: 3 }}>
              <StatTile {...tile} />
            </Grid>
          ))}
        </Grid>
      )}
    </SectionCard>
  )
}
