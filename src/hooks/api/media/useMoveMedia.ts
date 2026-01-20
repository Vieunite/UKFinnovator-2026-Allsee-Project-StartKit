import { useApiMutation } from '@/hooks/useApiMutation'
import type { Paths } from '@/types/openapi'

type MoveMediaRequest = {
  folder_id: number | null
  media_ids: string[]
}

// Use the bulk move endpoint: /v1/media/move
// Accepts { folder_id: number | null, media_ids: string[] }
// Note: The TypeScript types show folder_id as number, but the API accepts null for Root
export const useMoveMedia = () => {
  return useApiMutation(
    async (client, { folder_id, media_ids }: MoveMediaRequest) => {
      // Ensure we have at least one media ID
      if (media_ids.length === 0) {
        throw new Error('At least one media ID is required')
      }

      // The API accepts folder_id as number | null, but TypeScript types show it as number
      // We'll cast to satisfy TypeScript while maintaining runtime correctness
      const requestBody = {
        folder_id: folder_id as any, // API accepts null for Root, but TypeScript expects number
        media_ids: media_ids as [string, ...string[]], // Ensure non-empty array for TypeScript
      } as Paths.MoveMediaBatchV1MediaMovePost.RequestBody

      await client.move_media_batch_v1_media_move_post(null, requestBody)

      return { success: true, moved_count: media_ids.length }
    },
    {},
    [['media']] // Invalidate media queries on success
  )
}
