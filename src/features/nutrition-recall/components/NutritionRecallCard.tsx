import { useState } from 'react'
import { Avatar, Box, Paper, Stack, Typography } from '@mui/material'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import { AppButton } from '@/components/AppButton'
import { SendNutritionRecallDialog } from './SendNutritionRecallDialog'

// Tarjeta del Recordatorio de 24 Horas en la página de Ingresables: se envía
// eligiendo al paciente en el diálogo.
export function NutritionRecallCard() {
  const [open, setOpen] = useState(false)

  return (
    <Paper sx={{ p: 2.5, borderRadius: '8px', mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
      >
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <RestaurantOutlinedIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>Recordatorio de 24 Horas</Typography>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            Entrevista nutricional con NutriBot. El paciente recibe un enlace y, al terminar, el equipo genera su
            reporte nutricional en PDF desde el expediente o la consulta.
          </Typography>
        </Box>
        <AppButton
          variant="contained"
          startIcon={<SendOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={() => setOpen(true)}
        >
          Enviar a un paciente
        </AppButton>
      </Stack>
      <SendNutritionRecallDialog open={open} onClose={() => setOpen(false)} />
    </Paper>
  )
}
