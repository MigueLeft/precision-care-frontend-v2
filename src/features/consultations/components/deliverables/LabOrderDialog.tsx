import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
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
import { DeliverableDialogActions } from './DeliverableDialogActions'
import { LabProfileChips } from './LabProfileChips'
import { useLabOrderSelection } from './useLabOrderSelection'

type LabOrderDialogProps = {
  consultationId: number
  readOnly: boolean
  open: boolean
  onClose: () => void
}

type ContentProps = Omit<LabOrderDialogProps, 'open'> & {
  profiles: LabProfile[]
  initialIds: number[]
  initialTitle: string
  initialIndications: string
}

// Se monta al abrir: nace con el borrador guardado de la consulta.
function LabOrderContent({
  consultationId,
  readOnly,
  onClose,
  profiles,
  initialIds,
  initialTitle,
  initialIndications,
}: ContentProps) {
  const { ids, setIds, selected, toggleProfile, title, typeTitle } =
    useLabOrderSelection(profiles, initialIds, initialTitle)
  const [indications, setIndications] = useState(initialIndications)
  const { data: paraclinicals = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()
  const save = useSaveLabOrder(consultationId)
  const print = usePrintConsultationDeliverable(consultationId)

  // Lo último guardado: se compara para saber si hay cambios pendientes.
  const current = { ids: ids.join(), title, indications }
  const [saved, setSaved] = useState({ ids: initialIds.join(), title: initialTitle, indications: initialIndications })
  const dirty = JSON.stringify(current) !== JSON.stringify(saved)

  // Guardar reemplaza la orden de esta consulta (los errores se avisan con toast).
  async function handleSave() {
    try {
      await save.mutateAsync({
        items: ids.map((paraclinicalCatalogId) => ({ paraclinicalCatalogId })),
        title: title.trim() || undefined,
        indications: indications.trim() || undefined,
      })
      setSaved(current)
    } catch { /* toast */ }
  }

  async function handlePrint() {
    try {
      const { deliverable } = await print.mutateAsync('lab_order')
      printDeliverable('lab_order', deliverable.data as unknown as LabOrderData)
    } catch { /* toast */ }
  }

  return (
    <>
      <DialogTitle>Orden de laboratorio</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <LabProfileChips
            profiles={profiles}
            selected={selected}
            readOnly={readOnly}
            onToggle={toggleProfile}
          />
          <TextField
            label="Título de la orden"
            placeholder="Elige un perfil o escribe el nombre de la orden"
            helperText="Si lo borras, vuelve al nombre de los perfiles seleccionados."
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
      <DeliverableDialogActions
        readOnly={readOnly}
        dirty={dirty}
        hasSaved={saved.ids !== ''}
        // Vaciar una orden ya guardada también se permite (la quita).
        canSave={ids.length > 0 || saved.ids !== ''}
        saving={save.isPending}
        printing={print.isPending}
        onClose={onClose}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    </>
  )
}

export function LabOrderDialog({ open, ...props }: LabOrderDialogProps) {
  const { data: drafts } = useConsultationDrafts(props.consultationId)
  // Los perfiles se necesitan al montar para saber cuáles ya están en la orden.
  const { data: profiles } = useLabProfiles()
  const ready = !!drafts && !!profiles
  return (
    // Sin cierre por clic afuera: "Cerrar" guarda los cambios en espera.
    <Dialog open={open && ready} maxWidth="md" fullWidth>
      {ready && (
        <LabOrderContent
          {...props}
          profiles={profiles}
          initialIds={drafts.labOrder.items.map((item) => item.paraclinicalCatalogId)}
          initialTitle={drafts.labOrder.title ?? ''}
          initialIndications={drafts.labOrder.indications ?? ''}
        />
      )}
    </Dialog>
  )
}
