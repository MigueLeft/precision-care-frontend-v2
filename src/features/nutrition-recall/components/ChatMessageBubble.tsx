import { Avatar, Box, Stack, Typography } from '@mui/material'
import { keyframes, styled } from '@mui/material/styles'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import type { ChatBubble } from '../hooks/useNutriBotChat'
import { foodImages } from '../utils/food-images'
import { FoodReferenceImages } from './FoodReferenceImages'
import { MarkdownContent } from './MarkdownContent'

// Acepta cualquier clave: el modelo a veces inventa una inexistente y el
// marcador debe ocultarse igual; la imagen solo aparece si la clave existe.
const IMG_MARKER_RE = /\[IMG:([a-zA-Z0-9_]+)\]/g

const blink = keyframes`0%, 80%, 100% { opacity: 0.2 } 40% { opacity: 1 }`

const Dot = styled('span')(({ theme }) => ({
  width: 7,
  height: 7,
  borderRadius: '50%',
  backgroundColor: theme.palette.text.secondary,
  display: 'inline-block',
  animation: `${blink} 1.4s infinite both`,
  '&:nth-of-type(2)': { animationDelay: '0.2s' },
  '&:nth-of-type(3)': { animationDelay: '0.4s' },
}))

function parseBotContent(content: string) {
  const key = [...content.matchAll(IMG_MARKER_RE)][0]?.[1]
  return {
    text: content.replace(IMG_MARKER_RE, '').trim(),
    image: key ? foodImages[key] : undefined,
  }
}

type ChatMessageBubbleProps = {
  message: ChatBubble
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isBot = message.role === 'assistant'
  const { text, image } = isBot ? parseBotContent(message.content) : { text: message.content, image: undefined }

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
      {isBot && (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          <RestaurantOutlinedIcon sx={{ fontSize: 18 }} />
        </Avatar>
      )}
      <Box
        sx={{
          maxWidth: { xs: '85%', sm: '75%' },
          px: 1.75,
          py: 1.25,
          borderRadius: '12px',
          borderTopLeftRadius: isBot ? '4px' : '12px',
          borderTopRightRadius: isBot ? '12px' : '4px',
          bgcolor: isBot ? 'background.paper' : 'primary.main',
          color: isBot ? 'text.primary' : 'primary.contrastText',
          border: isBot ? 1 : 0,
          borderColor: message.isError ? 'error.light' : 'divider',
        }}
      >
        {isBot ? (
          <>
            {text && <MarkdownContent>{text}</MarkdownContent>}
            {image && !message.streaming && <FoodReferenceImages entry={image} />}
            {message.streaming && !text && (
              <Stack direction="row" spacing={0.5} sx={{ py: 0.75 }} aria-label="NutriBot está escribiendo">
                <Dot />
                <Dot />
                <Dot />
              </Stack>
            )}
          </>
        ) : (
          <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{text}</Typography>
        )}
      </Box>
    </Stack>
  )
}
