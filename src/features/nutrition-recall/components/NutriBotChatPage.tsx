import { Avatar, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { EmptyState } from '@/components/EmptyState'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { FRIENDLY_ERROR_MESSAGE, isNotFoundError } from '@/utils/report-error'
import { usePublicNutritionRecall } from '../hooks/useNutritionRecallQueries'
import { NutriBotChat } from './NutriBotChat'

function CompletedCard() {
  return (
    <Paper sx={{ p: 4, m: 3, textAlign: 'center', borderRadius: '8px' }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
      <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 0.5 }}>
        Ya completaste tu Recordatorio de 24 Horas
      </Typography>
      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
        Tu equipo de Precision Care ya tiene tus respuestas. Puedes cerrar esta ventana.
      </Typography>
    </Paper>
  )
}

type NutriBotChatPageProps = {
  token: string
}

// Página pública (sin sesión) del Recordatorio de 24 Horas con NutriBot.
export function NutriBotChatPage({ token }: NutriBotChatPageProps) {
  const { data: recall, isLoading, isError, error } = usePublicNutritionRecall(token)

  return (
    <Stack sx={{ height: '100dvh', bgcolor: 'background.default' }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ bgcolor: 'brand.dark', color: '#ffffff', px: { xs: 2, sm: 4 }, py: 1.75, alignItems: 'center' }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          <RestaurantOutlinedIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '16px', lineHeight: 1.2 }}>NutriBot</Typography>
          <Typography sx={{ fontSize: '12px', opacity: 0.8 }}>
            Precision Care · Recordatorio de 24 Horas
          </Typography>
        </Box>
      </Stack>

      {isLoading && (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {isError && (
        <Box sx={{ p: 3 }}>
          <EmptyState
            message={
              isNotFoundError(error)
                ? 'Este enlace no es válido o ya expiró. Contacta a tu clínica para solicitar uno nuevo.'
                : FRIENDLY_ERROR_MESSAGE
            }
          />
        </Box>
      )}
      {recall?.completed && <CompletedCard />}
      {recall && !recall.completed && (
        <ErrorBoundary title="NutriBot no está disponible" message={FRIENDLY_ERROR_MESSAGE}>
          <NutriBotChat token={token} recall={recall} />
        </ErrorBoundary>
      )}
    </Stack>
  )
}
