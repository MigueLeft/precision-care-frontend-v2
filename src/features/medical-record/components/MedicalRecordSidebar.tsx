import { Box, Chip, Stack, Typography } from '@mui/material'
import { Link, useRouterState } from '@tanstack/react-router'
import { MEDICAL_RECORD_TABS, type MedicalRecordCounts } from '../constants'

interface MedicalRecordSidebarProps {
  patientId: number
  counts?: MedicalRecordCounts
}

export function MedicalRecordSidebar({ patientId, counts }: MedicalRecordSidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const activeSlug = pathname.split('/').filter(Boolean).pop()

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: '100%', md: 220 },
        flexShrink: 0,
        borderRight: { md: '1px solid' },
        borderColor: { md: 'divider' },
        pr: { md: 2 },
      }}
    >
      <Stack
        spacing={0.5}
        direction={{ xs: 'row', md: 'column' }}
        sx={{ overflowX: { xs: 'auto', md: 'visible' } }}
      >
        {MEDICAL_RECORD_TABS.map((tab) => {
          const isActive = activeSlug === tab.slug
          const count = tab.countKey ? counts?.[tab.countKey] : undefined

          return (
            <Link
              key={tab.slug}
              to={tab.to}
              params={{ patientId: String(patientId) }}
              style={{ textDecoration: 'none' }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  px: 1.5,
                  py: 1,
                  borderRadius: '6px',
                  color: isActive ? 'primary.main' : 'text.primary',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  borderLeft: '2px solid',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  '&:hover': { bgcolor: isActive ? 'action.selected' : 'action.hover' },
                }}
              >
                <tab.icon sx={{ fontSize: 20 }} />
                <Typography
                  sx={{ fontSize: '14px', fontWeight: isActive ? 600 : 400, flex: 1 }}
                >
                  {tab.label}
                </Typography>
                {typeof count === 'number' && (
                  <Chip
                    label={count}
                    size="small"
                    sx={{ height: 18, minWidth: 18, bgcolor: 'grey.100' }}
                  />
                )}
              </Stack>
            </Link>
          )
        })}
      </Stack>
    </Box>
  )
}
