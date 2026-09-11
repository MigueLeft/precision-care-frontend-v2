import { Box, Grid, LinearProgress, Stack, Typography } from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined'
import SmokeFreeOutlinedIcon from '@mui/icons-material/SmokeFreeOutlined'
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { EmptyState } from '@/components/EmptyState'
import { formatShortDate } from '@/utils/format-date'
import { toNumber } from '@/utils/parse-numeric'
import {
  LIFESTYLE_COMPONENT_LABELS,
  LIFESTYLE_COMPONENT_ORDER,
  formatComponentDetail,
} from '../utils/lifestyle-format'
import type { LifestyleAssessment, LifestyleComponentType } from '../types'

interface LifeEssential8CardProps {
  assessment: LifestyleAssessment
  onViewHistory?: () => void
}

const COMPONENT_ICONS: Record<LifestyleComponentType, SvgIconComponent> = {
  diet: RestaurantOutlinedIcon,
  physical_activity: DirectionsRunOutlinedIcon,
  nicotine: SmokeFreeOutlinedIcon,
  sleep: BedtimeOutlinedIcon,
  bmi: MonitorWeightOutlinedIcon,
  lipids: OpacityOutlinedIcon,
  glucose: WaterDropOutlinedIcon,
  blood_pressure: FavoriteBorderOutlinedIcon,
}

// Verde ≥70, ámbar 40–69, rojo <40 — misma escala que el score global.
function tone(value: number): 'success' | 'warning' | 'error' {
  if (value >= 70) return 'success'
  if (value >= 40) return 'warning'
  return 'error'
}

function Bar({ value }: { value: number }) {
  const color = tone(value)
  return (
    <LinearProgress
      variant="determinate"
      value={Math.max(0, Math.min(100, value))}
      color={color}
      sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100' }}
    />
  )
}

// Diseño tipo dashboard: score global + 8 tarjetas de Life's Essential 8.
export function LifeEssential8Card({ assessment, onViewHistory }: LifeEssential8CardProps) {
  const global = toNumber(assessment.globalScore) ?? 0
  const componentByType = new Map(
    assessment.components.map((component) => [component.component, component]),
  )

  return (
    <Box>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2.5, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: 1, width: '100%' }}>
            <Typography sx={{ fontSize: '40px', fontWeight: 700, color: `${tone(global)}.main`, lineHeight: 1 }}>
              {Math.round(global)}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '11px', color: 'text.secondary', mb: 0.5 }}>
                Score global
              </Typography>
              <Bar value={global} />
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>0</Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>50</Typography>
                <Typography sx={{ fontSize: '10px', color: 'text.disabled' }}>100</Typography>
              </Stack>
            </Box>
          </Stack>
          <Stack sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Última evaluación
            </Typography>
            <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
              {formatShortDate(assessment.assessmentDate)}
            </Typography>
            {onViewHistory && (
              <Typography
                onClick={onViewHistory}
                sx={{ fontSize: '12px', color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}
              >
                Ver historial
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {LIFESTYLE_COMPONENT_ORDER.map((type) => {
          const component = componentByType.get(type)
          const score = component ? (toNumber(component.score) ?? 0) : 0
          const Icon = COMPONENT_ICONS[type]
          const detail = component ? formatComponentDetail(component.rawValue) : undefined
          return (
            <Grid key={type} size={{ xs: 12, sm: 6 }}>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                      {LIFESTYLE_COMPONENT_LABELS[type]}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '15px', fontWeight: 700, color: `${tone(score)}.main` }}>
                    {component ? Math.round(score) : '—'}
                  </Typography>
                </Stack>
                <Bar value={score} />
                <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 0.75 }}>
                  {detail ?? (component ? 'Sin detalle adicional.' : 'Sin dato capturado.')}
                </Typography>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export function LifeEssential8Empty() {
  return <EmptyState message="Sin evaluaciones de estilo de vida registradas." />
}
