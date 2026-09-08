import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useCivilStatuses } from '../hooks/useCivilStatuses'
import { useCreateCivilStatus } from '../hooks/useCreateCivilStatus'
import { useUpdateCivilStatus } from '../hooks/useUpdateCivilStatus'
import { useToggleCivilStatusActive } from '../hooks/useToggleCivilStatusActive'
import { useRaces } from '../hooks/useRaces'
import { useCreateRace } from '../hooks/useCreateRace'
import { useUpdateRace } from '../hooks/useUpdateRace'
import { useToggleRaceActive } from '../hooks/useToggleRaceActive'
import { useSocioeconomicLevels } from '../hooks/useSocioeconomicLevels'
import { useCreateSocioeconomicLevel } from '../hooks/useCreateSocioeconomicLevel'
import { useUpdateSocioeconomicLevel } from '../hooks/useUpdateSocioeconomicLevel'
import { useToggleSocioeconomicLevelActive } from '../hooks/useToggleSocioeconomicLevelActive'
import { useLanguages } from '../hooks/useLanguages'
import { useCreateLanguage } from '../hooks/useCreateLanguage'
import { useUpdateLanguage } from '../hooks/useUpdateLanguage'
import { useToggleLanguageActive } from '../hooks/useToggleLanguageActive'
import { useCountries } from '../hooks/useCountries'
import { useCreateCountry } from '../hooks/useCreateCountry'
import { useUpdateCountry } from '../hooks/useUpdateCountry'
import { SimpleCatalogList } from './SimpleCatalogList'
import { CountriesList } from './CountriesList'
import { StateCatalogPanel } from './StateCatalogPanel'
import { CityCatalogPanel } from './CityCatalogPanel'

// El catálogo de "País" es la única lista de países del sistema: se usa tanto
// para nacionalidad como para país de origen/residencia en Pacientes, evitando duplicar el catálogo.
const SUB_TABS = [
  'Estado civil',
  'Raza',
  'Nivel socioeconómico',
  'Idioma',
  'País / Nacionalidad',
  'Estado',
  'Ciudad',
] as const

export function DemographicListsTab() {
  const [subTab, setSubTab] = useState(0)

  const { data: civilStatuses = [] } = useCivilStatuses()
  const createCivilStatus = useCreateCivilStatus()
  const updateCivilStatus = useUpdateCivilStatus()
  const toggleCivilStatus = useToggleCivilStatusActive()

  const { data: races = [] } = useRaces()
  const createRace = useCreateRace()
  const updateRace = useUpdateRace()
  const toggleRace = useToggleRaceActive()

  const { data: socioeconomicLevels = [] } = useSocioeconomicLevels()
  const createSocioeconomicLevel = useCreateSocioeconomicLevel()
  const updateSocioeconomicLevel = useUpdateSocioeconomicLevel()
  const toggleSocioeconomicLevel = useToggleSocioeconomicLevelActive()

  const { data: languages = [] } = useLanguages()
  const createLanguage = useCreateLanguage()
  const updateLanguage = useUpdateLanguage()
  const toggleLanguage = useToggleLanguageActive()

  const { data: countries = [] } = useCountries()
  const createCountry = useCreateCountry()
  const updateCountry = useUpdateCountry()

  return (
    <Box>
      <Tabs
        value={subTab}
        onChange={(_, value) => setSubTab(value)}
        sx={{ mb: 3, minHeight: 36, '& .MuiTab-root': { minHeight: 36, fontSize: '13px' } }}
      >
        {SUB_TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {subTab === 0 && (
        <SimpleCatalogList
          label="Estados civiles"
          items={civilStatuses}
          isCreating={createCivilStatus.isPending}
          isUpdating={updateCivilStatus.isPending}
          onCreate={(values) => createCivilStatus.mutate(values.name)}
          onUpdate={(id, values) => updateCivilStatus.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleCivilStatus.mutate(id)}
        />
      )}
      {subTab === 1 && (
        <SimpleCatalogList
          label="Razas"
          items={races}
          isCreating={createRace.isPending}
          isUpdating={updateRace.isPending}
          onCreate={(values) => createRace.mutate(values.name)}
          onUpdate={(id, values) => updateRace.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleRace.mutate(id)}
        />
      )}
      {subTab === 2 && (
        <SimpleCatalogList
          label="Niveles socioeconómicos"
          items={socioeconomicLevels}
          isCreating={createSocioeconomicLevel.isPending}
          isUpdating={updateSocioeconomicLevel.isPending}
          onCreate={(values) => createSocioeconomicLevel.mutate(values.name)}
          onUpdate={(id, values) => updateSocioeconomicLevel.mutate({ id, name: values.name })}
          onToggleActive={(id) => toggleSocioeconomicLevel.mutate(id)}
        />
      )}
      {subTab === 3 && (
        <SimpleCatalogList
          label="Idiomas"
          items={languages}
          showIsoCode
          isCreating={createLanguage.isPending}
          isUpdating={updateLanguage.isPending}
          onCreate={(values) => createLanguage.mutate({ name: values.name, isoCode: values.isoCode ?? '' })}
          onUpdate={(id, values) =>
            updateLanguage.mutate({ id, name: values.name, isoCode: values.isoCode ?? '' })
          }
          onToggleActive={(id) => toggleLanguage.mutate(id)}
        />
      )}
      {subTab === 4 && (
        <CountriesList
          items={countries}
          isCreating={createCountry.isPending}
          isUpdating={updateCountry.isPending}
          onCreate={(values) => createCountry.mutate(values)}
          onUpdate={(id, values) => updateCountry.mutate({ id, ...values })}
        />
      )}
      {subTab === 5 && <StateCatalogPanel />}
      {subTab === 6 && <CityCatalogPanel />}
    </Box>
  )
}
