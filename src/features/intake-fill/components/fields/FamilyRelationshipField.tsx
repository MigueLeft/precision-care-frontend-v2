import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { ChipMultiSelect } from '@/components/ui/ChipMultiSelect'
import { FAMILY_RELATIONSHIPS } from '@/features/antecedents'
import type { IntakeResponseDetailQuestionOption } from '@/features/intake-responses'
import type { QuestionFieldProps } from '../../types'
import { isNoneOption, joinRelationships, splitRelationships } from '../../utils/family-relationship'

// Antecedentes familiares: cada condición marcada pide de qué familiar(es)
// proviene (mismos parentescos que en la consulta). "Ninguna" es excluyente.
export function FamilyRelationshipField({ question, value, onChange }: QuestionFieldProps) {
  const options = question.options ?? []
  const selected = value?.kind === 'options' ? value.optionIds : []
  const texts = value?.kind === 'options' ? (value.texts ?? {}) : {}

  function toggle(option: IntakeResponseDetailQuestionOption) {
    if (selected.includes(option.id)) {
      const nextTexts = { ...texts }
      delete nextTexts[option.id]
      onChange({
        kind: 'options',
        optionIds: selected.filter((id) => id !== option.id),
        texts: nextTexts,
      })
      return
    }
    if (isNoneOption(option)) {
      onChange({ kind: 'options', optionIds: [option.id], texts: {} })
      return
    }
    const noneIds = options.filter(isNoneOption).map((item) => item.id)
    onChange({
      kind: 'options',
      optionIds: [...selected.filter((id) => !noneIds.includes(id)), option.id],
      texts,
    })
  }

  function setRelationships(optionId: number, relationships: string[]) {
    onChange({
      kind: 'options',
      optionIds: selected,
      texts: { ...texts, [optionId]: joinRelationships(relationships) },
    })
  }

  return (
    <Stack>
      {options.map((option) => {
        const checked = selected.includes(option.id)
        return (
          <Stack key={option.id}>
            <FormControlLabel
              control={<Checkbox size="small" checked={checked} onChange={() => toggle(option)} />}
              label={option.text}
            />
            {checked && !isNoneOption(option) && (
              <Stack spacing={0.75} sx={{ ml: 3.5, mb: 1.5, mt: 0.5 }}>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  ¿Qué familiar? Puedes elegir varios.
                </Typography>
                <ChipMultiSelect
                  options={FAMILY_RELATIONSHIPS}
                  value={splitRelationships(texts[option.id])}
                  onChange={(relationships) => setRelationships(option.id, relationships)}
                />
              </Stack>
            )}
          </Stack>
        )
      })}
    </Stack>
  )
}
