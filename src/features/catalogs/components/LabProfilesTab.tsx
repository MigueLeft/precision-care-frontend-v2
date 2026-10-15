import { useState } from 'react'
import { Box, FormControlLabel, InputAdornment, Stack, Switch, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { AppButton } from '@/components/AppButton'
import { useLabProfiles } from '../hooks/useLabProfiles'
import { useCreateLabProfile } from '../hooks/useCreateLabProfile'
import { useUpdateLabProfile } from '../hooks/useUpdateLabProfile'
import { useToggleLabProfileActive } from '../hooks/useToggleLabProfileActive'
import { useParaclinicals } from '../hooks/useParaclinicals'
import { useParaclinicalCategories } from '../hooks/useParaclinicalCategories'
import { labStudyOptions } from '../utils/lab-studies'
import type { LabProfileFormValues } from '../schemas/lab-profile-form.schema'
import { LabProfilesTable } from './LabProfilesTable'
import { LabProfileFormModal } from './LabProfileFormModal'

// Perfiles de laboratorio: grupos de estudios (p. ej. Perfil lipídico) que
// después se usan para generar órdenes.
export function LabProfilesTab() {
  const [q, setQ] = useState('')
  const [onlyActive, setOnlyActive] = useState(true)
  const [editing, setEditing] = useState<'new' | number | null>(null)

  const { data: profiles = [] } = useLabProfiles()
  const { data: paraclinicals = [] } = useParaclinicals()
  const { data: categories = [] } = useParaclinicalCategories()

  const target = typeof editing === 'number' ? profiles.find((p) => p.id === editing) : undefined
  const close = () => setEditing(null)
  const createMutation = useCreateLabProfile({ onSuccess: close })
  const updateMutation = useUpdateLabProfile(target?.id, { onSuccess: close })
  const toggleMutation = useToggleLabProfileActive()

  const needle = q.trim().toLowerCase()
  const filtered = profiles.filter(
    (p) =>
      (!onlyActive || p.active) &&
      (!needle ||
        p.name.toLowerCase().includes(needle) ||
        p.items.some((item) => item.name.toLowerCase().includes(needle))),
  )

  const initialValues: LabProfileFormValues | undefined = target && {
    name: target.name,
    description: target.description ?? '',
    paraclinicalIds: target.items.map((item) => item.id),
  }

  function handleSubmit(values: LabProfileFormValues) {
    const payload = { ...values, description: values.description ?? '' }
    if (target) updateMutation.mutate(payload)
    else createMutation.mutate(payload)
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {filtered.length} perfiles de laboratorio
      </Typography>
      <Stack direction="row" spacing={2} useFlexGap sx={{ mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar perfil o estudio…"
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
        <AppButton
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setEditing('new')}
        >
          Nuevo perfil
        </AppButton>
      </Stack>

      <LabProfilesTable
        profiles={filtered}
        onEdit={setEditing}
        onToggleActive={(id) => toggleMutation.mutate(id)}
      />

      <LabProfileFormModal
        open={editing !== null}
        mode={target ? 'edit' : 'create'}
        initialValues={initialValues}
        studyOptions={labStudyOptions(paraclinicals, categories, initialValues?.paraclinicalIds)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={handleSubmit}
        onClose={close}
      />
    </Box>
  )
}
