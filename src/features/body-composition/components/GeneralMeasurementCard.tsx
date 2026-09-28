import { Grid } from '@mui/material'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatTile } from '@/components/ui/StatTile'
import { formatNumber } from '@/utils/parse-numeric'
import { formatShortDate } from '@/utils/format-date'
import type { BodyComposition } from '../types'

interface GeneralMeasurementCardProps {
  composition: BodyComposition
}

// Datos generales de la medición (tabla body_composition): peso, talla, IMC,
// metabolismo basal, agua y metas.
export function GeneralMeasurementCard({ composition }: GeneralMeasurementCardProps) {
  const tiles = [
    { label: 'Peso', value: composition.weightKg, unit: 'kg' },
    { label: 'Talla', value: composition.heightCm, unit: 'cm' },
    { label: 'IMC', value: composition.bmi, unit: 'kg/m²' },
    { label: 'Metabolismo basal', value: composition.basalMetabolismKcal, unit: 'kcal' },
    { label: 'Agua total', value: composition.totalWaterKg, unit: 'kg' },
    { label: 'Peso ideal', value: composition.idealWeightKg, unit: 'kg' },
    { label: 'Masa grasa ideal', value: composition.idealFatMassKg, unit: 'kg' },
    { label: 'Grasa a perder', value: composition.fatToLoseKg, unit: 'kg' },
  ].filter((tile) => tile.value != null)

  return (
    <SectionCard title={`Datos generales — ${formatShortDate(composition.assessmentDate)}`}>
      <Grid container spacing={2}>
        {tiles.map((tile) => (
          <Grid key={tile.label} size={{ xs: 6, sm: 4, md: 3 }}>
            <StatTile label={tile.label} value={formatNumber(tile.value)} unit={tile.unit} />
          </Grid>
        ))}
      </Grid>
    </SectionCard>
  )
}
