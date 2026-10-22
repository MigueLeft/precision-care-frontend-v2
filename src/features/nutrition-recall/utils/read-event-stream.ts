// Lee una respuesta SSE del backend (líneas `data: {...}`) y entrega cada
// evento JSON a onEvent. Los comentarios (": ping") solo renuevan onActivity.
export async function readEventStream(
  response: Response,
  onEvent: (event: Record<string, unknown>) => void,
  onActivity?: () => void,
): Promise<void> {
  if (!response.body) throw new Error(`Error ${response.status}`)
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    onActivity?.()
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const parsed: unknown = JSON.parse(line.slice(6))
      if (parsed && typeof parsed === 'object') onEvent(parsed as Record<string, unknown>)
    }
  }
}
