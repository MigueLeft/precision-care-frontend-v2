import { Alert } from '@mui/material'
import { AppButton } from '@/components/AppButton'
import { useConsultationDrafts, useSaveLabOrder } from '@/features/deliverables'

type Study = { id: number; name: string }

type RiskReferralAlertProps = {
  consultationId: number | null
  threshold: number
  studies: Study[]
  readOnly: boolean
}

const message = (threshold: number, studies: Study[]) =>
  `FINDRISC ≥ ${threshold}: se sugiere solicitar ${studies.map((s) => s.name).join(' y ') || 'glucemia en ayunas o HbA1c'}.`

// FINDRISC ≥ umbral: sugiere agregar glucemia/HbA1c a la orden de laboratorio
// de la consulta con un clic (no se agregan solos). Fuera de una consulta, solo avisa.
export function RiskReferralAlert({ consultationId, threshold, studies, readOnly }: RiskReferralAlertProps) {
  if (consultationId === null || readOnly) {
    return (
      <Alert severity="warning" sx={{ '& .MuiAlert-message': { fontSize: '12.5px' } }}>
        {message(threshold, studies)}
      </Alert>
    )
  }
  return <ReferralWithOrder consultationId={consultationId} threshold={threshold} studies={studies} />
}

function ReferralWithOrder({ consultationId, threshold, studies }: { consultationId: number; threshold: number; studies: Study[] }) {
  const drafts = useConsultationDrafts(consultationId)
  const save = useSaveLabOrder(consultationId)
  const order = drafts.data?.labOrder
  const current = order?.items.map((item) => item.paraclinicalCatalogId) ?? []
  const pending = studies.filter((s) => !current.includes(s.id))

  function add() {
    if (!order) return
    save.mutate({
      items: [...current, ...pending.map((s) => s.id)].map((paraclinicalCatalogId) => ({ paraclinicalCatalogId })),
      title: order.title ?? undefined,
      indications: order.indications ?? undefined,
    })
  }

  return (
    <Alert
      severity="warning"
      sx={{ '& .MuiAlert-message': { fontSize: '12.5px' } }}
      action={
        order &&
        pending.length > 0 && (
          <AppButton size="small" color="inherit" loading={save.isPending} onClick={add}>
            Agregar a la orden
          </AppButton>
        )
      }
    >
      {message(threshold, studies)}
      {order && pending.length === 0 && ' Ya están en la orden de laboratorio.'}
    </Alert>
  )
}
