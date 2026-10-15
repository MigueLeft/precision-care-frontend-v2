import { Typography } from '@mui/material'
import type { AnthropometryParam } from '../config'

// Nombre del parámetro con la marca "calc." cuando se calcula solo.
export function ParamLabel({ param }: { param: Pick<AnthropometryParam, 'label' | 'calc'> }) {
  return (
    <>
      {param.label}
      {param.calc && (
        <Typography component="span" sx={{ fontSize: '10px', color: 'primary.main', ml: 0.5 }}>
          calc.
        </Typography>
      )}
    </>
  )
}
