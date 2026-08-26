import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useCivilStatuses } from '../hooks/useCivilStatuses'
import { useCreateCivilStatus } from '../hooks/useCreateCivilStatus'
import { useToggleCivilStatusActive } from '../hooks/useToggleCivilStatusActive'
import { useRaces } from '../hooks/useRaces'
import { useCreateRace } from '../hooks/useCreateRace'
import { useToggleRaceActive } from '../hooks/useToggleRaceActive'
import { useSocioeconomicLevels } from '../hooks/useSocioeconomicLevels'
import { useCreateSocioeconomicLevel } from '../hooks/useCreateSocioeconomicLevel'
import { useToggleSocioeconomicLevelActive } from '../hooks/useToggleSocioeconomicLevelActive'
import { useLanguages } from '../hooks/useLanguages'
import { useCreateLanguage } from '../hooks/useCreateLanguage'
import { useToggleLanguageActive } from '../hooks/useToggleLanguageActive'
import { useCountries } from '../hooks/useCountries'
import { useCreateCountry } from '../hooks/useCreateCountry'
import { SimpleCatalogList } from './SimpleCatalogList'
import { CountriesList } from './CountriesList'

// El catálogo de "País" es la única lista de países del sistema: se usa tanto
// para nacionalidad como para país de origen/residencia en Pacientes, evitando duplicar el catálogo.
const SUB_TABS = ['Estado civil', 'Raza', 'Nivel socioeconómico', 'Idioma', 'País / Nacionalidad'] as const

export function DemographicListsTab() {
  const [subTab, setSubTab] = useState(0)

  const { data: civilStatuses = [] } = useCivilStatuses()
  const createCivilStatus = useCreateCivilStatus()
  const toggleCivilStatus = useToggleCivilStatusActive()

  const { data: races = [] } = useRaces()
  const createRace = useCreateRace()
  const toggleRace = useToggleRaceActive()

  const { data: socioeconomicLevels = [] } = useSocioeconomicLevels()
  const createSocioeconomicLevel = useCreateSocioeconomicLevel()
  const toggleSocioeconomicLevel = useToggleSocioeconomicLevelActive()

  const { data: languages = [] } = useLanguages()
  const createLanguage = useCreateLanguage()
  const toggleLanguage = useToggleLanguageActive()

  const { data: countries = [] } = useCountries()
  const createCountry = useCreateCountry()

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
          onCreate={(values) => createCivilStatus.mutate(values.name)}
          onToggleActive={(id) => toggleCivilStatus.mutate(id)}
        />
      )}
      {subTab === 1 && (
        <SimpleCatalogList
          label="Razas"
          items={races}
          isCreating={createRace.isPending}
          onCreate={(values) => createRace.mutate(values.name)}
          onToggleActive={(id) => toggleRace.mutate(id)}
        />
      )}
      {subTab === 2 && (
        <SimpleCatalogList
          label="Niveles socioeconómicos"
          items={socioeconomicLevels}
          isCreating={createSocioeconomicLevel.isPending}
          onCreate={(values) => createSocioeconomicLevel.mutate(values.name)}
          onToggleActive={(id) => toggleSocioeconomicLevel.mutate(id)}
        />
      )}
      {subTab === 3 && (
        <SimpleCatalogList
          label="Idiomas"
          items={languages}
          showIsoCode
          isCreating={createLanguage.isPending}
          onCreate={(values) => createLanguage.mutate({ name: values.name, isoCode: values.isoCode ?? '' })}
          onToggleActive={(id) => toggleLanguage.mutate(id)}
        />
      )}
      {subTab === 4 && (
        <CountriesList
          items={countries}
          isCreating={createCountry.isPending}
          onCreate={(values) => createCountry.mutate(values)}
        />
      )}
    </Box>
  )
}
