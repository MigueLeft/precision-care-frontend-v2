import { useState } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import { AppButton } from '@/components/AppButton'
import { EmptyState } from '@/components/EmptyState'
import { useParaclinicalCategories } from '../hooks/useParaclinicalCategories'
import { useCreateParaclinicalCategory } from '../hooks/useCreateParaclinicalCategory'
import { useUpdateParaclinicalCategory } from '../hooks/useUpdateParaclinicalCategory'
import { useToggleParaclinicalCategoryActive } from '../hooks/useToggleParaclinicalCategoryActive'
import { buildCategoryTree, type CategoryTreeNode } from '../utils/paraclinical-category-tree'
import { ParaclinicalCategoryFormModal } from './ParaclinicalCategoryFormModal'
import type { ParaclinicalCategoryCatalog } from '../types'

type ModalState =
  | { kind: 'create-root' }
  | { kind: 'create-child'; parentId: number; parentName: string }
  | { kind: 'edit'; category: ParaclinicalCategoryCatalog }
  | null

interface CategoryRowProps {
  category: CategoryTreeNode
  depth: number
  onEdit: (category: ParaclinicalCategoryCatalog) => void
  onToggleActive: (id: number) => void
  onAddChild: (parentId: number, parentName: string) => void
}

function CategoryRow({ category, depth, onEdit, onToggleActive, onAddChild }: CategoryRowProps) {
  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          pl: depth * 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {depth > 0 && (
            <SubdirectoryArrowRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          )}
          <Typography sx={{ fontSize: '14px', fontWeight: depth === 0 ? 600 : 400 }}>
            {category.name}
          </Typography>
          {!category.active && <Chip label="Inactiva" size="small" />}
        </Stack>
        <Stack direction="row" spacing={0.5}>
          {depth === 0 && (
            <Tooltip title="Agregar subcategoría">
              <IconButton
                size="small"
                onClick={() => onAddChild(category.id, category.name)}
                aria-label="Agregar subcategoría"
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEdit(category)} aria-label="Editar categoría">
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={category.active ? 'Desactivar' : 'Activar'}>
            <IconButton
              size="small"
              onClick={() => onToggleActive(category.id)}
              aria-label="Cambiar estado"
            >
              <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {category.children.map((child) => (
        <CategoryRow
          key={child.id}
          category={child}
          depth={depth + 1}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onAddChild={onAddChild}
        />
      ))}
    </>
  )
}

export function ParaclinicalCategoriesTab() {
  const { data: categories = [] } = useParaclinicalCategories()
  const [modal, setModal] = useState<ModalState>(null)

  const createMutation = useCreateParaclinicalCategory({ onSuccess: () => setModal(null) })
  const updateMutation = useUpdateParaclinicalCategory({ onSuccess: () => setModal(null) })
  const toggleMutation = useToggleParaclinicalCategoryActive()

  const tree = buildCategoryTree(categories)

  function handleSubmit(name: string) {
    if (modal?.kind === 'create-root') {
      createMutation.mutate({ name })
    } else if (modal?.kind === 'create-child') {
      createMutation.mutate({ name, parentId: modal.parentId })
    } else if (modal?.kind === 'edit') {
      updateMutation.mutate({ id: modal.category.id, payload: { name } })
    }
  }

  const modalTitle =
    modal?.kind === 'create-root'
      ? 'Nueva categoría'
      : modal?.kind === 'create-child'
        ? `Nueva subcategoría de "${modal.parentName}"`
        : 'Editar categoría'

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {categories.length} categorías (incluye subcategorías)
        </Typography>
        <AppButton
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setModal({ kind: 'create-root' })}
        >
          Agregar categoría
        </AppButton>
      </Stack>

      {tree.length === 0 ? (
        <EmptyState message="Sin categorías de paraclínicos." />
      ) : (
        <Paper sx={{ px: 2 }}>
          {tree.map((node) => (
            <CategoryRow
              key={node.id}
              category={node}
              depth={0}
              onEdit={(category) => setModal({ kind: 'edit', category })}
              onToggleActive={(id) => toggleMutation.mutate(id)}
              onAddChild={(parentId, parentName) =>
                setModal({ kind: 'create-child', parentId, parentName })
              }
            />
          ))}
        </Paper>
      )}

      {modal && (
        <ParaclinicalCategoryFormModal
          title={modalTitle}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          initialName={modal.kind === 'edit' ? modal.category.name : undefined}
          onSubmit={handleSubmit}
          onClose={() => setModal(null)}
        />
      )}
    </Box>
  )
}
