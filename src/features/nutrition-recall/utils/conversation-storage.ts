import type { ChatTurn } from '../types'

// Conserva la entrevista en sessionStorage para que recargar la página (algo
// común en el celular) no obligue a empezar de nuevo. Si el almacenamiento no
// está disponible, la entrevista simplemente no se recupera.
const storageKey = (token: string) => `nutribot:${token}`

export function loadSavedConversation(token: string): ChatTurn[] {
  try {
    const raw = sessionStorage.getItem(storageKey(token))
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as ChatTurn[]) : []
  } catch {
    return []
  }
}

export function saveConversation(token: string, turns: ChatTurn[]): void {
  try {
    sessionStorage.setItem(storageKey(token), JSON.stringify(turns))
  } catch {
    // Sin almacenamiento disponible: no se guarda.
  }
}
