'use client'

import type { QuickFilters } from '@/components/DataTable'
import { DataTable } from '@/components/DataTable'
import { useOrganisation } from '@/context/OrganisationContext'
import { Device, getAllDevices } from '@/data'
import HorizontalEllipsis from '@/svgs/HorizontalEllipsis'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const quickFilterOptions: QuickFilters[] = [
  { title: 'Online', filters: [{ value: 'online', field: 'status' as keyof Device, type: 'status' }] },
  { title: 'Offline', filters: [{ value: 'offline', field: 'status' as keyof Device, type: 'status' }] },
  {
    title: 'Offline +48hr',
    filters: [
      {
        value: ['<', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()],
        field: 'last_seen' as keyof Device,
        type: 'date',
      },
      {
        value: 'offline',
        field: 'status' as keyof Device,
        type: 'status',
      },
    ],
  },
  { title: 'Errors', filters: [{ value: 'error', field: 'status' as keyof Device, type: 'status' }] },
  { title: 'Asleep', filters: [{ value: 'asleep', field: 'status' as keyof Device, type: 'status' }] },
]

const Devices = ({
  allDevices,
  setAllDevices,
  refetch,
}: {
  allDevices: Device[]
  setAllDevices: React.Dispatch<React.SetStateAction<Device[]>>
  refetch: () => Promise<void>
}) => {
  const router = useRouter()

  return (
    <DataTable
      title="Devices"
      data={allDevices}
      setData={setAllDevices}
      columns={[
        {
          field: 'name',
          type: 'text',
          visible: true,
          options: { onClick: (item: Device) => router.push(`/devices/${item.id}`) },
        },
        { field: 'status', type: 'status', visible: true },
        { field: 'tags', type: 'tags', visible: true },
        { field: 'now_playing', type: 'now_playing', visible: true },
        { field: 'publish_status', type: 'text', visible: false, filterOptions: ['Published', 'Unpublished'] },
        { field: 'licence', type: 'licence', visible: true },
        { field: 'licence_expiry', type: 'date', visible: false },
        { field: 'location', type: 'text', visible: true },
        { field: 'organisation', type: 'entity', visible: true },
        { field: 'model', type: 'text', visible: true },
        { field: 'last_seen', type: 'date', visible: false },
      ]}
      quickFilters={quickFilterOptions}
      handleRefetch={refetch}
      perPage={25}
      merge
      pagination
      checkboxes
      actions={[
        { label: 'Edit', onClick: (item) => console.log('Edit device:', item.id) },
        { label: 'View Details', onClick: (item) => console.log('View device:', item.id) },
        { label: 'Delete', onClick: (item) => console.log('Delete device:', item.id) },
      ]}
      AfterOptions={() => (
        <div className="flex items-center gap-3">
          <button className="flex w-fit cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/50">
            <PlusCircleIcon className="h-5 w-5 stroke-2 transition-colors duration-300" />
            <span className="text-sm text-gray-500 transition-all duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Add
            </span>
          </button>

          <button className="flex w-fit cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700/50">
            <HorizontalEllipsis className="h-4 w-4 transition-colors duration-300" />
          </button>
        </div>
      )}
    />
  )
}

const DevicesWrapper = () => {
  const { selectedOrganisation } = useOrganisation()
  const [allDevicesRaw, setAllDevicesRaw] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  // Devices are already filtered by organisation in loadDevices via getAllDevices
  // So allDevicesRaw already contains only the selected organisation's devices
  const allDevices = allDevicesRaw

  const setAllDevices = (devices: Device[] | ((prev: Device[]) => Device[])) => {
    // Update the raw devices state
    if (typeof devices === 'function') {
      setAllDevicesRaw((prev) => {
        const updated = devices(prev)
        return updated
      })
    } else {
      setAllDevicesRaw(devices)
    }
  }

  const loadDevices = useCallback(async () => {
    setLoading(true)
    // Simulate async loading to prevent hydration issues
    await new Promise((resolve) => setTimeout(resolve, 500))
    const deviceData = getAllDevices(selectedOrganisation?.id || '')
    setAllDevicesRaw(deviceData)
    setLoading(false)
  }, [selectedOrganisation?.id])

  // Load devices on component mount and when organisation changes
  useEffect(() => {
    loadDevices()
  }, [selectedOrganisation?.id, loadDevices])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return <Devices allDevices={allDevices} setAllDevices={setAllDevices} refetch={loadDevices} />
}

export default DevicesWrapper
