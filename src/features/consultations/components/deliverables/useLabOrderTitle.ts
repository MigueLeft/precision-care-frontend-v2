import { useState } from 'react'

// Título de la orden: toma el nombre de los perfiles elegidos hasta que se
// escribe a mano.
export function useLabOrderTitle(initialTitle: string) {
  const [title, setTitle] = useState(initialTitle)
  const [edited, setEdited] = useState(initialTitle !== '')
  const [profileNames, setProfileNames] = useState<string[]>([])

  function addProfileName(name: string) {
    if (edited || profileNames.includes(name)) return
    const names = [...profileNames, name]
    setProfileNames(names)
    setTitle(names.join(' + '))
  }

  function typeTitle(value: string) {
    setTitle(value)
    setEdited(value.trim() !== '')
  }

  return { title, addProfileName, typeTitle }
}
