import { Drawer } from '@mui/material'
import { MappingManagerDrawerBody } from './MappingManagerDrawerBody'
import type { QuestionnaireMapping } from '../types'

export type MappingTarget = { groupId: number } | { questionId: number }

interface MappingManagerDrawerProps {
  target: MappingTarget | null
  questionnaireId: number
  versionId: number
  mappings: QuestionnaireMapping[]
  onClose: () => void
}

export function MappingManagerDrawer({
  target,
  questionnaireId,
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
          questionnaireId={questionnaireId}
          versionId={versionId}
          mappings={scopedMappings}
          onClose={onClose}
        />
      )}
    </Drawer>
  )
}
