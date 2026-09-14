import { Drawer } from '@mui/material'
import { MappingManagerDrawerBody } from './MappingManagerDrawerBody'
import type { IntakeMapping } from '../types'

export type MappingTarget = { groupId: number } | { questionId: number }

interface MappingManagerDrawerProps {
  target: MappingTarget | null
  intakeId: number
  versionId: number
  mappings: IntakeMapping[]
  onClose: () => void
}

export function MappingManagerDrawer({
  target,
  intakeId,
  versionId,
  mappings,
  onClose,
}: MappingManagerDrawerProps) {
  const scopedMappings = target
    ? mappings.filter((mapping) =>
        'groupId' in target ? mapping.groupId === target.groupId : mapping.questionId === target.questionId,
      )
    : []

  return (
    <Drawer anchor="right" open={target !== null} onClose={onClose}>
      {target && (
        <MappingManagerDrawerBody
          target={target}
          intakeId={intakeId}
          versionId={versionId}
          mappings={scopedMappings}
          onClose={onClose}
        />
      )}
    </Drawer>
  )
}
