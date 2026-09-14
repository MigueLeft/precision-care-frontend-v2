import { useState } from 'react'
import { Paper, Stack, Typography } from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { useIntakeResponsesByPatient } from '@/features/intake-responses/hooks/useIntakeResponsesByPatient'
import { IntakeResponseDetailDrawer } from '@/features/intake-responses/components/IntakeResponseDetailDrawer'

interface IntakeResponsesSectionProps {
  patientId: number
}

// Lista compacta de ingresables del paciente para consultarlos sin salir del
// encuentro (misma info que el tab "Ingresables" del expediente, resumida).
export function IntakeResponsesSection({ patientId }: IntakeResponsesSectionProps) {
  const { data: responses = [] } = useIntakeResponsesByPatient(patientId)
  const [openResponseId, setOpenResponseId] = useState<number | null>(null)

  return (
    <div>
      <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 1 }}>
        Ingresable
      </Typography>

      {responses.length === 0 ? (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          Sin ingresables asignados.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {responses.map((response) => (
            <Paper
              key={response.id}
              onClick={() => response.completed && setOpenResponseId(response.id)}
              sx={{
                p: 1.25,
                borderRadius: '8px',
                display: 'flex',
                gap: 1.25,
                alignItems: 'center',
                cursor: response.completed ? 'pointer' : 'default',
                opacity: response.completed ? 1 : 0.6,
                '&:hover': response.completed ? { bgcolor: 'action.hover' } : undefined,
              }}
            >
              <AssignmentOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: '12.5px', fontWeight: 600 }} noWrap>
                  {response.intakeName ?? 'Ingresable'}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                  {response.completed ? 'Completado' : 'Pendiente'}
                </Typography>
              </div>
            </Paper>
          ))}
        </Stack>
      )}

      <IntakeResponseDetailDrawer
        responseId={openResponseId}
        open={openResponseId != null}
        onClose={() => setOpenResponseId(null)}
      />
    </div>
  )
}
