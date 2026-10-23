import { Stack, TextField, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from '@/utils/toast'
import { AppButton } from '@/components/AppButton'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { SearchableMultiSelect } from '@/components/SearchableMultiSelect'
import { formatShortDate } from '@/utils/format-date'
import { useAddParaclinicalResult } from '../hooks/useAddParaclinicalResult'
import { useProfileResultsDraft } from '../hooks/useProfileResultsDraft'
import { formatStudyValue } from '../utils/single-study-result'
import type { CreateParaclinicalResultInput } from '../types'
import { CatalogStudiesSelect } from './CatalogStudiesSelect'
import { ProfileResultsBlock } from './ProfileResultsBlock'

type ProfileResultsCaptureProps = {
  patientId: number
  /** Consulta en curso: lo capturado queda como borrador hasta finalizarla. */
  consultationId?: number
  onAdded?: (input: CreateParaclinicalResultInput) => void
}

// Captura de varios estudios a la vez: perfiles de laboratorio (p. ej. Perfil
// lipídico) y estudios sueltos del catálogo despliegan sus bloques y se guardan
// todos juntos como un resultado de la misma fecha.
export function ProfileResultsCapture({ patientId, consultationId, onAdded }: ProfileResultsCaptureProps) {
  const draft = useProfileResultsDraft(patientId)
  const { add, isAdding, pending, confirmReplace, cancelReplace } = useAddParaclinicalResult(
    patientId,
    (input) => {
      draft.reset()
      onAdded?.(input)
    },
    consultationId,
  )

  function submit() {
    const input = draft.buildInput()
    if (!input) {
      toast.error('Captura al menos un resultado de los estudios elegidos.')
      return
    }
    add(input)
  }

  return (
    <Stack spacing={1.5} sx={{ mt: 2.5 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
        <Stack sx={{ flex: 1 }}>
          <SearchableMultiSelect
            label="Perfiles de laboratorio"
            placeholder="Elige uno o más perfiles…"
            options={draft.profiles.map((profile) => ({
              id: profile.id,
              label: profile.name,
              sublabel: `${profile.items.length} estudios`,
            }))}
            value={draft.profileIds}
            onChange={draft.selectProfiles}
          />
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <SearchableMultiSelect
            label="Categorías de laboratorio"
            placeholder="Elige una o más categorías…"
            options={draft.labCategories.map((category) => ({ id: category.id, label: category.name }))}
            value={draft.categoryIds}
            onChange={draft.selectCategories}
          />
        </Stack>
      </Stack>
      <CatalogStudiesSelect value={draft.studyIds} onChange={draft.setStudyIds} />

      {draft.blocks.map((block) => (
        <ProfileResultsBlock
          key={block.key}
          block={block}
          entryOf={draft.entryOf}
          onChange={draft.setEntry}
          onAddStudy={(studyId) => draft.addStudy(block.key, studyId)}
          onRemoveStudy={(studyId) => draft.removeStudy(block.key, studyId)}
          onRemoveBlock={() => draft.removeBlock(block.key)}
        />
      ))}

      {draft.blocks.length > 0 && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
          <TextField
            size="small"
            type="date"
            label="Fecha del resultado"
            value={draft.date}
            onChange={(event) => draft.setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 180 }}
          />
          <Typography sx={{ fontSize: '12px', color: 'text.secondary', flex: 1 }}>
            {draft.filledCount} resultado{draft.filledCount === 1 ? '' : 's'} capturado
            {draft.filledCount === 1 ? '' : 's'}
          </Typography>
          <AppButton
            variant="contained"
            loading={isAdding}
            startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
            onClick={submit}
          >
            Guardar resultados
          </AppButton>
        </Stack>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Hay estudios ya registrados en esa fecha"
        description={
          pending
            ? `${pending.existing.value.paraclinicalName ?? 'Un estudio'} ya tiene un resultado del ${formatShortDate(pending.existing.resultDate)} (${formatStudyValue(pending.existing.value)}). ¿Reemplazar los repetidos por los nuevos?`
            : ''
        }
        confirmLabel="Reemplazar"
        color="primary"
        isConfirming={isAdding}
        onConfirm={confirmReplace}
        onClose={cancelReplace}
      />
    </Stack>
  )
}
