import { useState } from 'react'
import { Box, FormControlLabel, InputAdornment, Stack, Switch, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { AppButton } from '@/components/AppButton'
import { useReferralProviders } from '../hooks/useReferralProviders'
import { useCreateReferralProvider } from '../hooks/useCreateReferralProvider'
import { useUpdateReferralProvider } from '../hooks/useUpdateReferralProvider'
import { useToggleReferralProviderActive } from '../hooks/useToggleReferralProviderActive'
import type { ReferralProviderFormValues } from '../schemas/referral-provider-form.schema'
import { ReferralProvidersTable } from './ReferralProvidersTable'
import { ReferralProviderFormModal } from './ReferralProviderFormModal'

// Centros y especialistas de referencia: a quién se dirigen las órdenes de estudio.
export function ReferralProvidersTab() {
  const [q, setQ] = useState('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [editing, setEditing] = useState<'new' | number | null>(null)

  const { data: providers = [] } = useReferralProviders()
  const target = typeof editing === 'number' ? providers.find((p) => p.id === editing) : undefined
  const close = () => setEditing(null)
  const createMutation = useCreateReferralProvider({ onSuccess: close })
  const updateMutation = useUpdateReferralProvider(target?.id, { onSuccess: close })
  const toggleMutation = useToggleReferralProviderActive()

  const needle = q.trim().toLowerCase()
  const filtered = providers.filter(
    (p) =>
      (!onlyActive || p.active) &&
      (!needle || [p.name, p.specialty, p.address].some((text) => text?.toLowerCase().includes(needle))),
  )

  function handleSubmit(values: ReferralProviderFormValues) {
    const payload = {
      name: values.name,
      specialty: values.specialty ?? '',
      address: values.address ?? '',
      phone: values.phone ?? '',
    }
    if (target) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} centros y especialistas de referencia
      </Typography>
      <Stack direction="row" spacing={2} useFlexGap sx={{ mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por nombre, especialidad o dirección…"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          sx={{ minWidth: 260, flex: 1, maxWidth: 400 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControlLabel
          control={<Switch checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />}
          label="Solo activos"
        />
        <Box sx={{ flex: 1 }} />
        <AppButton variant="contained" startIcon={<AddIcon sx={{ fontSize: 18 }} />} onClick={() => setEditing('new')}>
          Nuevo centro
        </AppButton>
      </Stack>

      <ReferralProvidersTable
        providers={filtered}
        onEdit={setEditing}
        onToggleActive={(id) => toggleMutation.mutate(id)}
      />

      <ReferralProviderFormModal
        open={editing !== null}
        title={target ? 'Editar centro de referencia' : 'Nuevo centro de referencia'}
        initialValues={
          target && {
            name: target.name,
            specialty: target.specialty ?? '',
            address: target.address ?? '',
            phone: target.phone ?? '',
          }
        }
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={close}
      />
    </Box>
  )
}
