import { useState } from 'react'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useQuestionnaireDetailed } from '../hooks/useQuestionnaireDetailed'
import { useEditableVersion } from '../hooks/useEditableVersion'
import { usePublishVersion } from '../hooks/usePublishVersion'
import { BuilderHeader } from './BuilderHeader'
import { SectionList } from './SectionList'
import { QuestionList } from './QuestionList'
import { MappingManagerDrawer } from './MappingManagerDrawer'
import type { MappingTarget } from './MappingManagerDrawer'

interface QuestionnaireBuilderPageProps {
  questionnaireId: number
}

export function QuestionnaireBuilderPage({ questionnaireId }: QuestionnaireBuilderPageProps) {
  const { data: questionnaire, isLoading } = useQuestionnaireDetailed(questionnaireId)
  const editableVersionMutation = useEditableVersion(questionnaireId)
  const publishMutation = usePublishVersion(questionnaireId)
  const [mappingTarget, setMappingTarget] = useState<MappingTarget | null>(null)

  if (isLoading || !questionnaire) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  const version = questionnaire.version
  const isDraft = version !== null && version.publishedAt === null

  return (
    <Box>
      <BuilderHeader
        questionnaire={questionnaire}
        isDraft={isDraft}
        isPreparingDraft={editableVersionMutation.isPending}
        isPublishing={publishMutation.isPending}
        onStartEditing={() => editableVersionMutation.mutate()}
        onPublish={() => version && publishMutation.mutate(version.id)}
      />

      {version && (
        <Stack spacing={3} sx={{ mt: 3 }}>
          <SectionList
            questionnaireId={questionnaireId}
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
              questionnaireId={questionnaireId}
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
          questionnaireId={questionnaireId}
          versionId={version.id}
          mappings={version.mappings}
          onClose={() => setMappingTarget(null)}
        />
      )}
    </Box>
  )
}
