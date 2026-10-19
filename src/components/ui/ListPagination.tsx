import { Pagination, Stack, Typography } from '@mui/material'

type ListPaginationProps = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

// Paginación bajo una lista: "1–10 de 158" y los números de página.
export function ListPagination({ page, pageSize, total, onPageChange }: ListPaginationProps) {
  const pageCount = Math.ceil(total / pageSize)
  if (pageCount <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {from}–{to} de {total}
      </Typography>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, next) => onPageChange(next)}
        color="primary"
        shape="rounded"
      />
    </Stack>
  )
}
