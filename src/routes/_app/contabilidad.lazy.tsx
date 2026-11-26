import { createLazyFileRoute } from '@tanstack/react-router'
import { AccountingPage } from '@/features/accounting'

export const Route = createLazyFileRoute('/_app/contabilidad')({ component: AccountingPage })
