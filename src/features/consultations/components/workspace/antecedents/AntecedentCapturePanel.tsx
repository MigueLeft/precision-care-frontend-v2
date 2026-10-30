import { Stack } from '@mui/material'
import { OptionButtons } from '@/components/ui/OptionButtons'
import { useAntecedentsByPatient, type Antecedent } from '@/features/antecedents'
import { useCaptureDraftState } from '@/hooks/useCaptureDraftState'
import { useConsultationAllergies } from '../../../hooks/useConsultationAllergies'
import { CaptureField } from '../capture/CaptureLayout'
import { useEncounterWorkspace } from '../workspace-context'
import { AllergyCaptureForm } from './AllergyCaptureForm'
import { FamilyAntecedentForm } from './FamilyAntecedentForm'
import { PersonalAntecedentForm } from './PersonalAntecedentForm'
import { SurgicalAntecedentForm } from './SurgicalAntecedentForm'

type AntecedentKind = 'family' | 'personal' | 'surgery' | 'hospitalization' | 'allergy'

const KINDS: { value: AntecedentKind; label: string }[] = [
  { value: 'family', label: 'Familiar' },
  { value: 'personal', label: 'Personal' },
  { value: 'surgery', label: 'Cirugía' },
  { value: 'hospitalization', label: 'Hospitalización' },
  { value: 'allergy', label: 'Alergia' },
]

function kindOf(antecedent: Antecedent): AntecedentKind {
  if (antecedent.type === 'family' || antecedent.type === 'surgery' || antecedent.type === 'hospitalization') return antecedent.type
  return 'personal'
}

type AntecedentCapturePanelProps = {
  patientId: number
  consultationId: number
}

// Panel derecho de Antecedentes: primero el tipo de registro y luego su
// formulario. Al editar desde la lista, el tipo queda fijo en el del registro.
export function AntecedentCapturePanel({ patientId, consultationId }: AntecedentCapturePanelProps) {
  const { editing } = useEncounterWorkspace()
  const { data: antecedents = [] } = useAntecedentsByPatient(patientId)
  const { data: allergyData } = useConsultationAllergies(consultationId)
  const [selectedKind, setKind] = useCaptureDraftState<AntecedentKind>('workspace.antecedent.kind', 'family')

  const antecedent = editing?.kind === 'antecedent' ? (antecedents.find((item) => item.id === editing.id) ?? null) : null
  const allergy = editing?.kind === 'allergy' ? (allergyData?.allergies.find((item) => item.id === editing.id) ?? null) : null
  const kind = antecedent ? kindOf(antecedent) : allergy ? 'allergy' : selectedKind
  const formKey = `${kind}-${antecedent?.id ?? allergy?.id ?? 'new'}`

  return (
    <Stack spacing={2}>
      <CaptureField label="Tipo de antecedente">
        <OptionButtons
          ariaLabel="Tipo de antecedente"
          options={KINDS}
          value={kind}
          onChange={(next) => next && setKind(next)}
          disabled={!!antecedent || !!allergy}
          required
        />
      </CaptureField>
      {kind === 'family' && <FamilyAntecedentForm key={formKey} patientId={patientId} antecedent={antecedent} />}
      {kind === 'personal' && <PersonalAntecedentForm key={formKey} patientId={patientId} antecedent={antecedent} />}
      {(kind === 'surgery' || kind === 'hospitalization') && (
        <SurgicalAntecedentForm key={formKey} patientId={patientId} type={kind} antecedent={antecedent} />
      )}
      {kind === 'allergy' && <AllergyCaptureForm key={formKey} consultationId={consultationId} allergy={allergy} />}
    </Stack>
  )
}
