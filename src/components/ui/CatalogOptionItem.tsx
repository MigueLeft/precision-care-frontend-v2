import type { HTMLAttributes } from 'react'
import { Box, Typography } from '@mui/material'
import type { CatalogOption } from './CatalogSearchInput'

type CatalogOptionItemProps = HTMLAttributes<HTMLLIElement> & {
  option: CatalogOption
}

// Renglón de una opción de catálogo: nombre y, si lo tiene, su alias debajo.
export function CatalogOptionItem({ option, ...props }: CatalogOptionItemProps) {
  return (
    <li {...props}>
      <Box>
        <Typography sx={{ fontSize: '14px' }}>{option.name}</Typography>
        {option.alias && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>{option.alias}</Typography>
        )}
      </Box>
    </li>
  )
}
