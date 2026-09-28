import { useState } from 'react'
import { Chip, Stack, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { ANTECEDENT_TYPE_LABELS, useAntecedentsByPatient } from '@/features/antecedents'
import { useConsultationAllergies } from '../../hooks/useConsultationAllergies'
import { AntecedentsDialog } from './AntecedentsDialog'
import type { Consultation } from '../../types'

type SidebarAntecedentsProps = {
  consultation: Consultation
  readOnly: boolean
}

const isSevere = (severityName: string | null) => /grave|severa/i.test(severityName ?? '')

// Consulta subsecuente: los antecedentes y alergias del paciente como chips; el
// botón "Agregar" abre un modal con la captura completa.
export function SidebarAntecedents({ consultation, readOnly }: SidebarAntecedentsProps) {
  const [open, setOpen] = useState(false)
  const { data: antecedents = [] } = useAntecedentsByPatient(consultation.patientId)
  const { data: allergyData } = useConsultationAllergies(consultation.id)
  const allergies = allergyData?.allergies ?? []
  const isEmpty = antecedents.length === 0 && allergies.length === 0

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Antecedentes</Typography>
        {!readOnly && (
          <AppButton
            size="small"
            variant="text"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setOpen(true)}
          >
            Agregar
          </AppButton>
        )}
      </Stack>

      {isEmpty ? (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontStyle: 'italic' }}>
          Sin antecedentes registrados.
        </Typography>
      ) : (
        <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }}>
          {antecedents.map((antecedent) => (
            <Tooltip key={`a-${antecedent.id}`} title={ANTECEDENT_TYPE_LABELS[antecedent.type]}>
              <Chip size="small" variant="outlined" label={antecedent.name} />
            </Tooltip>
          ))}
          {allergies.map((allergy) => (
            <Tooltip key={`al-${allergy.id}`} title={`Alergia · ${allergy.severityName ?? ''}`}>
              <Chip
                size="small"
                color={isSevere(allergy.severityName) ? 'error' : 'warning'}
                variant="outlined"
                label={`Alergia: ${allergy.name ?? '—'}`}
              />
            </Tooltip>
          ))}
        </Stack>
      )}

      <AntecedentsDialog
        open={open}
        consultation={consultation}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
