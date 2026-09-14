import { useState } from 'react'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useIntakeDetailed } from '../hooks/useIntakeDetailed'
import { useEditableVersion } from '../hooks/useEditableVersion'
import { usePublishVersion } from '../hooks/usePublishVersion'
import { BuilderHeader } from './BuilderHeader'
import { SectionList } from './SectionList'
import { QuestionList } from './QuestionList'
import { MappingManagerDrawer } from './MappingManagerDrawer'
import type { MappingTarget } from './MappingManagerDrawer'

interface IntakeBuilderPageProps {
  intakeId: number
}

export function IntakeBuilderPage({ intakeId }: IntakeBuilderPageProps) {
  const { data: intake, isLoading } = useIntakeDetailed(intakeId)
  const editableVersionMutation = useEditableVersion(intakeId)
  const publishMutation = usePublishVersion(intakeId)
  const [mappingTarget, setMappingTarget] = useState<MappingTarget | null>(null)

  if (isLoading || !intake) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  const version = intake.version
  const isDraft = version !== null && version.publishedAt === null

  return (
    <Box>
      <BuilderHeader
        intake={intake}
        isDraft={isDraft}
        isPreparingDraft={editableVersionMutation.isPending}
        isPublishing={publishMutation.isPending}
        onStartEditing={() => editableVersionMutation.mutate()}
        onPublish={() => version && publishMutation.mutate(version.id)}
      />

      {version && (
        <Stack spacing={3} sx={{ mt: 3 }}>
          <SectionList
            intakeId={intakeId}
            versionId={version.id}
            sections={version.groups}
            readOnly={!isDraft}
            onConfigureSectionMapping={(groupId) => setMappingTarget({ groupId })}
            onConfigureQuestionMapping={(questionId) => setMappingTarget({ questionId })}
          />

          <Box>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Preguntas sin sección
            </Typography>
            <QuestionList
              intakeId={intakeId}
              versionId={version.id}
              groupId={null}
              questions={version.ungroupedQuestions}
              readOnly={!isDraft}
              onConfigureMapping={(questionId) => setMappingTarget({ questionId })}
            />
          </Box>
        </Stack>
      )}

      {!version && (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 4 }}>
          Este ingresable todavía no tiene contenido. Usa "Comenzar a construir" para crear su primera
          versión.
        </Typography>
      )}

      {version && (
        <MappingManagerDrawer
          target={mappingTarget}
          intakeId={intakeId}
          versionId={version.id}
          mappings={version.mappings}
          onClose={() => setMappingTarget(null)}
        />
      )}
    </Box>
  )
}
