import { useState } from 'react'
import { Box, Stack, Typography, IconButton, ButtonGroup, Button } from '@mui/material'
import { Link } from '@tanstack/react-router'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

export function TopBar() {
  const breadcrumbs = useBreadcrumbs()
  // Selector visual únicamente — no hay sistema de i18n real implementado todavía.
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES')

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {breadcrumbs.map((crumb, index) => (
          <Stack key={crumb.label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {index > 0 && (
              <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>{'>'}</Typography>
            )}
            {crumb.to ? (
              <Link to={crumb.to} style={{ textDecoration: 'none' }}>
                <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                  {crumb.label}
                </Typography>
              </Link>
            ) : (
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
                {crumb.label}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <ButtonGroup size="small" aria-label="Idioma">
          {(['ES', 'EN'] as const).map((option) => (
            <Button
              key={option}
              variant={language === option ? 'contained' : 'outlined'}
              onClick={() => setLanguage(option)}
              sx={{ minWidth: 44, px: 1 }}
            >
              {option}
            </Button>
          ))}
        </ButtonGroup>
        <IconButton size="small" aria-label="Notificaciones">
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton size="small" aria-label="Ayuda">
          <HelpOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Box>
  )
}
