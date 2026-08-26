import { Box, Paper, Stack, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined'
import { QuestionList } from './QuestionList'
import type { QuestionGroup } from '../types'

interface SectionCardProps {
  section: QuestionGroup
  versionId: number
  questionnaireId: number
  readOnly: boolean
  onEdit: () => void
  onDelete: () => void
  onConfigureSectionMapping: () => void
  onConfigureQuestionMapping: (questionId: number) => void
}

export function SectionCard({
  section,
  versionId,
  questionnaireId,
  readOnly,
  onEdit,
  onDelete,
  onConfigureSectionMapping,
  onConfigureQuestionMapping,
}: SectionCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>{section.title}</Typography>
          {section.description && (
            <Typography variant="body2" color="text.secondary">
              {section.description}
            </Typography>
          )}
          {section.lifestyleComponent && (
            <Chip label={section.lifestyleComponent} size="small" color="info" variant="outlined" sx={{ mt: 1 }} />
          )}
        </Box>

        {!readOnly && (
          <Stack direction="row">
            <Tooltip title="Configurar mapeo de sección">
              <IconButton size="small" onClick={onConfigureSectionMapping} aria-label="Configurar mapeo de sección">
                <AltRouteOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar sección">
              <IconButton size="small" onClick={onEdit} aria-label="Editar sección">
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar sección">
              <IconButton size="small" onClick={onDelete} aria-label="Eliminar sección">
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Stack>

      <QuestionList
        questionnaireId={questionnaireId}
        versionId={versionId}
        groupId={section.id}
        questions={section.questions}
        readOnly={readOnly}
        onConfigureMapping={onConfigureQuestionMapping}
      />
    </Paper>
  )
}
