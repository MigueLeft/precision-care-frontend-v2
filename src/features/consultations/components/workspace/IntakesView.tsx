import { useState } from 'react'
import { IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import { AppButton } from '@/components/AppButton'
import { IntakeResponseDetailContent, useIntakeResponsesByPatient } from '@/features/intake-responses'
import { NutritionRecallSidebarSection } from '@/features/nutrition-recall'
import { BoardEmpty, BoardHeader } from './BoardHeader'
import { useEncounterWorkspace } from './workspace-context'

// Botón para fijar un ingresable en el panel derecho (o soltarlo).
export function PinIntakeButton({ responseId }: { responseId: number }) {
  const { pinnedIntakeId, pinIntake, unpinIntake } = useEncounterWorkspace()
  const pinned = pinnedIntakeId === responseId
  return (
    <Tooltip title={pinned ? 'Quitar del panel derecho' : 'Fijar en el panel derecho'}>
      <IconButton size="small" aria-label={pinned ? 'Desfijar ingresable' : 'Fijar ingresable'} onClick={() => (pinned ? unpinIntake() : pinIntake(responseId))}>
        {pinned ? <PushPinIcon sx={{ fontSize: 18, color: 'primary.main' }} /> : <PushPinOutlinedIcon sx={{ fontSize: 18 }} />}
      </IconButton>
    </Tooltip>
  )
}

// Ingresables del paciente en el panel central: la lista y, al elegir uno
// completado, sus respuestas. Cualquiera se puede fijar a la derecha.
export function IntakesView({ patientId }: { patientId: number }) {
  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const [openId, setOpenId] = useState<number | null>(null)

  if (openId !== null) {
    return (
      <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
        <IntakeResponseDetailContent
          responseId={openId}
          headerAction={
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <PinIntakeButton responseId={openId} />
              <AppButton size="small" variant="text" startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />} onClick={() => setOpenId(null)}>
                Volver
              </AppButton>
            </Stack>
          }
        />
      </Paper>
    )
  }

  return (
    <Stack spacing={3}>
      <div>
        <BoardHeader title="Ingresables" meta={`${responses.length} asignados`} />
        {responses.length === 0 && <BoardEmpty>Sin ingresables asignados.</BoardEmpty>}
        <Stack spacing={1}>
          {responses.map((response) => (
            <Paper
              key={response.id}
              variant="outlined"
              onClick={() => response.completed && setOpenId(response.id)}
              sx={{
                p: 1.5,
                borderRadius: '8px',
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                cursor: response.completed ? 'pointer' : 'default',
                opacity: response.completed ? 1 : 0.6,
                '&:hover': response.completed ? { bgcolor: 'action.hover' } : undefined,
              }}
            >
              <AssignmentOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600 }} noWrap>{response.intakeName ?? 'Ingresable'}</Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {response.completed ? 'Completado · ver respuestas' : 'Pendiente'}
                </Typography>
              </Stack>
              {response.completed && (
                <span onClick={(event) => event.stopPropagation()}>
                  <PinIntakeButton responseId={response.id} />
                </span>
              )}
            </Paper>
          ))}
        </Stack>
      </div>
      <NutritionRecallSidebarSection patientId={patientId} />
    </Stack>
  )
}
