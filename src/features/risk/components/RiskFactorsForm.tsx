import { Controller, useForm } from 'react-hook-form'
import { useConsultationDraftForm } from '@/hooks/useConsultationDraftForm'
import { Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import type { ClinicalProfile, FamilyDiabetes, ProfileValue, RiskFactorAnswers } from '../types'
import { CONFIRMATION_QUESTIONS, FAMILY_DIABETES_LABELS, SOURCE_LABELS } from '../utils/risk-labels'
import { DIAGNOSIS_QUESTIONS } from '../utils/cardio-labels'
import { YesNoQuestion, type YesNo } from './YesNoQuestion'

type FormValues = Record<string, YesNo> & { familyDiabetes: FamilyDiabetes | '' }

type RiskFactorsFormProps = {
  profile: ClinicalProfile
  readOnly: boolean
  saving: boolean
  onSubmit: (answers: RiskFactorAnswers) => void
}

const toYesNo = (v: ProfileValue<boolean> | null): YesNo => (v ? (v.value ? 'yes' : 'no') : '')
const fromYesNo = (v: YesNo) => (v === '' ? null : v === 'yes')
const ALL_QUESTIONS = [...CONFIRMATION_QUESTIONS, ...DIAGNOSIS_QUESTIONS]

// Pre-llenado con lo que ya se sabe (IM1, laboratorio, medicamentos,
// antecedentes, diagnósticos); el médico confirma o corrige. Los diagnósticos
// solo se envían si se tocan: confirmarlos sin revisar podría excluir el CHA2DS2
// (p. ej. una prótesis valvular inferida de Z95.2).
export function RiskFactorsForm({ profile, readOnly, saving, onSubmit }: RiskFactorsFormProps) {
  const defaults = Object.fromEntries(
    ALL_QUESTIONS.map((q) => [q.key, toYesNo(profile[q.key as keyof ClinicalProfile] as ProfileValue<boolean> | null)]),
  ) as FormValues
  defaults.familyDiabetes = profile.familyDiabetes?.value ?? ''
  const form = useForm<FormValues>({ values: defaults })
  const { control, handleSubmit, formState } = form
  // Respaldo de lo marcado en la consulta en curso hasta guardarlo.
  useConsultationDraftForm(readOnly ? null : 'riskFactors', form)

  const submit = handleSubmit((values) => {
    const answers: RiskFactorAnswers = { familyDiabetes: values.familyDiabetes || null }
    for (const q of CONFIRMATION_QUESTIONS) answers[q.key] = fromYesNo(values[q.key] as YesNo)
    for (const q of DIAGNOSIS_QUESTIONS) {
      if (formState.dirtyFields[q.key]) (answers as Record<string, boolean | null>)[q.key] = fromYesNo(values[q.key] as YesNo)
    }
    onSubmit(answers)
  })

  const sourceOf = (key: string) => {
    const value = profile[key as keyof ClinicalProfile] as ProfileValue<unknown> | null
    return value ? SOURCE_LABELS[value.source] : 'sin dato'
  }

  const questionGrid = (questions: { key: string; label: string }[]) =>
    questions.map((q) => (
      <Grid key={q.key} size={{ xs: 12, md: 6 }}>
        <Controller
          name={q.key}
          control={control}
          render={({ field }) => (
            <YesNoQuestion label={q.label} source={sourceOf(q.key)} value={field.value as YesNo} disabled={readOnly} onChange={field.onChange} />
          )}
        />
      </Grid>
    ))

  return (
    <Stack component="form" onSubmit={submit} spacing={1}>
      <Grid container spacing={1}>
        {questionGrid(CONFIRMATION_QUESTIONS)}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="familyDiabetes"
            control={control}
            render={({ field }) => (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  disabled={readOnly}
                  value={field.value}
                  onChange={(_e, next: FamilyDiabetes | null) => field.onChange(next ?? '')}
                  sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1 } }}
                >
                  {(Object.keys(FAMILY_DIABETES_LABELS) as FamilyDiabetes[]).map((key) => (
                    <ToggleButton key={key} value={key}>
                      {FAMILY_DIABETES_LABELS[key]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Typography sx={{ fontSize: '13px' }}>
                  Familiar con diabetes
                  <Typography component="span" sx={{ fontSize: '11px', color: 'text.secondary', ml: 0.5 }}>
                    ({sourceOf('familyDiabetes')})
                  </Typography>
                </Typography>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
      <Typography sx={{ fontSize: '12px', fontWeight: 700, pt: 0.5 }}>
        Diagnósticos (fibrilación auricular y CHA₂DS₂)
        <Typography component="span" sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>
          · se guardan solo los que cambies
        </Typography>
      </Typography>
      <Grid container spacing={1}>
        {questionGrid(DIAGNOSIS_QUESTIONS)}
      </Grid>
      {!readOnly && (
        <AppButton type="submit" size="small" variant="contained" loading={saving} sx={{ alignSelf: 'flex-start' }}>
          {formState.isDirty ? 'Guardar y recalcular' : 'Confirmar datos'}
        </AppButton>
      )}
    </Stack>
  )
}
