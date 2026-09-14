import { Box, Stack, Typography, Chip } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import type { IntakeDetailed } from '../types'

interface BuilderHeaderProps {
  intake: IntakeDetailed
  isDraft: boolean
  isPreparingDraft: boolean
  isPublishing: boolean
  onStartEditing: () => void
  onPublish: () => void
}

export function BuilderHeader({
  intake,
  isDraft,
  isPreparingDraft,
  isPublishing,
  onStartEditing,
  onPublish,
}: BuilderHeaderProps) {
  const version = intake.version

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h1" sx={{ mb: 0.5 }}>
            {intake.name}
          </Typography>
          {intake.description && (
            <Typography variant="body1" color="text.secondary">
              {intake.description}
            </Typography>
          )}
        </Box>

        {version && isDraft && (
          <AppButton variant="contained" loading={isPublishing} onClick={onPublish}>
            Publicar versión
          </AppButton>
        )}
        {(!version || !isDraft) && (
          <AppButton variant="contained" loading={isPreparingDraft} onClick={onStartEditing}>
            {version ? 'Editar (nueva versión)' : 'Comenzar a construir'}
          </AppButton>
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
        {version && (
          <Chip
            label={
              isDraft ? `Versión ${version.versionNumber} — borrador` : `Versión ${version.versionNumber} — publicada`
            }
            size="small"
            color={isDraft ? 'warning' : 'success'}
          />
        )}
        {!version && <Chip label="Sin contenido todavía" size="small" />}
      </Stack>
    </Box>
  )
}
