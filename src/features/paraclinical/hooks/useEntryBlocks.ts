import {
  labSubcategories,
  useLabProfiles,
  useParaclinicalCategories,
  useParaclinicals,
} from '@/features/catalogs'
import type { ParaclinicalCatalog } from '@/features/catalogs'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

// Bloque de captura: un perfil, una categoría de laboratorio o los estudios
// sueltos. `addable` = estudios que se pueden sumar al bloque.
export interface EntryBlock {
  key: string
  title: string
  studies: ParaclinicalCatalog[]
  addable: ParaclinicalCatalog[]
}

// Cambios hechos a mano sobre los estudios iniciales de un bloque.
interface BlockEdit {
  removed: number[]
  added: number[]
}

const LOOSE_KEY = 'studies'
const NO_EDIT: BlockEdit = { removed: [], added: [] }

// Perfiles y categorías solo son un atajo para cargar estudios: cada bloque
// arranca con los del perfil (o los marcados "por defecto" de la categoría) y
// se le pueden quitar o agregar estudios sin tocar el catálogo.
export function useEntryBlocks() {
  const { data: profiles = [] } = useLabProfiles()
  const { data: catalog = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()
  const [profileIds, setProfileIds] = useConsultationDraftState<number[]>('labEntry.profileIds', [])
  const [categoryIds, setCategoryIds] = useConsultationDraftState<number[]>('labEntry.categoryIds', [])
  const [studyIds, setStudyIds] = useConsultationDraftState<number[]>('labEntry.studyIds', [])
  const [edits, setEdits] = useConsultationDraftState<Record<string, BlockEdit>>('labEntry.edits', {})

  const studyById = new Map(catalog.map((study) => [study.id, study]))
  const activeLab = catalog.filter((study) => study.active)
  const labCategories = labSubcategories(categories)
    .map((category) => ({
      ...category,
      studies: activeLab.filter((study) => study.categoryId === category.id),
    }))
    .filter((category) => category.studies.length > 0)
  const labIds = new Set(labCategories.flatMap((c) => c.studies.map((s) => s.id)))

  const sources = [
    ...profileIds.flatMap((id) => {
      const profile = profiles.find((item) => item.id === id)
      if (!profile) return []
      const base = profile.items.flatMap((item) => studyById.get(item.id) ?? [])
      const pool = activeLab.filter((study) => labIds.has(study.id))
      return [{ key: `profile-${id}`, title: profile.name, base, pool }]
    }),
    ...categoryIds.flatMap((id) => {
      const category = labCategories.find((item) => item.id === id)
      if (!category) return []
      const base = category.studies.filter((study) => study.showByDefault)
      return [{ key: `category-${id}`, title: category.name, base, pool: category.studies }]
    }),
  ]

  const blocks: EntryBlock[] = sources.map(({ key, title, base, pool }) => {
    const edit = edits[key] ?? NO_EDIT
    const added = edit.added.flatMap((id) => studyById.get(id) ?? [])
    const studies = [...base.filter((study) => !edit.removed.includes(study.id)), ...added]
    const addable = pool.filter((study) => !studies.some((item) => item.id === study.id))
    return { key, title, studies, addable }
  })
  const looseStudies = studyIds.flatMap((id) => studyById.get(id) ?? [])
  if (looseStudies.length > 0) {
    blocks.push({ key: LOOSE_KEY, title: 'Estudios elegidos', studies: looseStudies, addable: [] })
  }

  function editBlock(key: string, update: (edit: BlockEdit) => BlockEdit) {
    setEdits((prev) => ({ ...prev, [key]: update(prev[key] ?? NO_EDIT) }))
  }

  function removeStudy(key: string, studyId: number) {
    if (key === LOOSE_KEY) {
      setStudyIds((prev) => prev.filter((id) => id !== studyId))
      return
    }
    editBlock(key, (edit) => ({
      removed: [...edit.removed, studyId],
      added: edit.added.filter((id) => id !== studyId),
    }))
  }

  function addStudy(key: string, studyId: number) {
    editBlock(key, (edit) => ({
      removed: edit.removed.filter((id) => id !== studyId),
      added: edit.removed.includes(studyId) ? edit.added : [...edit.added, studyId],
    }))
  }

  // Al quitar un perfil o categoría se descartan sus cambios a mano.
  function dropEdits(prefix: string, keptIds: number[]) {
    setEdits((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([key]) => !key.startsWith(prefix) || keptIds.includes(Number(key.slice(prefix.length))),
        ),
      ),
    )
  }

  function selectProfiles(ids: number[]) {
    setProfileIds(ids)
    dropEdits('profile-', ids)
  }

  function selectCategories(ids: number[]) {
    setCategoryIds(ids)
    dropEdits('category-', ids)
  }

  function removeBlock(key: string) {
    if (key === LOOSE_KEY) setStudyIds([])
    else if (key.startsWith('profile-')) selectProfiles(profileIds.filter((id) => `profile-${id}` !== key))
    else selectCategories(categoryIds.filter((id) => `category-${id}` !== key))
  }

  function reset() {
    setProfileIds([])
    setCategoryIds([])
    setStudyIds([])
    setEdits({})
  }

  return {
    profiles: profiles.filter((profile) => profile.active),
    labCategories,
    profileIds,
    selectProfiles,
    categoryIds,
    selectCategories,
    studyIds,
    setStudyIds,
    blocks,
    removeStudy,
    addStudy,
    removeBlock,
    reset,
  }
}
