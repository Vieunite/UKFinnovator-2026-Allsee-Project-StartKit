import { DeviceStatusGroups } from '@/data'
import { CheckIcon, ExclamationTriangleIcon, MoonIcon, TvIcon, XMarkIcon } from '@heroicons/react/24/outline'
import DevicesCard from './DevicesCard'

interface RenderDevicesProps {
  className?: string
  devices?: DeviceStatusGroups | null
  loading: boolean
}

const RenderDevices = ({ className, devices, loading }: RenderDevicesProps) => {
  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:gap-4 ${className}`}>
      <DevicesCard
        title="Total Devices"
        Icon={TvIcon}
        devices={devices?.all}
        loading={loading}
        iconColor="#A7A7A7"
        route="/devices"
        clearFilters
      />
      <DevicesCard
        title="Online"
        Icon={CheckIcon}
        devices={devices?.online}
        loading={loading}
        iconColor="#32D484"
        route="/devices"
        filter={{ value: 'online', field: 'status', type: 'status' }}
      />
      <DevicesCard
        title="Offline"
        Icon={XMarkIcon}
        devices={devices?.offline}
        loading={loading}
        iconColor="#FF6757"
        route="/devices"
        filter={{ value: 'offline', field: 'status', type: 'status' }}
      />
      <DevicesCard
        title="Errors"
        Icon={ExclamationTriangleIcon}
        devices={devices?.errors}
        loading={loading}
        iconColor="#FDAF22"
        route="/devices"
        filter={{ value: 'error', field: 'status', type: 'status' }}
      />
      <DevicesCard
        title="Asleep"
        Icon={MoonIcon}
        devices={devices?.asleep}
        loading={loading}
        iconColor="#00C9FF"
        route="/devices"
        filter={{ value: 'asleep', field: 'status', type: 'status' }}
      />
    </div>
  )
}

export default RenderDevices
