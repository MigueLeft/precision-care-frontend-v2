import { useState } from 'react'
import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { toast } from 'sonner'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { getApiErrorMessage } from '@/utils/get-api-error-message'
import { usePublicIntakeResponse } from '../hooks/usePublicIntakeResponse'
import {
  completePublicIntakeResponse,
  submitPublicAnswer,
  type PublicAnswerPayload,
} from '../services/intake-fill.service'
import { PublicQuestionField, type AnswerDraft } from './PublicQuestionField'

interface PublicIntakeFillPageProps {
  token: string
}

function draftToPayloads(questionId: number, draft: AnswerDraft): PublicAnswerPayload[] {
  switch (draft.kind) {
    case 'option':
      return [{ questionId, optionId: draft.optionId }]
    case 'options':
      return draft.optionIds.map((optionId) => ({ questionId, optionId }))
    case 'text':
      return draft.value.trim() ? [{ questionId, textValue: draft.value.trim() }] : []
    case 'numeric': {
      const numeric = Number(draft.value)
      return draft.value !== '' && !Number.isNaN(numeric)
        ? [{ questionId, numericValue: numeric }]
        : []
    }
    case 'date':
      return draft.value ? [{ questionId, dateValue: draft.value }] : []
    case 'boolean':
      return [{ questionId, booleanValue: draft.value }]
    default:
      return []
  }
}

export function PublicIntakeFillPage({ token }: PublicIntakeFillPageProps) {
  const { data: response, isLoading, isError, error } = usePublicIntakeResponse(token)
  const [answers, setAnswers] = useState<Record<number, AnswerDraft>>({})
  const [submitting, setSubmitting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  async function handleSubmit() {
    if (!response) return
    setSubmitting(true)
    try {
      const payloads = Object.entries(answers).flatMap(([questionId, draft]) =>
        draftToPayloads(Number(questionId), draft),
      )
      for (const payload of payloads) {
        await submitPublicAnswer(token, payload)
      }
      await completePublicIntakeResponse(token)
      setJustCompleted(true)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo enviar el formulario.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          bgcolor: 'brand.dark',
          color: '#ffffff',
          px: { xs: 2, sm: 4 },
          py: 2.5,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>Precisión Care</Typography>
      </Box>

      <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        {isLoading && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && (
          <EmptyState message={getApiErrorMessage(error, 'Este formulario no existe o el enlace ya no es válido.')} />
        )}

        {response && (response.completed || justCompleted) && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '8px' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 0.5 }}>
              ¡Gracias por completar el formulario!
            </Typography>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              Tu médico ya puede ver tus respuestas. Puedes cerrar esta ventana.
            </Typography>
          </Paper>
        )}

        {response && !response.completed && !justCompleted && (
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>
                {response.intakeName ?? 'Formulario'}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                Completa las preguntas que apliquen a tu caso y presiona "Enviar formulario" al final.
              </Typography>
            </Box>

            {response.groups.map((group) => (
              <CollapsibleSection key={group.id} title={group.title} defaultExpanded>
                <Stack spacing={2.5}>
                  {group.questions.map((question) => (
                    <PublicQuestionField
                      key={question.id}
                      question={question}
                      value={answers[question.id]}
                      onChange={(value) =>
                        setAnswers((prev) => ({ ...prev, [question.id]: value }))
                      }
                    />
                  ))}
                </Stack>
              </CollapsibleSection>
            ))}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 4 }}>
              <AppButton variant="contained" size="large" loading={submitting} onClick={handleSubmit}>
                Enviar formulario
              </AppButton>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
