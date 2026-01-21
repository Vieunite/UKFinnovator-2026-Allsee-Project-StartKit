import { FilterState } from '@/components/DataTable'
import { encodeFilters } from '@/components/DataTable/DataTableContext'
import { Device } from '@/data'
import { useRouter } from 'next/navigation'
import PrimaryButton from '../../PrimaryButton'

interface DevicesGraphProps {
  devices?: Device[]
  loading: boolean
}

interface CompanyData {
  id: string // Organisation ID
  name: string // Organisation name
  totalDevices: number
  onlineDevices: number
  onlinePercentage: number
  others?: boolean
  all?: boolean
}

const DevicesGraph = ({ devices, loading }: DevicesGraphProps) => {
  const router = useRouter()

  const breakPoint = 3
  // Calculate company statistics
  const calculateCompanyStats = (): CompanyData[] => {
    // Group by organisation ID (not name) to handle duplicate names
    const companyMap = new Map<string, { id: string; name: string; total: number; online: number }>()

    // Count devices by organisation ID
    devices?.forEach((device) => {
      let orgId = 'unknown'
      let orgName = 'Unknown'

      if (
        typeof device.organisation === 'object' &&
        device.organisation !== null &&
        'id' in device.organisation &&
        'name' in device.organisation
      ) {
        orgId = device.organisation.id
        orgName = device.organisation.name
      } else if (typeof device.organisation === 'string') {
        orgId = device.organisation
        orgName = device.organisation
      }

      const current = companyMap.get(orgId) || { id: orgId, name: orgName, total: 0, online: 0 }
      current.total++
      if (device.status === 'online') {
        current.online++
      }
      companyMap.set(orgId, current)
    })

    // Convert to array and calculate percentages
    const companyStats: CompanyData[] = Array.from(companyMap.values()).map((org) => ({
      id: org.id,
      name: org.name,
      totalDevices: org.total,
      onlineDevices: org.online,
      onlinePercentage: org.total > 0 ? Math.round((org.online / org.total) * 100) : 0,
    }))

    // Sort by total devices (descending)
    return companyStats.sort((a, b) => b.totalDevices - a.totalDevices)
  }

  // Calculate overall statistics
  const calculateOverallStats = () => {
    const totalDevices = devices?.length || 0
    const onlineDevices = devices?.filter((device) => device.status === 'online').length || 0
    const onlinePercentage = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0

    return { totalDevices, onlineDevices, onlinePercentage }
  }

  const overallStats = calculateOverallStats()
  const companyStats = calculateCompanyStats()

  // Prepare chart data (max 7 bars: All + 5 companies + Others)
  const prepareChartData = () => {
    const chartData: CompanyData[] = []

    // Add "All" bar first
    chartData.push({
      id: 'all',
      name: 'All',
      totalDevices: overallStats.totalDevices,
      onlineDevices: overallStats.onlineDevices,
      onlinePercentage: overallStats.onlinePercentage,
      all: true,
    })

    // Add top 5 companies
    const topCompanies = companyStats.slice(0, breakPoint)
    chartData.push(...topCompanies)

    // Add "Others" bar if there are more than 5 companies
    if (companyStats.length > breakPoint) {
      const remainingCompanies = companyStats.slice(breakPoint)
      const othersTotal = remainingCompanies.reduce((sum, company) => sum + company.totalDevices, 0)
      const othersOnline = remainingCompanies.reduce((sum, company) => sum + company.onlineDevices, 0)
      const othersPercentage = othersTotal > 0 ? Math.round((othersOnline / othersTotal) * 100) : 0

      chartData.push({
        id: 'others',
        name: `Others +${remainingCompanies.length}`,
        totalDevices: othersTotal,
        onlineDevices: othersOnline,
        onlinePercentage: othersPercentage,
        others: true,
      })
    }

    return chartData
  }

  const chartData = prepareChartData()

  const handleViewAll = () => {
    const filters: FilterState[] = [{ field: 'status', value: 'online', type: 'status' }]
    let url = `/devices?filters=${encodeFilters(filters)}`
    router.push(url)
  }

  const handleClick = (item: CompanyData) => {
    let url
    if (item.all || item.others) {
      return handleViewAll()
    } else {
      // Use the organisation ID directly from the item
      const filters: FilterState[] = [
        {
          field: 'organisation',
          value: [{ type: 'id' as const, value: item.id }],
          type: 'entity',
        },
        { field: 'status', value: 'online', type: 'status' },
      ]
      url = `/devices?filters=${encodeFilters(filters)}`
    }

    router.push(url)
  }

  return (
    <div className="flex h-full min-h-[180px] w-full flex-col rounded-lg bg-white p-3 text-textLightMode shadow-md dark:bg-gray-800 dark:text-textDarkMode lg:p-2">
      <div className="flex items-center justify-between gap-2 font-medium">
        <h3 className="text-sm lg:text-base">Online Devices</h3>
        <PrimaryButton className="text-xs" onClick={handleViewAll}>
          View All
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="flex h-1/2 items-center justify-center">
          <div className="h-7 w-7 animate-spin self-end rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
          <div className="flex h-full min-h-[100px] flex-1 flex-col gap-2">
            {/* Chart Container - Responsive */}
            <div className="relative flex h-full flex-1 gap-1 lg:h-48 lg:gap-2">
              <div className="flex h-full w-6 flex-col justify-between text-xs text-gray-500 dark:text-gray-400 lg:w-8">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>
              <div
                className={`grid flex-1 items-end gap-1 border-b border-l pb-2 pl-1 lg:gap-4 lg:pl-2`}
                style={{ gridTemplateColumns: `repeat(${breakPoint + 2}, minmax(0, 1fr))` }}
              >
                {chartData.map((item) => (
                  <button
                    onClick={() => handleClick(item)}
                    key={item.id}
                    className="w-full rounded-md bg-primary transition-all duration-300 ease-out hover:brightness-75"
                    style={{ height: `${item.onlinePercentage}%` }}
                    title={`${item.name}: ${item.onlinePercentage}% online (${item.onlineDevices}/${item.totalDevices} devices)`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-1 lg:gap-2">
              <div className="w-6 lg:w-8" />
              <div
                className="grid flex-1 justify-items-center gap-1 pl-1 lg:gap-4 lg:pl-2"
                style={{ gridTemplateColumns: `repeat(${breakPoint + 2}, minmax(0, 1fr))` }}
              >
                {chartData.map((item) => (
                  <div
                    key={item.id}
                    className="w-full max-w-full text-center text-xs leading-tight text-gray-600 dark:text-gray-300 lg:max-w-[60px]"
                  >
                    <div className="truncate" title={item.name}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DevicesGraph
