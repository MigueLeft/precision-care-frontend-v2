import { IconButton, Stack, TableBody, TableHead, TableRow, TextField, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { SectionCard } from '@/components/ui/SectionCard'
import type { ParaclinicalCatalog } from '@/features/catalogs'
import type { EntryBlock } from '../hooks/useEntryBlocks'
import type { StudyEntry } from '../hooks/useProfileResultsDraft'
import { AddStudyToBlock } from './AddStudyToBlock'

type ProfileResultsBlockProps = {
  block: EntryBlock
  entryOf: (study: ParaclinicalCatalog) => StudyEntry
  onChange: (study: ParaclinicalCatalog, patch: Partial<StudyEntry>) => void
  onAddStudy: (studyId: number) => void
  onRemoveStudy: (studyId: number) => void
  onRemoveBlock: () => void
}

function referenceOf(study: ParaclinicalCatalog): string {
  const { referenceMin, referenceMax } = study
  if (referenceMin && referenceMax) return `${referenceMin}–${referenceMax}`
  if (referenceMax) return `<${referenceMax}`
  if (referenceMin) return `>${referenceMin}`
  return '—'
}

// Bloque de un perfil, una categoría o los estudios sueltos para capturar los
// resultados; se pueden quitar estudios o agregar otros del mismo grupo.
export function ProfileResultsBlock({
  block,
  entryOf,
  onChange,
  onAddStudy,
  onRemoveStudy,
  onRemoveBlock,
}: ProfileResultsBlockProps) {
  return (
    <SectionCard
      title={`${block.title} · ${block.studies.length} estudios`}
      action={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {block.addable.length > 0 && <AddStudyToBlock options={block.addable} onAdd={onAddStudy} />}
          <Tooltip title="Quitar bloque">
            <IconButton size="small" onClick={onRemoveBlock} aria-label={`Quitar ${block.title}`}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      }
      disableBodyPadding
    >
      <DataTable minWidth={600}>
        <TableHead>
          <TableRow>
            {['Estudio', 'Resultado', 'Unidad', 'Referencia', ''].map((h) => (
              <HeadCell key={h}>{h}</HeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {block.studies.map((study) => {
            const entry = entryOf(study)
            return (
              <TableRow key={study.id}>
                <DataCell>{study.name}</DataCell>
                <DataCell sx={{ width: 140 }}>
                  <TextField
                    size="small"
                    placeholder="Resultado"
                    value={entry.result}
                    onChange={(event) => onChange(study, { result: event.target.value })}
                    fullWidth
                  />
                </DataCell>
                <DataCell sx={{ width: 120 }}>
                  <TextField
                    size="small"
                    placeholder="Unidad"
                    value={entry.unit}
                    onChange={(event) => onChange(study, { unit: event.target.value })}
                    fullWidth
                  />
                </DataCell>
                <DataCell sx={{ color: 'text.secondary' }}>{referenceOf(study)}</DataCell>
                <DataCell sx={{ width: 48 }}>
                  <Tooltip title="Quitar estudio">
                    <IconButton
                      size="small"
                      onClick={() => onRemoveStudy(study.id)}
                      aria-label={`Quitar ${study.name}`}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </DataCell>
              </TableRow>
            )
          })}
        </TableBody>
      </DataTable>
    </SectionCard>
  )
}
