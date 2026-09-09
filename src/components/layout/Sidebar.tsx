import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { Link, useRouterState } from '@tanstack/react-router'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useSession, useLogout } from '@/features/auth'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { AppButton } from '@/components/AppButton'
import { sidebarNavConfig } from './sidebarNavConfig'

interface SidebarProps {
  // Modo compacto (solo iconos) para laptop dentro de consulta / expediente.
  compact?: boolean
}

export function Sidebar({ compact = false }: SidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { user } = useSession()
  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => window.location.assign('/login'),
  })

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <Box
      component="nav"
      sx={{
        width: compact ? 72 : 260,
        flexShrink: 0,
        minHeight: '100vh',
        bgcolor: 'brand.dark',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        py: 3,
        transition: 'width 150ms ease',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ px: compact ? 0 : 3, mb: 4, alignItems: 'center', justifyContent: compact ? 'center' : 'flex-start' }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '6px',
            bgcolor: 'brand.accent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: 'brand.dark',
            flexShrink: 0,
          }}
        >
          PC
        </Box>
        {!compact && (
          <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#ffffff' }}>
            Precisión Care
          </Typography>
        )}
      </Stack>

      <Stack spacing={compact ? 1.5 : 3} sx={{ flex: 1, overflowY: 'auto' }}>
        {sidebarNavConfig.map((section) => (
          <Box key={section.title} sx={{ px: compact ? 1 : 1.5 }}>
            {!compact && (
              <Typography
                sx={{
                  px: 1.5,
                  mb: 1,
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {section.title}
              </Typography>
            )}
            <Stack spacing={0.5}>
              {section.items.map((item) => {
                const isActive = !!item.to && pathname === item.to
                const content = (
                  <Stack
                    direction="row"
                    spacing={compact ? 0 : 1.5}
                    sx={{
                      alignItems: 'center',
                      justifyContent: compact ? 'center' : 'flex-start',
                      px: compact ? 0 : 1.5,
                      py: 1,
                      borderRadius: '6px',
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      color: item.to ? '#ffffff' : 'rgba(255,255,255,0.35)',
                      cursor: item.to ? 'pointer' : 'default',
                      '&:hover': item.to && !isActive ? { bgcolor: 'rgba(255,255,255,0.08)' } : undefined,
                    }}
                  >
                    <item.icon sx={{ fontSize: 20 }} />
                    {!compact && (
                      <Typography sx={{ fontSize: '14px', fontWeight: isActive ? 600 : 400 }}>
                        {item.label}
                      </Typography>
                    )}
                  </Stack>
                )

                const wrapped = compact ? (
                  <Tooltip title={item.label} placement="right">
                    <Box>{content}</Box>
                  </Tooltip>
                ) : (
                  content
                )

                if (!item.to) {
                  return <Box key={item.label}>{wrapped}</Box>
                }

                return (
                  <Link key={item.label} to={item.to} style={{ textDecoration: 'none' }}>
                    {wrapped}
                  </Link>
                )
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack
        spacing={1.5}
        sx={{ px: compact ? 1 : 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', alignItems: compact ? 'center' : 'stretch' }}
      >
        {compact ? (
          <InitialsAvatar initials={initials} size={32} />
        ) : (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <InitialsAvatar initials={initials} size={36} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }} noWrap>
                {user?.name ?? 'Usuario'}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }} noWrap>
                {user?.email}
              </Typography>
            </Box>
          </Stack>
        )}
        <AppButton
          size="small"
          variant="outlined"
          loading={isPending}
          onClick={() => logout()}
          startIcon={compact ? undefined : <LogoutOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            minWidth: compact ? 40 : undefined,
            px: compact ? 1 : undefined,
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#ffffff',
            '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          {compact ? <LogoutOutlinedIcon sx={{ fontSize: 18 }} /> : 'Cerrar sesión'}
        </AppButton>
      </Stack>
    </Box>
  )
}
