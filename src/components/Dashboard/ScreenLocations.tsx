import { Device } from '@/data'
import { EyeIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FilterState } from '../DataTable'
import { encodeFilters } from '../DataTable/DataTableContext'

interface MarkerProps {
  hovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  position: { lat: number; lng: number }
  tooltipContent?: { name: string; address: string; status: string }
  status: 'online' | 'offline' | 'error' | 'asleep'
  onClick: () => void
}

const getStatusColors = (status: string, hovered: boolean) => {
  const baseColors = {
    online: { bg: '#32D484', border: '#32D484' }, // Green
    offline: { bg: '#FF6757', border: '#FF6757' }, // Red
    error: { bg: '#FDAF22', border: '#FDAF22' }, // Orange
    asleep: { bg: '#00C9FF', border: '#00C9FF' }, // Blue
  }

  const colors = baseColors[status as keyof typeof baseColors] || baseColors.offline

  return {
    background: hovered ? colors.border : colors.bg,
    borderColor: hovered ? colors.border : colors.bg,
    glyphColor: '#ffffff',
  }
}

const RenderMarker = ({
  hovered,
  onMouseEnter,
  onMouseLeave,
  position,
  tooltipContent,
  status,
  onClick,
}: MarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef()
  const colors = getStatusColors(status, hovered)

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        clickable
        position={position}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <Pin
          background={colors.background}
          borderColor={colors.borderColor}
          glyphColor={colors.glyphColor}
          scale={hovered ? 0.9 : 0.8}
        />
      </AdvancedMarker>
      {tooltipContent && hovered && (
        <InfoWindow anchor={marker} headerDisabled>
          <div className="flex flex-col gap-2 dark:text-textLightMode">
            <h3 className="font-semibold">{tooltipContent.name}</h3>
            <p className="text-sm text-gray-600">{tooltipContent.address}</p>
            <p className="text-xs">
              Status:{' '}
              <span
                className={`font-medium capitalize ${status === 'online' ? 'text-green-600' : status === 'error' ? 'text-red-600' : status === 'asleep' ? 'text-blue-600' : 'text-gray-600'}`}
              >
                {status}
              </span>
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

interface RenderMapProps {
  googleMapsApiKey: string
  devices?: Device[]
  hoveredMarker: string | null
  setHoveredMarker: (marker: string | null) => void
  centeredLocation?: { lat: number; lng: number }
  setCenteredLocation?: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
}

const RenderMap = ({
  googleMapsApiKey,
  devices,
  hoveredMarker,
  setHoveredMarker,
  centeredLocation,
}: RenderMapProps) => {
  const router = useRouter()
  const handleMarkerClick = (deviceId: string) => {
    const filter: FilterState = {
      field: 'id',
      value: deviceId,
      type: 'text',
    }

    const encodedFilters = encodeFilters([filter])
    router.push(`/devices?filters=${encodedFilters}`)
  }
  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 54.0, lng: -2.0 }}
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="map"
        center={centeredLocation}
      >
        {devices?.map((device) => (
          <RenderMarker
            key={device.id}
            hovered={hoveredMarker === device.id}
            onMouseEnter={() => {
              setHoveredMarker(device.id)
            }}
            onMouseLeave={() => {
              setHoveredMarker(null)
            }}
            position={device.position}
            status={device.status}
            onClick={() => handleMarkerClick(device.id)}
            tooltipContent={{
              name: device.name,
              address: device.address,
              status: device.status,
            }}
          />
        ))}
      </Map>
    </APIProvider>
  )
}

