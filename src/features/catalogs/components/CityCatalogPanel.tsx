import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { SearchableSelect } from '@/components/SearchableSelect'
import { useCountries } from '../hooks/useCountries'
import { useStates } from '../hooks/useStates'
import { useCities } from '../hooks/useCities'
import { useCreateCity } from '../hooks/useCreateCity'
import { useUpdateCity } from '../hooks/useUpdateCity'
import { useToggleCityActive } from '../hooks/useToggleCityActive'
import { DependentCatalogPanel } from './DependentCatalogPanel'

export function CityCatalogPanel() {
  const [countryId, setCountryId] = useState<number>()
  const [stateId, setStateId] = useState<number>()

  const { data: countries = [] } = useCountries()
  const { data: states = [] } = useStates(countryId)
  const { data: cities = [] } = useCities(stateId)
  const createCity = useCreateCity()
  const updateCity = useUpdateCity()
  const toggleCity = useToggleCityActive()

  return (
    <DependentCatalogPanel
      label="ciudades"
      singularLabel="ciudad"
      parentEmptyHint="Elige un país y un estado para ver y administrar sus ciudades."
      canManage={stateId != null}
      parentSelectors={
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: 220 }}>
            <SearchableSelect
              label="País"
              options={countries.map((country) => ({ id: country.id, label: country.name }))}
              value={countryId}
              onChange={(id) => {
                setCountryId(id)
                setStateId(undefined)
              }}
            />
          </Box>
          <Box sx={{ minWidth: 220 }}>
            <SearchableSelect
              label="Estado"
              options={states.map((state) => ({ id: state.id, label: state.name }))}
              value={stateId}
              onChange={setStateId}
              disabled={countryId == null}
            />
          </Box>
        </Stack>
      }
      items={cities}
      isCreating={createCity.isPending}
      isUpdating={updateCity.isPending}
      onCreate={(name) => createCity.mutate({ name, stateId: stateId! })}
      onUpdate={(id, name) => updateCity.mutate({ id, name })}
      onToggleActive={(id) => toggleCity.mutate(id)}
    />
  )
}
