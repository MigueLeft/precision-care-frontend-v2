import { Box, Checkbox, FormControlLabel, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { toast } from '@/utils/toast'
import { AppButton } from '@/components/AppButton'
import { OptionButtons } from '@/components/ui/OptionButtons'
import { useCaptureDraftState } from '@/hooks/useCaptureDraftState'
import { useCompleteLifestyle, useLifestylePending } from '../../../hooks/useLifestyleCompletion'
import type { LifestyleAnswerInput, PendingLifestyleQuestion } from '../../../types'

type LifestyleQuickFillProps = {
  consultationId: number
  patientId: number
}

const TARGET_HINT = { anthropometry: 'También se carga en Antropometría', lab: 'También se carga en Paraclínicos' }

// Respuesta capturada (texto) → valor que se envía; null si está vacía o no es válida.
function toAnswer(question: PendingLifestyleQuestion, raw: string | undefined): LifestyleAnswerInput | null {
  if (raw === undefined || raw.trim() === '') return null
  if (question.type === 'boolean') return { questionId: question.questionId, booleanValue: raw === 'true' }
  if (question.type === 'single_choice') return { questionId: question.questionId, optionId: Number(raw) }
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? { questionId: question.questionId, numericValue: value } : null
}

function QuestionInput({ question, value, onChange }: { question: PendingLifestyleQuestion; value: string; onChange: (value: string) => void }) {
  if (question.type === 'boolean') {
    return (
      <OptionButtons
        ariaLabel={question.text}
        options={[{ value: 'true', label: 'Sí' }, { value: 'false', label: 'No' }]}
        value={value || null}
        onChange={(next) => onChange(next ?? '')}
      />
    )
  }
  if (question.type === 'single_choice') {
    return (
      <TextField select size="small" value={value} onChange={(event) => onChange(event.target.value)} sx={{ minWidth: 220 }}>
        {question.options.map((option) => (
          <MenuItem key={option.id} value={String(option.id)}>
            {option.text}
          </MenuItem>
        ))}
      </TextField>
    )
  }
  return <TextField size="small" type="number" value={value} onChange={(event) => onChange(event.target.value)} sx={{ width: 140 }} />
}

function QuickFillForm({ consultationId, patientId, questions }: LifestyleQuickFillProps & { questions: PendingLifestyleQuestion[] }) {
  // Lo ya capturado en esta consulta (antropometría, laboratorio) se precarga.
  const [values, setValues, clearDraft] = useCaptureDraftState<Record<string, string>>('workspace.lifestyle.answers', () =>
    Object.fromEntries(questions.filter((q) => q.suggestedValue != null).map((q) => [q.questionId, String(q.suggestedValue)])),
  )
  const complete = useCompleteLifestyle(consultationId, patientId, { onSuccess: clearDraft })
  const groups = [...new Set(questions.map((q) => q.componentLabel))]

  function submit() {
    const answers = questions.flatMap((question) => toAnswer(question, values[question.questionId]) ?? [])
    if (answers.length === 0) return toast.error('Completa al menos un dato.')
    complete.mutate(answers)
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px', borderColor: 'warning.light' }}>
      <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>Completar datos faltantes</Typography>
      <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 1.5 }}>
        El paciente no respondió estas preguntas en su formulario de ingreso. Al guardar se agregan al formulario,
        se recalcula el estilo de vida y los valores clínicos se cargan en su apartado de la consulta.
      </Typography>
      <Stack spacing={2}>
        {groups.map((label) => (
          <Box key={label}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', mb: 0.75 }}>{label.toUpperCase()}</Typography>
            <Stack spacing={1.25}>
              {questions.filter((q) => q.componentLabel === label).map((question) => (
                <Stack key={question.questionId} direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { md: 'center' } }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '13px' }}>{question.text}</Typography>
                    {question.target && <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>{TARGET_HINT[question.target.kind]}</Typography>}
                  </Box>
                  <QuestionInput
                    question={question}
                    value={values[question.questionId] ?? ''}
                    onChange={(value) => setValues((prev) => ({ ...prev, [question.questionId]: value }))}
                  />
                </Stack>
              ))}
            </Stack>
          </Box>
        ))}
        <AppButton variant="contained" loading={complete.isPending} onClick={submit} sx={{ alignSelf: 'flex-end' }}>
          Guardar y recalcular
        </AppButton>
      </Stack>
    </Paper>
  )
}

// Captura rápida de lo que falta para el Life's Essential 8 (glucosa, lípidos,
// presión arterial, ejercicio e IMC): el cuadro aparece al marcar la casilla.
// No se muestra nada si no falta ningún dato.
export function LifestyleQuickFill({ consultationId, patientId }: LifestyleQuickFillProps) {
  const { data } = useLifestylePending(consultationId)
  const [open, setOpen] = useCaptureDraftState('workspace.lifestyle.open', false)
  if (!data || data.questions.length === 0) return null

  const components = [...new Set(data.questions.map((q) => q.componentLabel))].join(', ')
  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={<Checkbox size="small" checked={open} onChange={(event) => setOpen(event.target.checked)} />}
        label={
          <Typography sx={{ fontSize: '13px' }}>
            Completar datos faltantes
            <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', ml: 0.75 }}>
              ({components})
            </Typography>
          </Typography>
        }
      />
      {open && (
        <QuickFillForm
          key={data.questions.map((q) => q.questionId).join('-')}
          consultationId={consultationId}
          patientId={patientId}
          questions={data.questions}
        />
      )}
    </Stack>
  )
}