interface RenderMapModalProps {
  googleMapsApiKey: string
  devices: Device[]
  hoveredMarker: string | null
  setHoveredMarker: (marker: string | null) => void
  centeredLocation?: { lat: number; lng: number }
  setCenteredLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RenderMapModal = ({
  googleMapsApiKey,
  devices,
  hoveredMarker,
  setHoveredMarker,
  centeredLocation,
  setCenteredLocation,
  setModalOpen,
}: RenderMapModalProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const handlePressEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false)
      }
    }

    window.addEventListener('keydown', handlePressEscape)
    return () => {
      window.removeEventListener('keydown', handlePressEscape)
    }
  }, [setModalOpen])

  const handleDeviceClick = (deviceId: string) => {
    const filter: FilterState = {
      field: 'id',
      value: deviceId,
      type: 'text',
    }
    const encodedFilters = encodeFilters([filter])
    router.push(`/devices?filters=${encodedFilters}`)
  }

  // Filter devices based on selected statuses
  const filteredDevices =
    selectedStatuses.length > 0 ? devices.filter((device) => selectedStatuses.includes(device.status)) : devices

  // Group devices by organisation ID
  const groupedDevices = filteredDevices.reduce(
    (acc, device) => {
      const organisation = device.organisation
      if (!acc[organisation.id]) {
        acc[organisation.id] = []
      }
      acc[organisation.id].push(device)
      return acc
    },
    {} as Record<string, Device[]>
  )

  // Sort organisations by name (alphabetically), but keep ID as key
  const sortedOrganisations = Object.keys(groupedDevices)
    .map((orgId) => {
      // Get the organisation name from the first device in each group
      const firstDevice = groupedDevices[orgId][0]
      const orgName = firstDevice.organisation.name
      return { id: orgId, name: orgName }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="fixed left-0 top-0 z-[120] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex h-auto max-h-[90%] w-[80%] flex-col gap-6 rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800 max-sm:w-[90%] max-sm:p-4 lg:p-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Screen Locations Map</h1>
            <div className="flex flex-wrap items-center gap-2">
              {/* Online Button */}
              <button
                className={`transition-bg rounded-full border px-3 py-1 text-xs font-light duration-200 ${
                  selectedStatuses.includes('online')
                    ? 'border-[#32D484] bg-[#32D484] text-white hover:bg-[#2BC474] dark:hover:bg-[#2BC474]'
                    : 'border-[#32D484] text-[#32D484] hover:bg-[#32D484] hover:text-white dark:hover:bg-[#32D484] dark:hover:text-white'
                }`}
                onClick={() =>
                  setSelectedStatuses((prev) =>
                    prev.includes('online') ? prev.filter((status) => status !== 'online') : [...prev, 'online']
                  )
                }
              >
                Online
              </button>

              {/* Offline Button */}
              <button
                className={`transition-bg rounded-full border px-3 py-1 text-xs font-light duration-200 ${
                  selectedStatuses.includes('offline')
                    ? 'border-[#FF6757] bg-[#FF6757] text-white hover:bg-[#E55A4A] dark:hover:bg-[#E55A4A]'
                    : 'border-[#FF6757] text-[#FF6757] hover:bg-[#FF6757] hover:text-white dark:hover:bg-[#FF6757] dark:hover:text-white'
                }`}
                onClick={() =>
                  setSelectedStatuses((prev) =>
                    prev.includes('offline') ? prev.filter((status) => status !== 'offline') : [...prev, 'offline']
                  )
                }
              >
                Offline
              </button>

              {/* Error Button */}
              <button
                className={`transition-bg rounded-full border px-3 py-1 text-xs font-light duration-200 ${
                  selectedStatuses.includes('error')
                    ? 'border-[#FDAF22] bg-[#FDAF22] text-white hover:bg-[#E49E1E] dark:hover:bg-[#E49E1E]'
                    : 'border-[#FDAF22] text-[#FDAF22] hover:bg-[#FDAF22] hover:text-white dark:hover:bg-[#FDAF22] dark:hover:text-white'
                }`}
                onClick={() =>
                  setSelectedStatuses((prev) =>
                    prev.includes('error') ? prev.filter((status) => status !== 'error') : [...prev, 'error']
                  )
                }
              >
                Error
              </button>

              {/* Asleep Button */}
              <button
                className={`transition-bg rounded-full border px-3 py-1 text-xs font-light duration-200 ${
                  selectedStatuses.includes('asleep')
                    ? 'border-[#00C9FF] bg-[#00C9FF] text-white hover:bg-[#00B5E6] dark:hover:bg-[#00B5E6]'
                    : 'border-[#00C9FF] text-[#00C9FF] hover:bg-[#00C9FF] hover:text-white dark:hover:bg-[#00C9FF] dark:hover:text-white'
                }`}
                onClick={() =>
                  setSelectedStatuses((prev) =>
                    prev.includes('asleep') ? prev.filter((status) => status !== 'asleep') : [...prev, 'asleep']
                  )
                }
              >
                Asleep
              </button>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <XMarkIcon className="size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="flex h-[600px] w-full overflow-hidden rounded-lg rounded-br-none border border-gray-200 dark:border-gray-700 max-md:flex-col max-md:rounded-bl-none md:rounded-tr-none">
            <div className="h-full w-[calc(100%-300px)] max-md:h-[400px] max-md:w-full">
              <RenderMap
                googleMapsApiKey={googleMapsApiKey}
                devices={filteredDevices}
                hoveredMarker={hoveredMarker}
                setHoveredMarker={setHoveredMarker}
                centeredLocation={centeredLocation || undefined}
                setCenteredLocation={setCenteredLocation}
              />
            </div>
            <div className="h-full w-[300px] overflow-y-auto border-l border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 max-md:h-[300px] max-md:w-full max-md:border-l-0 max-md:border-t">
              <div className="sticky top-0 z-20 bg-gray-50 px-4 py-3 shadow-sm dark:bg-gray-900">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Devices ({filteredDevices.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedOrganisations.map((organisation) => (
                  <div key={organisation.id}>
                    {/* Organisation Header */}
                    <div className="sticky top-11 z-10 bg-gray-100 px-4 py-2 dark:bg-gray-800">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                        {organisation.name} ({groupedDevices[organisation.id].length})
                      </h4>
                    </div>

                    {/* Organisation Devices */}
                    {groupedDevices[organisation.id].map((device) => {
                      const isHovered = hoveredMarker === device.id
                      const statusColors = getStatusColors(device.status, false)

                      return (
                        <button
                          key={device.id}
                          className={`group w-full px-4 py-3 text-start transition-colors ${isHovered ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                          onMouseEnter={() => {
                            setHoveredMarker(device.id)
                            setCenteredLocation(device.position)
                          }}
                          onMouseLeave={() => {
                            setHoveredMarker(null)
                            setCenteredLocation(null)
                          }}
                          onClick={() => handleDeviceClick(device.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors"
                              style={{
                                backgroundColor: statusColors.background + '20', // 20% opacity
                                color: statusColors.background,
                              }}
                            >
                              <MapPinIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p
                                  title={device.name}
                                  className="truncate text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                  {device.name}
                                </p>
                                <span
                                  className="ml-2 rounded-full px-2 py-1 text-xs font-medium capitalize"
                                  style={{
                                    backgroundColor: statusColors.background + '20',
                                    color: statusColors.background,
                                  }}
                                >
                                  {device.status}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{device.location}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                {device.address}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ScreenLocationsProps {
  devices?: Device[]
  loading: boolean
}

const ScreenLocations = ({ devices, loading }: ScreenLocationsProps) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [centeredLocation, setCenteredLocation] = useState<{ lat: number; lng: number } | null>(null)

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  if (!googleMapsApiKey) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Google Maps API Key Required</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please add your Google Maps API key to the environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {modalOpen && (
        <RenderMapModal
          googleMapsApiKey={googleMapsApiKey}
          devices={devices || []}
          hoveredMarker={hoveredMarker}
          setHoveredMarker={setHoveredMarker}
          centeredLocation={centeredLocation || undefined}
          setCenteredLocation={setCenteredLocation}
          setModalOpen={setModalOpen}
        />
      )}

      <div className="flex h-full min-h-[250px] w-full min-w-0 flex-shrink-0 flex-col rounded-lg bg-white p-3 text-textLightMode shadow-md dark:bg-gray-800 dark:text-textDarkMode lg:p-2">
        <div className="flex flex-shrink-0 items-center justify-between gap-2 font-medium">
          <h3 className="text-sm lg:text-base">Screen Locations</h3>
          <button
            disabled={loading}
            onClick={() => setModalOpen(true)}
            className="transition-bg rounded-md p-1 duration-200 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
          >
            <EyeIcon className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>
        </div>
        {loading || !devices ? (
          <div className="mt-3 h-full">
            <div className="flex h-full items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <RenderMap
              googleMapsApiKey={googleMapsApiKey}
              devices={devices}
              hoveredMarker={hoveredMarker}
              setHoveredMarker={setHoveredMarker}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ScreenLocations
