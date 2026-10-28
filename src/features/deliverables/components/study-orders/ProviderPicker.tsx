import { useState } from 'react'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import {
  ReferralProviderFormModal,
  useReferralProviders,
  type ReferralProvider,
  type ReferralProviderPayload,
} from '@/features/catalogs'

// Destinatario elegido: del catálogo o uno nuevo (se agrega al catálogo al guardar).
export type ProviderChoice =
  | { kind: 'catalog'; id: number; name: string }
  | { kind: 'new'; values: ReferralProviderPayload }
  | null

type Option = ReferralProvider | { id: 'new'; name: string }

type ProviderPickerProps = {
  value: ProviderChoice
  onChange: (value: ProviderChoice) => void
  disabled: boolean
}

const NEW_OPTION: Option = { id: 'new', name: '+ Agregar centro o especialista…' }

// Buscador de centros y especialistas de referencia, con alta rápida.
export function ProviderPicker({ value, onChange, disabled }: ProviderPickerProps) {
  const { data: providers = [] } = useReferralProviders()
  const [creating, setCreating] = useState(false)

  const options: Option[] = [
    ...providers.filter((p) => p.active || (value?.kind === 'catalog' && value.id === p.id)),
    NEW_OPTION,
  ]
  const selected: Option | null =
    value?.kind === 'catalog'
      ? (providers.find((p) => p.id === value.id) ?? { id: value.id, name: value.name } as ReferralProvider)
      : value?.kind === 'new'
        ? { id: 'new', name: `${value.values.name} (nuevo)` }
        : null
  const details = value?.kind === 'catalog' ? providers.find((p) => p.id === value.id) : value?.values

  return (
    <Box>
      <Autocomplete
        options={options}
        value={selected}
        disabled={disabled}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        onChange={(_event, next) => {
          if (!next) onChange(null)
          else if (next.id === 'new') setCreating(true)
          else onChange({ kind: 'catalog', id: next.id, name: next.name })
        }}
        renderInput={(params) => (
          <TextField {...params} label="Dirigida a" placeholder="Centro o especialista de referencia (opcional)" />
        )}
      />
      {details && (details.address || details.phone) && (
        <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.5, ml: 1.5 }}>
          {[details.specialty, details.address, details.phone].filter(Boolean).join(' · ')}
        </Typography>
      )}
      <ReferralProviderFormModal
        open={creating}
        title="Nuevo centro de referencia"
        onClose={() => setCreating(false)}
        onSubmit={(values) => {
          onChange({
            kind: 'new',
            values: {
              name: values.name,
              specialty: values.specialty || undefined,
              address: values.address || undefined,
              phone: values.phone || undefined,
            },
          })
          setCreating(false)
        }}
      />
    </Box>
  )
}
