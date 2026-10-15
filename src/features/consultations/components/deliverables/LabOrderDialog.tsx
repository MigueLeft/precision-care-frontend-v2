import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import { AppButton } from '@/components/AppButton'
import {
  LabStudiesPicker,
  labStudyOptions,
  useLabProfiles,
  useParaclinicalCategories,
  useParaclinicals,
  type LabProfile,
} from '@/features/catalogs'
import {
  printDeliverable,
  useConsultationDrafts,
  usePrintConsultationDeliverable,
  useSaveLabOrder,
  type LabOrderData,
} from '@/features/deliverables'
import { LabProfileChips } from './LabProfileChips'
import { useLabOrderTitle } from './useLabOrderTitle'

type LabOrderDialogProps = {
  consultationId: number
  readOnly: boolean
  open: boolean
  onClose: () => void
}

type ContentProps = Omit<LabOrderDialogProps, 'open'> & {
  initialIds: number[]
  initialTitle: string
  initialIndications: string
}

// Se monta al abrir: nace con el borrador guardado de la consulta.
function LabOrderContent({
  consultationId,
  readOnly,
  onClose,
  initialIds,
  initialTitle,
  initialIndications,
}: ContentProps) {
  const [ids, setIds] = useState(initialIds)
  const { title, addProfileName, typeTitle } = useLabOrderTitle(initialTitle)
  const [indications, setIndications] = useState(initialIndications)
  const { data: profiles = [] } = useLabProfiles()
  const { data: paraclinicals = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()
  const save = useSaveLabOrder(consultationId)
  const print = usePrintConsultationDeliverable(consultationId)

  const dirty = ids.join() !== initialIds.join() || title !== initialTitle || indications !== initialIndications
  const payload = () => ({
    items: ids.map((paraclinicalCatalogId) => ({ paraclinicalCatalogId })),
    title: title.trim() || undefined,
    indications: indications.trim() || undefined,
  })

  // Al cerrar, los cambios quedan en espera (los errores se avisan con toast).
  async function close() {
    try {
      if (!readOnly && dirty) await save.mutateAsync(payload())
      onClose()
    } catch {
      /* toast */
    }
  }

  async function handlePrint() {
    try {
      if (!readOnly && dirty) await save.mutateAsync(payload())
      const { deliverable } = await print.mutateAsync('lab_order')
      printDeliverable('lab_order', deliverable.data as unknown as LabOrderData)
    } catch {
      /* toast */
    }
  }

  function addProfile(profile: LabProfile) {
    const profileIds = profile.items.map((item) => item.id)
    setIds((prev) => [...prev, ...profileIds.filter((id) => !prev.includes(id))])
    addProfileName(profile.name)
  }

  return (
    <>
      <DialogTitle>Orden de laboratorio</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {!readOnly && <LabProfileChips profiles={profiles} onAdd={addProfile} />}
          <TextField
            label="Título de la orden"
            placeholder="Elige un perfil o escribe el nombre de la orden"
            value={title}
            onChange={(event) => typeTitle(event.target.value)}
            disabled={readOnly}
            slotProps={{ htmlInput: { maxLength: 150 } }}
          />
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
          initialTitle={drafts.labOrder.title ?? ''}
          initialIndications={drafts.labOrder.indications ?? ''}
        />
      )}
    </Dialog>
  )
}
