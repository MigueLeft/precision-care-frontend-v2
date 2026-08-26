import { Box } from '@mui/material'

interface InitialsAvatarProps {
  initials: string
  size?: number
}

export function InitialsAvatar({ initials, size = 40 }: InitialsAvatarProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '6px',
        bgcolor: 'grey.100',
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size / 2.5,
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  )
}
