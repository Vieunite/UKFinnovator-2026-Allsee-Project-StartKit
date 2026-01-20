import { FilterState } from '@/components/DataTable'
import { encodeFilters } from '@/components/DataTable/DataTableContext'
import { Device } from '@/data'
import { ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Tooltip from '../../Tooltip'

interface PublishedTrackerProps {
  devices?: Device[]
  loading: boolean
}

const PublishedTracker = ({ devices, loading: initialLoading }: PublishedTrackerProps) => {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate published statistics
  const calculateStats = () => {
    if (!devices || devices.length === 0) {
      return {
        total: 0,
        published: 0,
        unpublished: 0,
        percentage: 0,
        color: 'gray',
      }
    }

    const total = devices.length
    const published = devices.filter((d) => d.publish_status === 'Published').length
    const unpublished = total - published
    const percentage = total > 0 ? Math.round((published / total) * 100) : 0

    // Determine color based on percentage
    let color = 'gray'
    let message = 'No devices listed'
    if (percentage === 100) {
      color = 'green'
      message = `You're all set! All media has been downloaded.`
    } else if (percentage >= 25) {
      color = 'yellow'
      message = `Some devices are still processing. Please wait and refresh after a few minutes.`
    } else {
      color = 'red'
      message = `Some devices are still processing. Please wait and refresh after a few minutes.`
    }

    return {
      total,
      published,
      unpublished,
      percentage,
      color,
      message,
    }
  }

  const stats = calculateStats()

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const loading = initialLoading || isRefreshing

  // Calculate stroke-dasharray for radial progress
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference

  // Color classes
  const colorClasses = {
    green: {
      stroke: 'stroke-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
    },
    yellow: {
      stroke: 'stroke-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    red: {
      stroke: 'stroke-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
    },
    gray: {
      stroke: 'stroke-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
    },
  }

  const colors = colorClasses[stats.color as keyof typeof colorClasses] || colorClasses.gray

  const handleUnpublishedClick = () => {
    const filters: FilterState[] = [{ field: 'publish_status', value: 'Unpublished', type: 'text' }]
    let url = `/devices?filters=${encodeFilters(filters)}`
    router.push(url)
  }

  return (
    <div className="text-textLightMode dark:text-textDarkMode flex h-full w-full min-w-0 flex-col rounded-lg bg-white p-3 shadow-md md:min-h-[250px] lg:p-2 dark:bg-gray-800">
      <div className="flex flex-shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-sans text-sm font-medium lg:text-base">Published Status</h3>
          <Tooltip
            content="Shows the percentage of devices that have successfully published their media. Green indicates all devices are published, yellow indicates some devices are still processing, and red indicates critical publishing issues."
            show={true}
            delay={300}
            className="!w-fit"
            tooltipClassName="!min-w-44"
            noWrap
          >
            <ExclamationCircleIcon className="h-4 w-4 cursor-help text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
          </Tooltip>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          title="Refresh data"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-2 flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-hidden lg:mt-3 lg:gap-2">
          {/* Radial Progress Chart */}
          <div
            className="relative flex max-h-[300px] min-h-0 w-full flex-1 items-center justify-center"
            style={{ minHeight: 0 }}
          >
            <svg
              className="pointer-events-none h-full w-full -rotate-90 transform select-none"
              viewBox="0 0 140 140"
              preserveAspectRatio="xMidYMid meet"
              style={{ maxWidth: '100%', maxHeight: '100%', minHeight: 0 }}
            >
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-500 ${colors.stroke}`}
              />
            </svg>
            {/* Center text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`font-sans text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl ${colors.text}`}>
                {stats.percentage}%
              </span>
              <span className="text-[8px] text-gray-500 sm:text-[9px] md:text-[10px] lg:text-xs dark:text-gray-400">
                Published
              </span>
            </div>
          </div>

          <p className={`flex-shrink-0 text-[8px] ${colors.text} text-center sm:text-[9px] md:text-[10px] lg:text-xs`}>
            {stats.message}
          </p>
          {/* Stats */}
          <div className="flex w-full flex-shrink-0 flex-col gap-1.5 lg:gap-2">
            {stats.unpublished > 0 ? (
              <button
                className={`flex items-center justify-between rounded-lg px-2 py-1 text-[9px] sm:px-2.5 sm:py-1.5 sm:text-[10px] md:px-3 md:py-2 md:text-xs lg:text-sm ${colors.bg} cursor-pointer transition-all duration-200 hover:brightness-105`}
                onClick={handleUnpublishedClick}
              >
                <span className={`${colors.text}`}>Unpublished</span>
                <span className={`font-sans font-semibold ${colors.text}`}>{stats.unpublished}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-lg px-2 py-1 text-[9px] sm:px-2.5 sm:py-1.5 sm:text-[10px] md:px-3 md:py-2 md:text-xs lg:text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Devices</span>
                <span className="font-sans font-medium text-gray-900 dark:text-gray-100">{stats.total}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PublishedTracker
