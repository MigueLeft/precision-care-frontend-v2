import { TableRow, TableCell, Typography, Chip, IconButton, Switch, Tooltip } from '@mui/material'
import { ToggleActiveButton } from '@/components/ToggleActiveButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { ParaclinicalCatalog } from '../types'

interface ParaclinicalRowProps {
  paraclinical: ParaclinicalCatalog
  categoryNameById: Map<number, string>
  onEdit: () => void
  onToggleActive: () => void
  onToggleDefault: (showByDefault: boolean) => void
}

export function ParaclinicalRow({
  paraclinical,
  categoryNameById,
  onEdit,
  onToggleActive,
  onToggleDefault,
}: ParaclinicalRowProps) {
  const referenceRange =
    paraclinical.referenceMin || paraclinical.referenceMax
      ? `${paraclinical.referenceMin ?? '—'} – ${paraclinical.referenceMax ?? '—'}`
      : '—'

  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
          {paraclinical.name}
        </Typography>
        {(paraclinical.loincCode || paraclinical.description) && (
          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
            {[paraclinical.loincCode && `LOINC ${paraclinical.loincCode}`, paraclinical.description]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <Chip
          label={categoryNameById.get(paraclinical.categoryId) ?? '—'}
          size="small"
          color="info"
          variant="outlined"
        />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px' }}>
          {paraclinical.defaultUnit ?? '—'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: 'text.secondary' }}>
          {referenceRange}
        </Typography>
      </TableCell>
      <TableCell>
        <Tooltip title="Aparece al elegir su categoría en la captura de resultados">
          <Switch
            size="small"
            checked={paraclinical.showByDefault}
            onChange={(_event, checked) => onToggleDefault(checked)}
            slotProps={{ input: { 'aria-label': `Mostrar ${paraclinical.name} por defecto` } }}
          />
        </Tooltip>
      </TableCell>
      <TableCell>
        <Chip
          label={paraclinical.active ? 'Activo' : 'Inactivo'}
          size="small"
          color={paraclinical.active ? 'success' : 'default'}
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar">
          <IconButton size="small" onClick={onEdit} aria-label="Editar paraclínico">
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <ToggleActiveButton active={paraclinical.active} onClick={onToggleActive} />
      </TableCell>
    </TableRow>
  )
}
