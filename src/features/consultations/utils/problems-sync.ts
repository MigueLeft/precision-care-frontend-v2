import { ANTECEDENT_TYPE_LABELS, type Antecedent } from '@/features/antecedents'
import { formatFreeDate } from '@/utils/format-date'
import { DISEASE_STATUS_LABELS } from './consultation-format'
import type { ConsultationDisease, ConsultationProblems } from '../types'

// Origen de un problema: un diagnóstico de la consulta o una cirugía/hospitalización
// del expediente (las que aterrizan del formulario de ingreso).
export interface ProblemSource {
  // Inicio con el que se reconoce la nota ("Hipertensión arterial (I10)").
  prefix: string
  // Solo los diagnósticos activos van a problemas actuales.
  active: boolean
  // Texto con el que se precarga la nota.
  note: string
  // Etiqueta de estado que la nota de un diagnóstico muestra tras el nombre.
  statusLabel?: string
}

const diseasePrefix = (disease: ConsultationDisease) =>
  `${disease.name ?? '—'}${disease.code ? ` (${disease.code})` : ''}`

// "Cirugía: Apendicectomía (05/2020)"
const eventPrefix = (antecedent: Antecedent) =>
  `${ANTECEDENT_TYPE_LABELS[antecedent.type]}: ${antecedent.name}${
    antecedent.eventDate ? ` (${formatFreeDate(antecedent.eventDate)})` : ''
  }`

const isSurgicalEvent = (antecedent: Antecedent) =>
  antecedent.type === 'surgery' || antecedent.type === 'hospitalization'

export function buildProblemSources(
  diseases: ConsultationDisease[],
  antecedents: Antecedent[],
): ProblemSource[] {
  return [
    // "Hipertensión arterial (I10) — Activa"
    ...diseases.map((disease) => ({
      prefix: diseasePrefix(disease),
      active: disease.status === 'active',
      note: `${diseasePrefix(disease)} — ${DISEASE_STATUS_LABELS[disease.status]}`,
      statusLabel: DISEASE_STATUS_LABELS[disease.status],
    })),
    // "Cirugía: Apendicectomía (05/2020) — Complicaciones: infección" (siempre en previos)
    ...antecedents.filter(isSurgicalEvent).map((antecedent) => {
      const complications =
        antecedent.surgeryDetail?.complications ??
        antecedent.hospitalizationDetail?.complications
      return {
        prefix: eventPrefix(antecedent),
        active: false,
        note: [eventPrefix(antecedent), complications ? `Complicaciones: ${complications}` : null]
          .filter(Boolean)
          .join(' — '),
      }
    }),
  ]
}

// La nota pertenece a la fuente si empieza con su prefijo seguido de fin, " (" o " —".
function matchesPrefix(note: string, prefix: string) {
  if (!note.startsWith(prefix)) return false
  const rest = note.slice(prefix.length)
  return rest === '' || rest.startsWith(' (') || rest.startsWith(' —')
}

function findSource(note: string, sources: ProblemSource[]) {
  return sources
    .filter((source) => matchesPrefix(note, source.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0]
}

const STATUS_LABELS = Object.values(DISEASE_STATUS_LABELS)

// Actualiza el estado que muestra la nota de un diagnóstico ("— Activa" → "— Controlada").
function withCurrentStatus(note: string, source: ProblemSource) {
  if (!source.statusLabel) return note
  const head = `${source.prefix} — `
  if (!note.startsWith(head)) return note
  const rest = note.slice(head.length)
  const old = STATUS_LABELS.find((label) => rest.startsWith(label))
  return old ? `${head}${source.statusLabel}${rest.slice(old.length)}` : note
}

// Precarga: cada diagnóstico activo en actuales; el resto (y los eventos) en previos.
export function seedProblems(sources: ProblemSource[]): ConsultationProblems {
  return {
    actuales: sources.filter((s) => s.active).map((s) => s.note),
    previos: sources.filter((s) => !s.active).map((s) => s.note),
  }
}

// Mueve cada nota a actuales/previos según el estado vigente de su origen.
// Las notas escritas a mano (sin fuente) se quedan donde están.
export function syncProblems(
  problems: ConsultationProblems,
  sources: ProblemSource[],
): ConsultationProblems {
  const next: ConsultationProblems = { actuales: [], previos: [] }
  const place = (note: string, fallback: keyof ConsultationProblems) => {
    const source = findSource(note, sources)
    if (!source) {
      next[fallback].push(note)
      return
    }
    next[source.active ? 'actuales' : 'previos'].push(withCurrentStatus(note, source))
  }
  problems.actuales.forEach((note) => place(note, 'actuales'))
  problems.previos.forEach((note) => place(note, 'previos'))
  return next
}

// Agrega la nota de cada origen nuevo (diagnóstico capturado o evento aterrizado
// durante la consulta) si todavía no tiene una.
export function appendSources(
  problems: ConsultationProblems,
  added: ProblemSource[],
): ConsultationProblems {
  const notes = [...problems.actuales, ...problems.previos]
  const missing = added.filter(
    (source) => !notes.some((note) => matchesPrefix(note, source.prefix)),
  )
  if (missing.length === 0) return problems
  const seeded = seedProblems(missing)
  return {
    actuales: [...problems.actuales, ...seeded.actuales],
    previos: [...problems.previos, ...seeded.previos],
  }
}

// Quita las notas de los diagnósticos o eventos que se eliminaron
// (`removedPrefixes`), aunque el médico les haya agregado detalles.
export function dropRemovedSources(
  problems: ConsultationProblems,
  removedPrefixes: string[],
): ConsultationProblems {
  if (removedPrefixes.length === 0) return problems
  const keep = (note: string) =>
    !removedPrefixes.some((prefix) => matchesPrefix(note, prefix))
  return {
    actuales: problems.actuales.filter(keep),
    previos: problems.previos.filter(keep),
  }
}

export function sameProblems(a: ConsultationProblems, b: ConsultationProblems) {
  return JSON.stringify(a) === JSON.stringify(b)
}
