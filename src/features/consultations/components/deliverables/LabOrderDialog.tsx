import { useState } from 'react'
import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import { AppButton } from '@/components/AppButton'
import {
  LabStudiesPicker,
  labStudyOptions,
  useLabProfiles,
  useParaclinicalCategories,
  useParaclinicals,
} from '@/features/catalogs'
import {
  printDeliverable,
  useConsultationDrafts,
  usePrintConsultationDeliverable,
  useSaveLabOrder,
  type LabOrderData,
} from '@/features/deliverables'

type LabOrderDialogProps = {
  consultationId: number
  readOnly: boolean
  open: boolean
  onClose: () => void
}

type ContentProps = Omit<LabOrderDialogProps, 'open'> & {
  initialIds: number[]
  initialIndications: string
}

// Se monta al abrir: nace con el borrador guardado de la consulta.
function LabOrderContent({ consultationId, readOnly, onClose, initialIds, initialIndications }: ContentProps) {
  const [ids, setIds] = useState(initialIds)
  const [indications, setIndications] = useState(initialIndications)
  const { data: profiles = [] } = useLabProfiles()
  const { data: paraclinicals = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()
  const save = useSaveLabOrder(consultationId)
  const print = usePrintConsultationDeliverable(consultationId)

  const dirty = ids.join() !== initialIds.join() || indications !== initialIndications
  const payload = () => ({
    items: ids.map((paraclinicalCatalogId) => ({ paraclinicalCatalogId })),
    indications: indications.trim() || undefined,
  })

  // Al cerrar, los cambios quedan en espera dentro de la consulta.
  // (los errores ya se muestran con toast en cada mutación).
  async function close() {
    try {
      if (!readOnly && dirty) await save.mutateAsync(payload())
      onClose()
    } catch {
      /* toast de error */
    }
  }

  async function handlePrint() {
    try {
      if (!readOnly && dirty) await save.mutateAsync(payload())
      const { deliverable } = await print.mutateAsync('lab_order')
      printDeliverable('lab_order', deliverable.data as unknown as LabOrderData)
    } catch {
      /* toast de error */
    }
  }

  const addProfile = (profileIds: number[]) =>
    setIds((prev) => [...prev, ...profileIds.filter((id) => !prev.includes(id))])

  return (
    <>
      <DialogTitle>Orden de laboratorio</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {!readOnly && profiles.some((p) => p.active) && (
            <Stack spacing={0.75}>
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary' }}>
                Agregar un perfil completo
              </Typography>
              <Stack direction="row" useFlexGap spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                {profiles
                  .filter((profile) => profile.active)
                  .map((profile) => (
                    <Chip
                      key={profile.id}
                      label={`${profile.name} (${profile.items.length})`}
                      onClick={() => addProfile(profile.items.map((item) => item.id))}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
              </Stack>
            </Stack>
          )}
          <LabStudiesPicker
            options={labStudyOptions(paraclinicals, categories, ids)}
            value={ids}
            onChange={readOnly ? () => {} : setIds}
            helperText={`${ids.length} estudio(s) en la orden`}
          />
          <TextField
            label="Indicaciones generales"
            placeholder="Ayuno de 8 horas, suspender suplementos…"
            multiline
            minRows={2}
            value={indications}
            onChange={(event) => setIndications(event.target.value)}
            disabled={readOnly}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton variant="text" onClick={close} loading={save.isPending && !print.isPending}>
          Cerrar
        </AppButton>
        <AppButton
          variant="contained"
          startIcon={<PrintOutlinedIcon sx={{ fontSize: 18 }} />}
          disabled={ids.length === 0}
          loading={print.isPending}
          onClick={handlePrint}
        >
          Imprimir
        </AppButton>
      </DialogActions>
    </>
  )
}

export function LabOrderDialog({ open, ...props }: LabOrderDialogProps) {
  const { data: drafts } = useConsultationDrafts(props.consultationId)
  return (
    // Sin cierre por clic afuera: "Cerrar" guarda los cambios en espera.
    <Dialog open={open && !!drafts} maxWidth="md" fullWidth>
      {drafts && (
        <LabOrderContent
          {...props}
          initialIds={drafts.labOrder.items.map((item) => item.paraclinicalCatalogId)}
          initialIndications={drafts.labOrder.indications ?? ''}
        />
      )}
    </Dialog>
  )
}
