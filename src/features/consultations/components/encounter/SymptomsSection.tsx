import { Stack, Typography } from '@mui/material'
import { toast } from 'sonner'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { CatalogSearchInput } from '@/components/ui/CatalogSearchInput'
import { useSymptoms, useSymptomSeverities } from '@/features/catalogs'
import { formatShortDate } from '@/utils/format-date'
import { isLettersOnly } from '@/utils/text-validation'
import {
  useConsultationSymptoms,
  useAddConsultationSymptom,
  useCaptureConsultationSymptom,
  useRemoveConsultationSymptom,
} from '../../hooks/useConsultationDetail'
import { useConsultationDiseases } from '../../hooks/useConsultationDiseases'
import { SymptomHistory } from './SymptomHistory'
import { SymptomRow } from './SymptomRow'
import type { CaptureSymptomInput } from '../../types'

interface SymptomsSectionProps {
  index: number
  consultationId: number
  consultationDate: string
  readOnly: boolean
}

export function SymptomsSection({
  index,
  consultationId,
  consultationDate,
  readOnly,
}: SymptomsSectionProps) {
  const { data: symptoms = [] } = useConsultationSymptoms(consultationId)
  const { data: severities = [] } = useSymptomSeverities()
  const { data: diseases = [] } = useConsultationDiseases(consultationId)
  const { data: catalog = [] } = useSymptoms()

  const addMutation = useAddConsultationSymptom(consultationId)
  const captureMutation = useCaptureConsultationSymptom(consultationId)
  const removeMutation = useRemoveConsultationSymptom(consultationId)

  const currentNames = new Set(
    symptoms.map((symptom) => (symptom.name ?? '').toLowerCase()),
  )
  const availableOptions = catalog.filter(
    (option) => !currentNames.has(option.name.toLowerCase()),
  )

  function addSymptom(name: string, catalogId?: number) {
    const clean = name.trim()
    if (!clean) return
    if (!catalogId && !isLettersOnly(clean)) {
      toast.error(
        'El síntoma solo puede contener letras, sin números ni caracteres especiales.',
      )
      return
    }
    if (currentNames.has(clean.toLowerCase())) return
    addMutation.mutate({
      symptomCatalogId: catalogId,
      name: catalogId ? undefined : clean,
      status: 'active',
    })
  }

  function capture(symptomId: number, input: CaptureSymptomInput) {
    captureMutation.mutate({ symptomId, input })
  }

  return (
    <CollapsibleSection
      title={`${index}. Síntomas`}
      headerMeta={
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {symptoms.length} en seguimiento
        </Typography>
      }
      defaultExpanded
    >
      <SymptomHistory consultationId={consultationId} />

      <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'primary.main', mb: 1 }}>
        CAPTURA DE ESTA CONSULTA · {formatShortDate(consultationDate)}
      </Typography>

      <Stack spacing={1.25}>
        {symptoms.map((symptom) => (
          <SymptomRow
            key={symptom.symptomCatalogId}
            symptom={symptom}
            severities={severities}
            diseases={diseases}
            readOnly={readOnly}
            onCapture={(input) => capture(symptom.id, input)}
            onRemove={() => removeMutation.mutate(symptom.id)}
          />
        ))}
      </Stack>

      {!readOnly && (
        <CatalogSearchInput
          sx={{ mt: 2 }}
          options={availableOptions.map((s) => ({ id: s.id, name: s.name }))}
          placeholder="Buscar síntoma…"
          onAdd={(name, id) => addSymptom(name, id)}
          manualLabel="El síntoma no está en el catálogo · escribir manualmente"
        />
      )}

      <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
        Los síntomas no resueltos de la consulta anterior se traen automáticamente para revisar su
        severidad y estado. Un síntoma marcado como "Resuelto" no aparece en la próxima consulta pero
        queda en el histórico.
      </Typography>
    </CollapsibleSection>
  )
}
