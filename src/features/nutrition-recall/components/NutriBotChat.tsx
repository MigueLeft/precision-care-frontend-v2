import { useEffect, useRef } from 'react'
import { Box, Stack } from '@mui/material'
import { useNutriBotChat } from '../hooks/useNutriBotChat'
import type { PublicNutritionRecall } from '../types'
import { ChatComposer } from './ChatComposer'
import { ChatMessageBubble } from './ChatMessageBubble'
import { ReportPhaseNotice } from './ReportPhaseNotice'

type NutriBotChatProps = {
  token: string
  recall: PublicNutritionRecall
}

// Conversación con NutriBot: mensajes, estado del reporte y caja de respuesta.
export function NutriBotChat({ token, recall }: NutriBotChatProps) {
  const { bubbles, isLoading, phase, send, retryFinish } = useNutriBotChat(token)
  const endRef = useRef<HTMLDivElement | null>(null)

  // Mantiene visible el último mensaje mientras NutriBot escribe.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bubbles, phase])

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 3 }, py: 2 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 760, mx: 'auto' }}>
          {bubbles.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          <ReportPhaseNotice phase={phase} recall={recall} onRetry={() => void retryFinish()} />
          <div ref={endRef} />
        </Stack>
      </Box>
      <ChatComposer
        busy={isLoading}
        disabled={isLoading || phase.kind !== 'interview'}
        onSend={(text) => void send(text)}
      />
    </Stack>
  )
}
