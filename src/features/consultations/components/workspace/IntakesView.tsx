import { useState } from 'react'
import { IconButton, MenuItem, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import PushPinIcon from '@mui/icons-material/PushPin'
import { IntakeResponseDetailContent, useIntakeResponsesByPatient } from '@/features/intake-responses'
import { NutritionRecallSidebarSection } from '@/features/nutrition-recall'
import { LandIntakeButton } from '../encounter/LandIntakeButton'
import { BoardEmpty, BoardHeader } from './BoardHeader'
import { useEncounterWorkspace } from './workspace-context'
import type { Consultation } from '../../types'

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

type IntakesViewProps = {
  consultation: Consultation
  readOnly: boolean
}

// Ingresables del paciente en el panel central: la lista y, al elegir uno
// completado, sus respuestas. Cualquiera se puede fijar a la derecha.
export function IntakesView({ consultation, readOnly }: IntakesViewProps) {
  const patientId = consultation.patientId
  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const [openId, setOpenId] = useState<number | null>(null)

  const completed = responses.filter((response) => response.completed)

  if (openId !== null) {
    return (
      <Stack spacing={1.5}>
        {/* Flecha para volver a la lista y selector para pasar a otro ingresable. */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Volver a los ingresables">
            <IconButton aria-label="Volver a los ingresables" onClick={() => setOpenId(null)} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <TextField
            select
            size="small"
            label="Ingresable"
            value={openId}
            onChange={(event) => setOpenId(Number(event.target.value))}
            sx={{ flex: 1, maxWidth: 360 }}
          >
            {completed.map((response) => (
              <MenuItem key={response.id} value={response.id}>
                {response.intakeName ?? 'Ingresable'}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
          <IntakeResponseDetailContent key={openId} responseId={openId} headerAction={<PinIntakeButton responseId={openId} />} />
        </Paper>
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <div>
        <BoardHeader title="Ingresables" meta={`${responses.length} asignados`}>
          {!readOnly && consultation.visitType === 'first' && <LandIntakeButton consultation={consultation} />}
        </BoardHeader>
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
