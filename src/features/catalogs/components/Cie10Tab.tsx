import { useState } from 'react'
import { Stack, Typography, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AppButton } from '@/components/AppButton'
import { useCie10 } from '../hooks/useCie10'
import { useCreateCie10 } from '../hooks/useCreateCie10'
import { useBodySystems } from '../hooks/useBodySystems'
import { Cie10Table } from './Cie10Table'
import { Cie10FormModal } from './Cie10FormModal'
import type { Cie10FormValues } from '../schemas/cie10-form.schema'

export function Cie10Tab() {
  const [q, setQ] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: cie10 = [] } = useCie10()
  const { data: bodySystems = [] } = useBodySystems()
  const bodySystemNameById = new Map(bodySystems.map((system) => [system.id, system.name]))
  const createMutation = useCreateCie10({ onSuccess: () => setIsFormOpen(false) })

  const filtered = q.trim()
    ? cie10.filter(
        (item) =>
          item.code.toLowerCase().includes(q.trim().toLowerCase()) ||
          item.description.toLowerCase().includes(q.trim().toLowerCase()),
      )
    : cie10

  function handleSubmit(values: Cie10FormValues) {
    createMutation.mutate({
      code: values.code,
      description: values.description,
      chapter: values.chapter || undefined,
      bodySystemId: values.bodySystemId,
    })
  }

  return (
    <div>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar por código o descripción"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          sx={{ minWidth: 280 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {filtered.length} códigos CIE-10
        </Typography>
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setIsFormOpen(true)}
        >
          Agregar
        </AppButton>
      </Stack>

      <Cie10Table items={filtered} bodySystemNameById={bodySystemNameById} />

      <Cie10FormModal
        open={isFormOpen}
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  )
}
