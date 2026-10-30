import { Box } from '@mui/material'
import { DraftConsultationContext } from '@/hooks/draft-consultation'
import { usePatient } from '@/features/patients'
import { useMe, hasPermission } from '@/features/identity'
import { useConsultation } from '../../hooks/useConsultationDetail'
import { useConsultationLocalBackup } from '../../hooks/useConsultationLocalBackup'
import { ConsultationWorkspace } from '../workspace/ConsultationWorkspace'
import { EncounterHeader } from './EncounterHeader'
import { EncounterPatientBar } from './EncounterPatientBar'

interface ConsultationEncounterPageProps {
  consultationId: number
}

export function ConsultationEncounterPage({ consultationId }: ConsultationEncounterPageProps) {
  const { data: consultation } = useConsultation(consultationId)
  const { data: patient } = usePatient(consultation?.patientId)
  const { data: me } = useMe()

  // Otro especialista (con permiso para ver todas) solo puede consultarla.
  const isOtherSpecialist =
    me?.specialistId != null && me.specialistId !== consultation?.specialistId
  // Sin permiso para editar consultas se abre en solo lectura.
  const canEdit = hasPermission(me, 'consultas:update')
  const readOnly =
    !consultation || !me || consultation.status === 'completed' || isOtherSpecialist || !canEdit
  // Recupera el respaldo de lo capturado antes de mostrar los apartados.
  const draftReady = useConsultationLocalBackup(consultationId, readOnly)

  if (!consultation || !draftReady) return null

  return (
    // Lo capturado aquí es borrador de la consulta hasta finalizarla.
    <DraftConsultationContext.Provider value={consultation.id}>
      <Box sx={{ mx: -4, mt: -4 }}>
        <EncounterHeader consultation={consultation} readOnly={readOnly} />
        {patient && <EncounterPatientBar patient={patient} />}
        <ConsultationWorkspace consultation={consultation} readOnly={readOnly} />
      </Box>
    </DraftConsultationContext.Provider>
  )
}
