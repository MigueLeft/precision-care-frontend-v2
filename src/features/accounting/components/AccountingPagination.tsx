import { TablePagination } from '@mui/material'

type Props = {
  page: number
  pageSize: number
  total: number
  label: string
  onChange: (pagination: { page: number; pageSize: number }) => void
}

export function AccountingPagination({ page, pageSize, total, label, onChange }: Props) {
  return (
    <TablePagination component="div" count={total} page={page - 1} rowsPerPage={pageSize}
      rowsPerPageOptions={[10, 25, 50]} labelRowsPerPage={label}
      onPageChange={(_, next) => onChange({ page: next + 1, pageSize })}
      onRowsPerPageChange={(event) => onChange({ page: 1, pageSize: Number(event.target.value) })}
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`} />
  )
}
