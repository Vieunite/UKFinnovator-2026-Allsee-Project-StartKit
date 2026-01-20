import { useApiQuery } from '@/hooks/useApiQuery'

export const useUploadStatus = (uploadId: string | null, options?: { enabled?: boolean }) => {
  return useApiQuery(
    ['uploadStatus', uploadId],
    async (client) => {
      if (!uploadId) throw new Error('Upload ID is required')
      const response = await client.get_upload_status_v1_media_uploads__upload_id__get({
        upload_id: uploadId,
      })
      return response.data
    },
    {
      enabled: uploadId !== null && options?.enabled !== false,
      refetchInterval: (query) => {
        // Poll every 5 seconds if status is pending or processing
        const data = query.state.data
        if (data?.status === 'pending' || data?.status === 'processing') {
          return 5000
        }
        // Stop polling if completed or failed
        return false
      },
      staleTime: 0, // Always consider stale to allow polling
      ...options,
    }
  )
}
