import { Box, Stack, Typography } from '@mui/material'
import { Link, useRouterState } from '@tanstack/react-router'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useSession, useLogout } from '@/features/auth'
import { InitialsAvatar } from '@/components/InitialsAvatar'
import { AppButton } from '@/components/AppButton'
import { sidebarNavConfig } from './sidebarNavConfig'

export function Sidebar() {
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
        width: 260,
        flexShrink: 0,
        minHeight: '100vh',
        bgcolor: 'brand.dark',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        py: 3,
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ px: 3, mb: 4, alignItems: 'center' }}>
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
          }}
        >
          PC
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#ffffff' }}>
          Precisión Care
        </Typography>
      </Stack>

      <Stack spacing={3} sx={{ flex: 1, overflowY: 'auto' }}>
        {sidebarNavConfig.map((section) => (
          <Box key={section.title} sx={{ px: 1.5 }}>
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
            <Stack spacing={0.5}>
              {section.items.map((item) => {
                const isActive = !!item.to && pathname === item.to
                const content = (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: 'center',
                      px: 1.5,
                      py: 1,
                      borderRadius: '6px',
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      color: item.to ? '#ffffff' : 'rgba(255,255,255,0.35)',
                      cursor: item.to ? 'pointer' : 'default',
                      '&:hover': item.to && !isActive ? { bgcolor: 'rgba(255,255,255,0.08)' } : undefined,
                    }}
                  >
                    <item.icon sx={{ fontSize: 20 }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: isActive ? 600 : 400 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                )

                if (!item.to) {
                  return <Box key={item.label}>{content}</Box>
                }

                return (
                  <Link key={item.label} to={item.to} style={{ textDecoration: 'none' }}>
                    {content}
                  </Link>
                )
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Stack spacing={1.5} sx={{ px: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
        <AppButton
          size="small"
          variant="outlined"
          loading={isPending}
          onClick={() => logout()}
          startIcon={<LogoutOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#ffffff',
            '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.08)' },
          }}
        >
          Cerrar sesión
        </AppButton>
      </Stack>
    </Box>
  )
}
