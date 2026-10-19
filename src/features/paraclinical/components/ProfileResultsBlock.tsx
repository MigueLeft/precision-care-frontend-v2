import { TableBody, TableHead, TableRow, TextField } from '@mui/material'
import { DataTable, DataCell, HeadCell } from '@/components/ui/DataTable'
import { SectionCard } from '@/components/ui/SectionCard'
import type { ParaclinicalCatalog } from '@/features/catalogs'
import type { ProfileBlock, StudyEntry } from '../hooks/useProfileResultsDraft'

type ProfileResultsBlockProps = {
  block: ProfileBlock
  entryOf: (study: ParaclinicalCatalog) => StudyEntry
  onChange: (study: ParaclinicalCatalog, patch: Partial<StudyEntry>) => void
}

function referenceOf(study: ParaclinicalCatalog): string {
  const { referenceMin, referenceMax } = study
  if (referenceMin && referenceMax) return `${referenceMin}–${referenceMax}`
  if (referenceMax) return `<${referenceMax}`
  if (referenceMin) return `>${referenceMin}`
  return '—'
}

// Bloque de un perfil (o de los estudios sueltos) para capturar los resultados.
export function ProfileResultsBlock({ block, entryOf, onChange }: ProfileResultsBlockProps) {
  return (
    <SectionCard title={`${block.title} · ${block.studies.length} estudios`} disableBodyPadding>
      <DataTable minWidth={560}>
        <TableHead>
          <TableRow>
            {['Estudio', 'Resultado', 'Unidad', 'Referencia'].map((h) => (
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
              </TableRow>
            )
          })}
        </TableBody>
      </DataTable>
    </SectionCard>
  )
}
