import type { Components } from '@/types/openapi'

/**
 * LocalStorage utilities for managing upload state persistence
 * Extends MediaUploadResponse with additional metadata for UI tracking
 */

export type UploadItem = Components.Schemas.MediaUploadResponse & {
  fileName: string // Original filename (not in API response)
  createdAt: string // ISO timestamp when upload was initiated
  completedAt?: string // ISO timestamp when upload completed/failed
  error?: string | string[] // Error message(s) if upload failed
  hasInvalidatedMedia?: boolean // Flag to track if media query has been invalidated for this upload
}

const STORAGE_KEY = 'media_uploads'

/**
 * Removes old uploads from localStorage that are 'failed' or 'completed' for more than 11 minutes
 */
const cleanupOldUploads = (): void => {
  if (typeof window === 'undefined') return
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return

    const uploads = JSON.parse(stored) as UploadItem[]
    const elevenMinutesAgo = Date.now() - 11 * 60 * 1000

    // Filter out old completed/failed uploads
    const cleanedUploads = uploads.filter((upload) => {
      // Keep active uploads (pending, processing)
      if (upload.status === 'pending' || upload.status === 'processing') {
        return true
      }
      // For failed or completed uploads, check if they're older than 11 minutes
      if ((upload.status === 'failed' || upload.status === 'completed') && upload.completedAt) {
        const completedTime = new Date(upload.completedAt).getTime()
        return completedTime > elevenMinutesAgo
      }
      // Keep uploads without completedAt timestamp (shouldn't happen, but safe fallback)
      return true
    })

    // Only update localStorage if items were removed
    if (cleanedUploads.length !== uploads.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedUploads))
    }
  } catch (error) {
    console.error('Error cleaning up old uploads:', error)
  }
}

export const getStoredUploads = (): UploadItem[] => {
  if (typeof window === 'undefined') return []
  try {
    // Clean up old uploads before reading
    cleanupOldUploads()

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const uploads = JSON.parse(stored) as UploadItem[]

    // Return filtered uploads (same logic as cleanup for consistency)
    const elevenMinutesAgo = Date.now() - 11 * 60 * 1000
    return uploads.filter((upload) => {
      // Keep active uploads (pending, processing)
      if (upload.status === 'pending' || upload.status === 'processing') {
        return true
      }
      // For failed or completed uploads, check if they're older than 11 minutes
      if ((upload.status === 'failed' || upload.status === 'completed') && upload.completedAt) {
        const completedTime = new Date(upload.completedAt).getTime()
        return completedTime > elevenMinutesAgo
      }
      // Keep uploads without completedAt timestamp (shouldn't happen, but safe fallback)
      return true
    })
  } catch (error) {
    console.error('Error reading stored uploads:', error)
    return []
  }
}

export const saveUpload = (upload: UploadItem): void => {
  if (typeof window === 'undefined') return
  try {
    const uploads = getStoredUploads()
    const existingIndex = uploads.findIndex((u) => u.id === upload.id)
    if (existingIndex >= 0) {
      uploads[existingIndex] = upload
    } else {
      uploads.push(upload)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads))
  } catch (error) {
    console.error('Error saving upload:', error)
  }
}

export const removeUpload = (uploadId: string): void => {
  if (typeof window === 'undefined') return
  try {
    const uploads = getStoredUploads()
    const filtered = uploads.filter((u) => u.id !== uploadId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing upload:', error)
  }
}

export const updateUploadStatus = (
  uploadId: string,
  updates: Partial<Pick<UploadItem, 'status' | 'error' | 'completedAt' | 'hasInvalidatedMedia'>>
): void => {
  if (typeof window === 'undefined') return
  try {
    const uploads = getStoredUploads()
    const index = uploads.findIndex((u) => u.id === uploadId)
    if (index >= 0) {
      uploads[index] = { ...uploads[index], ...updates }
      if (updates.status === 'completed' || updates.status === 'failed') {
        uploads[index].completedAt = new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads))
    }
  } catch (error) {
    console.error('Error updating upload status:', error)
  }
}

/**
 * Marks an upload as having invalidated the media query
 */
export const markUploadAsInvalidated = (uploadId: string): void => {
  updateUploadStatus(uploadId, { hasInvalidatedMedia: true })
}
