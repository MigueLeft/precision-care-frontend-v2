import { createContext, useContext, useState } from 'react'
import type { WorkspaceSectionId } from './workspace-sections'

// Registro de la lista central que se está editando en el panel de captura.
export type EditingRecord = { kind: 'symptom' | 'disease' | 'antecedent' | 'allergy'; id: number }

// Qué muestra el panel derecho cuando hay captura e ingresable fijado a la vez.
export type RightView = 'capture' | 'pinned'

export interface EncounterWorkspace {
  section: WorkspaceSectionId
  centerView: 'section' | 'notes'
  editing: EditingRecord | null
  pinnedIntakeId: number | null
  rightView: RightView
  selectSection: (section: WorkspaceSectionId) => void
  toggleNotes: () => void
  startEdit: (record: EditingRecord) => void
  clearEdit: () => void
  pinIntake: (responseId: number) => void
  unpinIntake: () => void
  setRightView: (view: RightView) => void
}

// Estado de navegación de la consulta (índice, panel central y panel derecho).
export function useEncounterWorkspaceState(initialSection: WorkspaceSectionId): EncounterWorkspace {
  const [section, setSection] = useState<WorkspaceSectionId>(initialSection)
  const [centerView, setCenterView] = useState<'section' | 'notes'>('section')
  const [editing, setEditing] = useState<EditingRecord | null>(null)
  const [pinnedIntakeId, setPinnedIntakeId] = useState<number | null>(null)
  const [rightView, setRightView] = useState<RightView>('capture')

  return {
    section,
    centerView,
    editing,
    pinnedIntakeId,
    rightView,
    selectSection: (next) => {
      setSection(next)
      setCenterView('section')
      setEditing(null)
      setRightView('capture')
    },
    toggleNotes: () => setCenterView((view) => (view === 'notes' ? 'section' : 'notes')),
    startEdit: (record) => {
      setEditing(record)
      setRightView('capture')
    },
    clearEdit: () => setEditing(null),
    pinIntake: (responseId) => {
      setPinnedIntakeId(responseId)
      setRightView('pinned')
    },
    unpinIntake: () => {
      setPinnedIntakeId(null)
      setRightView('capture')
    },
    setRightView,
  }
}

export const EncounterWorkspaceContext = createContext<EncounterWorkspace | null>(null)

export function useEncounterWorkspace(): EncounterWorkspace {
  const workspace = useContext(EncounterWorkspaceContext)
  if (!workspace) throw new Error('useEncounterWorkspace fuera de EncounterWorkspaceContext')
  return workspace
}
