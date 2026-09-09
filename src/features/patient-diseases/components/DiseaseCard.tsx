import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { DISEASE_STATUS_LABELS } from '@/features/consultations'
import type { DiseaseStatus } from '@/features/consultations'
import { formatShortDate } from '@/utils/format-date'
import { formatDxDate } from '../utils'
import type { PatientDisease } from '../types'

interface DiseaseCardProps {
  disease: PatientDisease
  showSystem?: boolean
  onStatusChange: (status: DiseaseStatus) => void
  disabled?: boolean
}

const STATUSES = Object.keys(DISEASE_STATUS_LABELS) as DiseaseStatus[]

export function DiseaseCard({ disease, showSystem, onStatusChange, disabled }: DiseaseCardProps) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 0 },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>{disease.name ?? '—'}</Typography>
          {disease.code && (
            <Typography
              sx={{ fontSize: '11px', color: 'text.secondary', bgcolor: 'grey.100', px: 0.75, borderRadius: 0.5 }}
            >
              {disease.code}
            </Typography>
          )}
          {disease.isChronic && <Chip size="small" color="info" label="Crónica" />}
          {showSystem && disease.bodySystemName && (
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {disease.bodySystemName}
            </Typography>
          )}
        </Stack>
        {disease.notes && (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: 0.25 }}>
            {disease.notes}
          </Typography>
        )}
        <Typography sx={{ fontSize: '12px', color: 'text.disabled', mt: 0.25 }}>
          Dx {formatDxDate(disease.dxDate)}
          {disease.specialistName
            ? ` · ${disease.specialistName}`
            : ` · registrada ${formatShortDate(disease.recordedAt)}`}
        </Typography>
      </Box>

      <FormControl size="small" sx={{ minWidth: 140, flexShrink: 0 }} disabled={disabled}>
        <Select
          value={disease.status}
          onChange={(event) => onStatusChange(event.target.value as DiseaseStatus)}
        >
          {STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {DISEASE_STATUS_LABELS[status]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
