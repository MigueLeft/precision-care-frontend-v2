import { isAxiosError } from 'axios'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { mensaje?: string; message?: string } | undefined
    return data?.mensaje ?? data?.message ?? fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
