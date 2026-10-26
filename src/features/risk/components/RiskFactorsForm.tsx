import { Controller, useForm } from 'react-hook-form'
import { Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import type { ClinicalProfile, FamilyDiabetes, ProfileValue, RiskFactorAnswers } from '../types'
import { CONFIRMATION_QUESTIONS, FAMILY_DIABETES_LABELS, SOURCE_LABELS } from '../utils/risk-labels'

type YesNo = 'yes' | 'no' | ''
type FormValues = Record<(typeof CONFIRMATION_QUESTIONS)[number]['key'], YesNo> & {
  familyDiabetes: FamilyDiabetes | ''
}

type RiskFactorsFormProps = {
  profile: ClinicalProfile
  readOnly: boolean
  saving: boolean
  onSubmit: (answers: RiskFactorAnswers) => void
}

const toYesNo = (v: ProfileValue<boolean> | null): YesNo => (v ? (v.value ? 'yes' : 'no') : '')
const fromYesNo = (v: YesNo) => (v === '' ? null : v === 'yes')

// Pre-llenado con lo que ya se sabe (IM1, laboratorio, medicamentos,
// antecedentes); el médico confirma o corrige. Lo confirmado tiene prioridad.
export function RiskFactorsForm({ profile, readOnly, saving, onSubmit }: RiskFactorsFormProps) {
  const defaults = Object.fromEntries(
    CONFIRMATION_QUESTIONS.map((q) => [q.key, toYesNo(profile[q.key] as ProfileValue<boolean> | null)]),
  ) as FormValues
  defaults.familyDiabetes = profile.familyDiabetes?.value ?? ''
  const { control, handleSubmit, formState } = useForm<FormValues>({ values: defaults })

  const submit = handleSubmit((values) => {
    const answers: RiskFactorAnswers = { familyDiabetes: values.familyDiabetes || null }
    for (const q of CONFIRMATION_QUESTIONS) answers[q.key] = fromYesNo(values[q.key])
    onSubmit(answers)
  })

  const sourceOf = (key: keyof ClinicalProfile) => {
    const value = profile[key] as ProfileValue<unknown> | null
    return value ? SOURCE_LABELS[value.source] : 'sin dato'
  }

  return (
    <Stack component="form" onSubmit={submit} spacing={1}>
      <Grid container spacing={1}>
        {CONFIRMATION_QUESTIONS.map((q) => (
          <Grid key={q.key} size={{ xs: 12, md: 6 }}>
            <Controller
              name={q.key}
              control={control}
              render={({ field }) => (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    disabled={readOnly}
                    value={field.value}
                    onChange={(_e, next: YesNo | null) => field.onChange(next ?? '')}
                    sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1 } }}
                  >
                    <ToggleButton value="yes">Sí</ToggleButton>
                    <ToggleButton value="no">No</ToggleButton>
                  </ToggleButtonGroup>
                  <Typography sx={{ fontSize: '13px', flex: 1 }}>
                    {q.label}
                    <Typography component="span" sx={{ fontSize: '11px', color: 'text.secondary', ml: 0.5 }}>
                      ({sourceOf(q.key)})
                    </Typography>
                  </Typography>
                </Stack>
              )}
            />
          </Grid>
        ))}
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
      {!readOnly && (
        <AppButton type="submit" size="small" variant="contained" loading={saving} sx={{ alignSelf: 'flex-start' }}>
          {formState.isDirty ? 'Guardar y recalcular' : 'Confirmar datos'}
        </AppButton>
      )}
    </Stack>
  )
}
