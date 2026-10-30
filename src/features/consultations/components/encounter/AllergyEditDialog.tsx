import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { toast } from '@/utils/toast'
import { useAllergySeverities } from '@/features/catalogs'
import { useUpdateConsultationAllergy } from '../../hooks/useConsultationAllergies'
import type { ConsultationAllergy } from '../../types'
import { useConsultationDraftState } from '@/hooks/useConsultationDraftState'

type AllergyEditDialogProps = {
  consultationId: number
  // Alergia en edición; null = cerrado.
  allergy: ConsultationAllergy | null
  onClose: () => void
}

const CURRENT_YEAR = new Date().getFullYear()

// Se monta al abrir: nace con los valores de la alergia.
function AllergyEditContent({ consultationId, allergy, onClose }: AllergyEditDialogProps & { allergy: ConsultationAllergy }) {
  const { data: severities = [] } = useAllergySeverities()
  const update = useUpdateConsultationAllergy(consultationId, { onSuccess: onClose })
  const [severityId, setSeverityId] = useConsultationDraftState<number>(`allergyEdit:${allergy.id}.severityId`, allergy.severityId)
  const [onsetYear, setOnsetYear] = useConsultationDraftState(`allergyEdit:${allergy.id}.onsetYear`, allergy.onsetYear ? String(allergy.onsetYear) : '')
  const [reaction, setReaction] = useConsultationDraftState(`allergyEdit:${allergy.id}.reaction`, allergy.reaction ?? '')

  function submit() {
    const year = onsetYear.trim() ? Number(onsetYear) : null
    if (year !== null && (!Number.isInteger(year) || year < 1900 || year > CURRENT_YEAR)) {
      toast.error(`El año debe estar entre 1900 y ${CURRENT_YEAR}.`)
      return
    }
    update.mutate({
      allergyId: allergy.id,
      input: { severityId, onsetYear: year, reaction: reaction.trim() || null },
    })
  }

  return (
    <>
      <DialogTitle>Editar alergia</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: '14px' }}>
            <strong>{allergy.name ?? '—'}</strong>
            {allergy.typeName ? ` · ${allergy.typeName}` : ''}
          </Typography>
          <FormControl size="small">
            <InputLabel id="allergy-edit-severity">Severidad</InputLabel>
            <Select<number>
              labelId="allergy-edit-severity"
              label="Severidad"
              value={severityId}
              onChange={(event) => setSeverityId(Number(event.target.value))}
            >
              {severities
                .filter((severity) => severity.active || severity.id === allergy.severityId)
                .map((severity) => (
                  <MenuItem key={severity.id} value={severity.id}>
                    {severity.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            type="number"
            label="Año de inicio"
            value={onsetYear}
            onChange={(event) => setOnsetYear(event.target.value)}
            sx={{ width: 160 }}
          />
          <TextField
            size="small"
            label="Reacción observada"
            multiline
            minRows={2}
            value={reaction}
            onChange={(event) => setReaction(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 300 } }}
          />
          <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
            Para cambiar el agente, quita la alergia y agrégala de nuevo.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={update.isPending}>
          Cancelar
        </Button>
        <AppButton variant="contained" loading={update.isPending} onClick={submit}>
          Guardar cambios
        </AppButton>
      </DialogActions>
    </>
  )
}

export function AllergyEditDialog({ allergy, ...props }: AllergyEditDialogProps) {
  return (
    <Dialog open={allergy !== null} onClose={props.onClose} maxWidth="xs" fullWidth>
      {allergy && <AllergyEditContent {...props} allergy={allergy} />}
    </Dialog>
  )
}
