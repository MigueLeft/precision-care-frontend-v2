import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/features/auth'

export const Route = createFileRoute('/_app/mi-cuenta')({
  component: AccountPage,
})
