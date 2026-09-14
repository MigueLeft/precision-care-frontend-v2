import { Box, Stack, Typography } from '@mui/material'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { resolveIntakeAnswerText } from '../utils/resolve-intake-answer'
import type { IntakeResponseDetailGroup } from '../types'

interface IntakeResponseDetailGroupSectionProps {
  group: IntakeResponseDetailGroup
  defaultExpanded?: boolean
}

export function IntakeResponseDetailGroupSection({
  group,
  defaultExpanded = false,
}: IntakeResponseDetailGroupSectionProps) {
  return (
    <CollapsibleSection title={group.title} defaultExpanded={defaultExpanded}>
      <Stack spacing={1.5}>
        {group.questions.map((question) => {
          const answerText = resolveIntakeAnswerText(question)
          return (
            <Box key={question.id}>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {question.text}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: answerText ? 600 : 400,
                  color: answerText ? 'text.primary' : 'text.disabled',
                  fontStyle: answerText ? 'normal' : 'italic',
                }}
              >
                {answerText ?? 'Sin respuesta'}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </CollapsibleSection>
  )
}
