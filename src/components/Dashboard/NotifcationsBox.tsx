import { useOrganisation } from '@/context/OrganisationContext'
import { getAllDevices, type Device } from '@/data'
import {
  CheckCircleIcon,
  EllipsisVerticalIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface NotificationItem {
  id: string
  severity: 'warning' | 'critical' | 'info' | 'success'
  message: string
  timestamp: Date
  deviceId?: string
  deviceName?: string
}

const generateNotificationsFromDevices = (devices: Device[]): NotificationItem[] => {
  const notifications: NotificationItem[] = []
  const now = new Date()
  const hours48 = 48 * 60 * 60 * 1000
  const hours72 = 72 * 60 * 60 * 1000

  devices.forEach((device) => {
    const timeSinceLastSeen = now.getTime() - device.last_seen.getTime()

    // Generate notifications based on device status
    switch (device.status) {
      case 'offline':
        if (timeSinceLastSeen > hours72) {
          // Critical: Offline for more than 72 hours
          notifications.push({
            id: `offline-critical-${device.id}`,
            severity: 'critical',
            message: `<strong>${device.name}</strong> has been Offline for more than 72 hours`,
            timestamp: new Date(device.last_seen.getTime() + hours72),
            deviceId: device.id,
            deviceName: device.name,
          })
        } else if (timeSinceLastSeen > hours48) {
          // Warning: Offline for more than 48 hours
          notifications.push({
            id: `offline-warning-${device.id}`,
            severity: 'warning',
            message: `<strong>${device.name}</strong> has been Offline for more than 48 hours`,
            timestamp: new Date(device.last_seen.getTime() + hours48),
            deviceId: device.id,
            deviceName: device.name,
          })
        } else {
          // Warning: Recently went offline
          notifications.push({
            id: `offline-recent-${device.id}`,
            severity: 'warning',
            message: `<strong>${device.name}</strong> is currently Offline`,
            timestamp: device.last_seen,
            deviceId: device.id,
            deviceName: device.name,
          })
        }
        break

      case 'error':
        // Critical: Device has errors
        notifications.push({
          id: `error-${device.id}`,
          severity: 'critical',
          message: `Critical system error on <strong>${device.name}</strong>`,
          timestamp: device.last_seen,
          deviceId: device.id,
          deviceName: device.name,
        })
        break

      case 'online':
        // Success: Device is online (only show if recently came online)
        // Show as success notification if last seen is within the last hour
        if (timeSinceLastSeen < 60 * 60 * 1000) {
          notifications.push({
            id: `online-${device.id}`,
            severity: 'success',
            message: `<strong>${device.name}</strong> is online`,
            timestamp: device.last_seen,
            deviceId: device.id,
            deviceName: device.name,
          })
        }
        break

      case 'asleep':
        // Info: Device is asleep
        notifications.push({
          id: `asleep-${device.id}`,
          severity: 'info',
          message: `<strong>${device.name}</strong> is in sleep mode`,
          timestamp: device.last_seen,
          deviceId: device.id,
          deviceName: device.name,
        })
        break
    }
  })

  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

const getSeverityConfig = (severity: NotificationItem['severity']) => {
  switch (severity) {
    case 'warning':
      return {
        iconColor: 'text-orange-500',
        icon: ExclamationTriangleIcon,
      }
    case 'critical':
      return {
        iconColor: 'text-red-500',
        icon: ExclamationTriangleIcon,
      }
    case 'info':
      return {
        iconColor: 'text-blue-500',
        icon: InformationCircleIcon,
      }
    case 'success':
      return {
        iconColor: 'text-green-500',
        icon: CheckCircleIcon,
      }
    default:
      return {
        iconColor: 'text-gray-500',
        icon: ExclamationTriangleIcon,
      }
  }
}

// Helper to encode filters to query string (same as DataTableContext)
const encodeFilters = (filters: Array<{ field: string; value: string; type: string }>): string => {
  if (filters.length === 0) return ''
  try {
    return encodeURIComponent(JSON.stringify(filters))
  } catch {
    return ''
  }
}

const NotifcationsBox = () => {
  const { selectedOrganisation } = useOrganisation()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Get all devices for the selected organisation and its children
  const devices = useMemo(() => {
    if (!selectedOrganisation) return []
    return getAllDevices(selectedOrganisation.id) /* Likely to be changed with APIs */
  }, [selectedOrganisation])

  // Generate notifications from devices
  const generateNotifications = useCallback(() => {
    if (!devices.length) {
      setNotifications([])
      setLoading(false)
      return
    }

    const generatedNotifications = generateNotificationsFromDevices(devices)
    setNotifications(generatedNotifications)
    setLoading(false)
  }, [devices])

  useEffect(() => {
    setLoading(true)
    // Simulate async loading
    setTimeout(() => {
      generateNotifications()
    }, 500)
  }, [generateNotifications])

  return (
    <div className="dark:text-textDarkMode text-textLightMode flex h-full min-h-[150px] w-full flex-col rounded-lg bg-white p-3 shadow-md lg:p-2 dark:bg-gray-800">
      <div className="flex items-center justify-between gap-2 font-medium">
        <h3 className="text-sm lg:text-base">Notifications</h3>
        <button className="transition-bg rounded-md p-1 duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          <EllipsisVerticalIcon className="h-4 w-4 lg:h-5 lg:w-5" />
        </button>
      </div>

      <div className="mt-1 min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-1/2 items-center justify-center">
            <div className="h-7 w-7 animate-spin self-end rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-2 lg:space-y-3">
            {notifications.map((notification) => {
              const config = getSeverityConfig(notification.severity)
              const IconComponent = config.icon

              const handleNotificationClick = () => {
                if (!notification.deviceId) return

                // Navigate to devices page with device ID filter
                const filter = {
                  field: 'id',
                  value: notification.deviceId,
                  type: 'text',
                }
                const encodedFilters = encodeFilters([filter])
                router.push(`/devices?filters=${encodedFilters}`)
              }

              return (
                <button
                  key={notification.id}
                  onClick={handleNotificationClick}
                  disabled={!notification.deviceId}
                  className={`transition-bg flex w-full items-center gap-2 rounded-md p-2 text-start duration-100 lg:gap-3 ${
                    notification.deviceId ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-default'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 stroke-[2.5] lg:h-5 lg:w-5 ${config.iconColor}`} />

                  <div className="flex-1">
                    <p
                      className="text-xs text-gray-900 lg:text-sm dark:text-gray-100"
                      dangerouslySetInnerHTML={{ __html: notification.message }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotifcationsBox
