import { Stack } from '@mui/material'
import {
  ADHERENCE_LABELS,
  DISEASE_STATUS_LABELS,
  RAM_LABELS,
  SYMPTOM_STATUS_LABELS,
} from '../../utils/consultation-format'
import { NoteBlock } from '../note/NoteBlock'
import { ChangeLine, Transition, type ChangeTone } from './ChangeLine'
import type {
  DiseaseEvolution,
  MedicationAdherence,
  MedicationChangeField,
  MedicationChangeKind,
  MedicationEvolution,
  MedicationRamStatus,
  SymptomEvolution,
  SymptomSnapshot,
} from '../../types'

const MEDICATION_KIND: Record<MedicationChangeKind, { tag: string; tone: ChangeTone }> = {
  added: { tag: 'Nuevo', tone: 'success' },
  discontinued: { tag: 'Suspendido', tone: 'error' },
  resumed: { tag: 'Reanudado', tone: 'info' },
  modified: { tag: 'Modificado', tone: 'warning' },
}

const FIELD_LABELS: Record<MedicationChangeField, string> = {
  dose: 'Dosis',
  frequency: 'Frecuencia',
  adherence: 'Adherencia',
  ramStatus: 'RAM',
}

function fieldValue(field: MedicationChangeField, value: string | null): string {
  if (!value) return '—'
  if (field === 'adherence') return ADHERENCE_LABELS[value as MedicationAdherence] ?? value
  if (field === 'ramStatus') return RAM_LABELS[value as MedicationRamStatus] ?? value
  return value
}

const symptomLabel = (snapshot: SymptomSnapshot) =>
  [SYMPTOM_STATUS_LABELS[snapshot.status], snapshot.severityName].filter(Boolean).join(' · ')

export function MedicationChanges({ items }: { items: MedicationEvolution[] }) {
  if (items.length === 0) return null
  return (
    <NoteBlock title="TRATAMIENTO">
      <Stack spacing={0.75}>
        {items.map((item) => (
          <ChangeLine
            key={item.medicationId}
            {...MEDICATION_KIND[item.change]}
            title={item.name ?? 'Medicamento'}
            detail={
              item.change === 'discontinued' ? (
                `Motivo: ${item.reason ?? 'sin especificar'}`
              ) : item.fields.length > 0 ? (
                item.fields.map((change, index) => (
                  <span key={change.field}>
                    {index > 0 && ' · '}
                    {FIELD_LABELS[change.field]}{' '}
                    <Transition
                      before={fieldValue(change.field, change.before)}
                      after={fieldValue(change.field, change.after)}
                    />
                  </span>
                ))
              ) : undefined
            }
          />
        ))}
      </Stack>
    </NoteBlock>
  )
}

export function DiseaseChanges({ items }: { items: DiseaseEvolution[] }) {
  if (items.length === 0) return null
  return (
    <NoteBlock title="DIAGNÓSTICOS">
      <Stack spacing={0.75}>
        {items.map((item) => (
          <ChangeLine
            key={item.diseaseCatalogId}
            tag={item.before ? 'Cambio de estado' : 'Nuevo'}
            tone={item.before ? 'warning' : 'success'}
            title={`${item.name ?? '—'}${item.code ? ` (${item.code})` : ''}`}
            detail={
              item.before ? (
                <Transition
                  before={DISEASE_STATUS_LABELS[item.before]}
                  after={DISEASE_STATUS_LABELS[item.after]}
                />
              ) : (
                DISEASE_STATUS_LABELS[item.after]
              )
            }
          />
        ))}
      </Stack>
    </NoteBlock>
  )
}

export function SymptomChanges({ items }: { items: SymptomEvolution[] }) {
  if (items.length === 0) return null
  return (
    <NoteBlock title="SÍNTOMAS">
      <Stack spacing={0.75}>
        {items.map((item) => (
          <ChangeLine
            key={item.symptomCatalogId}
            tag={item.before ? 'Cambio' : 'Nuevo'}
            tone={item.before ? 'warning' : 'success'}
            title={item.name ?? '—'}
            detail={
              item.before ? (
                <Transition before={symptomLabel(item.before)} after={symptomLabel(item.after)} />
              ) : (
                symptomLabel(item.after)
              )
            }
          />
        ))}
      </Stack>
    </NoteBlock>
  )
}
