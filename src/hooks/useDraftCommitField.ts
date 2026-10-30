import { useEffect } from 'react'
import { useConsultationDraftState } from './useConsultationDraftState'

// Campo de texto que se guarda al salir de él (onBlur), con respaldo local en la
// consulta en curso. Si al volver hay un texto respaldado distinto del guardado
// (no alcanzó a salir del campo), se envía al montar.
export function useDraftCommitField(
  field: string | null,
  value: string | null,
  onCommit: (value: string) => void,
  disabled: boolean,
) {
  const saved = value ?? ''
  const [draft, setDraft] = useConsultationDraftState(field, saved)

  useEffect(() => {
    if (!disabled && draft.trim() !== saved) onCommit(draft.trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [draft, setDraft] as const
}
