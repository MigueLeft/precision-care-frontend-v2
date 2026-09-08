import { useState } from 'react'
import { Box } from '@mui/material'
import { SearchableSelect } from '@/components/SearchableSelect'
import { useCountries } from '../hooks/useCountries'
import { useStates } from '../hooks/useStates'
import { useCreateState } from '../hooks/useCreateState'
import { useUpdateState } from '../hooks/useUpdateState'
import { useToggleStateActive } from '../hooks/useToggleStateActive'
import { DependentCatalogPanel } from './DependentCatalogPanel'

export function StateCatalogPanel() {
  const [countryId, setCountryId] = useState<number>()

  const { data: countries = [] } = useCountries()
  const { data: states = [] } = useStates(countryId)
  const createState = useCreateState()
  const updateState = useUpdateState()
  const toggleState = useToggleStateActive()

  return (
    <DependentCatalogPanel
      label="estados"
      singularLabel="estado"
      parentEmptyHint="Elige un país para ver y administrar sus estados."
      canManage={countryId != null}
      parentSelectors={
        <Box sx={{ minWidth: 260 }}>
          <SearchableSelect
            label="País"
            options={countries.map((country) => ({ id: country.id, label: country.name }))}
            value={countryId}
            onChange={setCountryId}
          />
        </Box>
      }
      items={states}
      isCreating={createState.isPending}
      isUpdating={updateState.isPending}
      onCreate={(name) => createState.mutate({ name, countryId: countryId! })}
      onUpdate={(id, name) => updateState.mutate({ id, name })}
      onToggleActive={(id) => toggleState.mutate(id)}
    />
  )
}
