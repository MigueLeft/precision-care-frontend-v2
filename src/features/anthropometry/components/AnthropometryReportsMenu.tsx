import { useState } from 'react'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import { AppButton } from '@/components/AppButton'
import {
  ANTHROPOMETRY_REPORT_LABELS,
  useAnthropometryReports,
  type AnthropometryReportKind,
} from '../hooks/useAnthropometryReports'
import type { Anthropometry } from '../types'

const ICONS: Record<AnthropometryReportKind, typeof PrintOutlinedIcon> = {
  body_composition: AccessibilityNewOutlinedIcon,
  anthropometry: MonitorHeartOutlinedIcon,
}

type AnthropometryReportsMenuProps = {
  patientId: number
  row: Anthropometry
}

// "Imprimir reporte": análisis de composición corporal o signos vitales y
// antropometría de la medición mostrada.
export function AnthropometryReportsMenu({ patientId, row }: AnthropometryReportsMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { print, ready } = useAnthropometryReports(patientId)

  return (
    <>
      <AppButton
        variant="outlined"
        startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
        disabled={!ready}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        Imprimir reporte
      </AppButton>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {(Object.keys(ANTHROPOMETRY_REPORT_LABELS) as AnthropometryReportKind[]).map((kind) => {
          const Icon = ICONS[kind]
          return (
            <MenuItem
              key={kind}
              onClick={() => {
                setAnchor(null)
                print(kind, row)
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{ANTHROPOMETRY_REPORT_LABELS[kind]}</ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
