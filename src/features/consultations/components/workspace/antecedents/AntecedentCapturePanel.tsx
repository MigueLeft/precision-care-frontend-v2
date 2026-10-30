import { Stack } from '@mui/material'
import { OptionButtons } from '@/components/ui/OptionButtons'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'
import { CaptureField } from '../capture/CaptureLayout'
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

type AntecedentCapturePanelProps = {
  patientId: number
  consultationId: number
}

// Panel derecho de Antecedentes: primero el tipo de registro y luego su formulario.
export function AntecedentCapturePanel({ patientId, consultationId }: AntecedentCapturePanelProps) {
  const [kind, setKind] = useConsultationDraftState<AntecedentKind>('workspace.antecedent.kind', 'family')

  return (
    <Stack spacing={2}>
      <CaptureField label="Tipo de antecedente">
        <OptionButtons ariaLabel="Tipo de antecedente" options={KINDS} value={kind} onChange={(next) => next && setKind(next)} required />
      </CaptureField>
      {kind === 'family' && <FamilyAntecedentForm patientId={patientId} />}
      {kind === 'personal' && <PersonalAntecedentForm patientId={patientId} />}
      {(kind === 'surgery' || kind === 'hospitalization') && <SurgicalAntecedentForm key={kind} patientId={patientId} type={kind} />}
      {kind === 'allergy' && <AllergyCaptureForm consultationId={consultationId} />}
    </Stack>
  )
}
