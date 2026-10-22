import { useState } from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { FoodImageEntry, FoodImageVariant } from '../utils/food-images'

type ImageGroup = { src: string; items: FoodImageVariant[] }

// Agrupa las variantes por foto para no repetir la misma imagen cuando un
// alimento muestra varios tamaños en una sola foto.
function groupBySrc(variants: FoodImageVariant[]): ImageGroup[] {
  const groups = new Map<string, ImageGroup>()
  for (const variant of variants) {
    const group = groups.get(variant.src) ?? { src: variant.src, items: [] }
    group.items.push(variant)
    groups.set(variant.src, group)
  }
  return [...groups.values()]
}

type FoodReferenceImagesProps = {
  entry: FoodImageEntry
}

// Fotos de referencia de porciones con su leyenda de gramos. Las que no
// cargan se ocultan; si ninguna carga, no se muestra el bloque.
export function FoodReferenceImages({ entry }: FoodReferenceImagesProps) {
  const [failed, setFailed] = useState<string[]>([])
  const groups = groupBySrc(entry.variants).filter((group) => !failed.includes(group.src))
  if (groups.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ mt: 1.5, p: 1.5, borderRadius: '8px' }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1 }}>{entry.label}</Typography>
      <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {groups.map((group) => (
          <Box key={group.src} sx={{ width: { xs: '100%', sm: 200 } }}>
            <Box
              component="img"
              src={group.src}
              alt={`Referencia de porciones: ${entry.label}`}
              onError={() => setFailed((prev) => [...prev, group.src])}
              sx={{ width: '100%', borderRadius: '6px', display: 'block' }}
            />
            <Box component="ul" sx={{ m: 0, mt: 0.75, pl: 2.5 }}>
              {group.items.map((item) => (
                <Typography component="li" key={item.label} sx={{ fontSize: '12px' }}>
                  {item.label}: {item.grams} {item.unit ?? 'g'}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
      <Typography sx={{ fontSize: '11px', color: 'text.secondary', mt: 1 }}>
        Referencia visual de porciones
      </Typography>
    </Paper>
  )
}
