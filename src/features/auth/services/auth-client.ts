import { createAuthClient } from 'better-auth/react'

// El backend sirve better-auth en /api/auth — baseURL apunta a la raíz del backend.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  // Evita refetchear la sesión cada vez que la pestaña recupera el foco:
  // eso remonta el árbol completo en App.tsx y resetea formularios en progreso (ej. login).
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
})

export const { signIn, signOut, signUp, useSession } = authClient
