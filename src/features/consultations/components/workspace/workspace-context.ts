import { createContext, useContext, useState } from 'react'
import { useCaptureDraftState } from '@/hooks/useCaptureDraftState'
import type { WorkspaceSectionId } from './workspace-sections'

// Registro de la lista central que se está editando en el panel de captura.
export type EditingRecord = {
  kind: 'symptom' | 'disease' | 'antecedent' | 'allergy' | 'medication'
  id: number
}

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
// El registro en edición se recuerda por sección (y en localStorage): al volver
// a la sección sigue abierto en el panel de captura.
export function useEncounterWorkspaceState(initialSection: WorkspaceSectionId): EncounterWorkspace {
  const [section, setSection] = useState<WorkspaceSectionId>(initialSection)
  const [centerView, setCenterView] = useState<'section' | 'notes'>('section')
  const [editingBySection, setEditingBySection] = useCaptureDraftState<Partial<Record<WorkspaceSectionId, EditingRecord>>>(
    'workspace.editing',
    {},
  )
  const [pinnedIntakeId, setPinnedIntakeId] = useState<number | null>(null)
  const [rightView, setRightView] = useState<RightView>('capture')

  const setEditing = (record: EditingRecord | null) =>
    setEditingBySection((prev) => {
      const next = { ...prev }
      if (record) next[section] = record
      else delete next[section]
      return next
    })

  return {
    section,
    centerView,
    editing: editingBySection[section] ?? null,
    pinnedIntakeId,
    rightView,
    selectSection: (next) => {
      setSection(next)
      setCenterView('section')
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
