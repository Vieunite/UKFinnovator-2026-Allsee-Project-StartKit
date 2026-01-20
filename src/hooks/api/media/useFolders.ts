import { useApiQuery } from '@/hooks/useApiQuery'
import type { FolderNode, FolderTreeResponse, Paths } from '@/types/openapi'

type ListFolderChildrenParams = Paths.ListFolderChildrenV1MediaFoldersFolderIdChildrenGet.PathParameters

/**
 * Hook for fetching folder children (direct children of a specific folder)
 *
 * @example
 * ```tsx
 * // Get children of folder 123
 * const { data: folders, isLoading } = useFolderChildren(123)
 *
 * // Conditional fetching
 * const { data } = useFolderChildren(folderId, !!folderId)
 * ```
 */
export function useFolderChildren(folderId: number | null, enabled = true) {
  return useApiQuery<FolderNode[]>(
    ['folders', 'children', folderId],
    async (client) => {
      if (folderId === null) {
        // For root level, get the tree and return root folders
        const response = await client.list_folder_tree_v1_media_folders_get()
        const tree = response.data as FolderTreeResponse
        // Return root folders (items are already top-level)
        return tree.items || []
      } else {
        // Get direct children of the folder
        const response = await client.list_folder_children_v1_media_folders__folder_id__children_get({
          folder_id: folderId,
        })
        return response.data
      }
    },
    {
      enabled,
      staleTime: 30 * 1000, // 30 seconds
    }
  )
}

/**
 * Hook for fetching the full folder tree
 *
 * @example
 * ```tsx
 * const { data: tree, isLoading } = useFolderTree()
 * ```
 */
export function useFolderTree(enabled = true) {
  return useApiQuery<FolderTreeResponse>(
    ['folders', 'tree'],
    async (client) => {
      const response = await client.list_folder_tree_v1_media_folders_get()
      return response.data
    },
    {
      enabled,
      staleTime: 60 * 1000, // 1 minute
    }
  )
}
