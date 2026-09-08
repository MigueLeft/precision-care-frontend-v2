import { Box, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'

interface PlaceholderSectionProps {
  index: number
  title: string
  subtitle?: string
}

// Apartado del encuentro aún sin funcionalidad (se cablean por fases).
export function PlaceholderSection({ index, title, subtitle }: PlaceholderSectionProps) {
  return (
    <CollapsibleSection
      title={`${index}. ${title}`}
      headerMeta={
        subtitle ? (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{subtitle}</Typography>
        ) : undefined
      }
    >
      <Box
        sx={{
          border: '1px dashed',
          borderColor: 'grey.300',
          borderRadius: 1.5,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          Este apartado se habilitará próximamente.
        </Typography>
      </Box>
    </CollapsibleSection>
  )
}
