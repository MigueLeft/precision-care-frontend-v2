import { Checkbox } from '@mui/material'

interface PermissionCellProps {
  checked: boolean
  disabled?: boolean
  onChange: () => void
}

export function PermissionCell({ checked, disabled, onChange }: PermissionCellProps) {
  return <Checkbox checked={checked} disabled={disabled} onChange={onChange} />
}
