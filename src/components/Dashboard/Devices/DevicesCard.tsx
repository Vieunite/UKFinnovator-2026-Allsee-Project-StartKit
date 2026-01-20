import { encodeFilters } from '@/components/DataTable/DataTableContext'
import type { FilterState } from '@/components/DataTable/types'
import { Device } from '@/data'
import { useRouter } from 'next/navigation'

interface DevicesCardProps {
  title: string
  devices?: Device[]
  loading: boolean
  Icon: React.ElementType
  iconColor: string
  route?: string
  filter?: FilterState
  clearFilters?: boolean
}

const DevicesCard = ({ devices, loading, title, Icon, iconColor, route, filter, clearFilters }: DevicesCardProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (!route) return

    let url = route

    // If clearFilters is true, explicitly set empty filters in query params
    if (clearFilters) {
      url = `${route}?filters=${encodeURIComponent(JSON.stringify([]))}`
    } else if (filter) {
      // If filter is provided, add it to query params
      const encodedFilters = encodeFilters([filter])
      if (encodedFilters) {
        url = `${route}?filters=${encodedFilters}`
      }
    }

    router.push(url)
  }

  return (
    <button
      title={title}
      disabled={loading}
      onClick={handleClick}
      className={`dark:text-textDarkMode text-textLightMode flex items-center justify-between gap-2 rounded-lg bg-white p-3 shadow-sm lg:gap-3 lg:p-4 dark:bg-gray-800 ${loading ? 'cursor-default' : 'transition-transform duration-200 hover:scale-105'}`}
    >
      <div
        style={{ backgroundColor: iconColor }}
        className={`flex items-center justify-center rounded-full p-2.5 lg:p-3.5`}
      >
        <Icon className="h-5 w-5 text-white lg:h-7 lg:w-7" />
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-right text-xs lg:text-sm" title={title}>
          {title}
        </p>
        {loading || !devices ? (
          <div className="mt-1 h-5 w-5 animate-spin self-end rounded-full border-4 border-primary border-t-transparent lg:h-7 lg:w-7"></div>
        ) : (
          <p className="whitespace-nowrap text-right text-lg font-semibold lg:text-2xl">{devices.length}</p>
        )}
      </div>
    </button>
  )
}

export default DevicesCard
