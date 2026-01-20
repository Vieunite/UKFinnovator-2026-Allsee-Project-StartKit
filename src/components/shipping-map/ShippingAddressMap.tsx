// 'use client'

// import { removeBodyOverflow, resetBodyOverflow } from '@/utility/utility'
// import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
// import { useEffect, useState } from 'react'

// interface ShippingAddressMapProps {
//   filtersAreActive: boolean
//   shippingAddress: { id: string; name: string; address: string }[]
//   onClose: () => void
// }

// interface MarkerProps {
//   hovered: boolean
//   onMouseEnter: () => void
//   onMouseLeave: () => void
//   position: { lat: number; lng: number }
//   tooltipContent?: { name: string; address: string }
// }

// const RenderMarker = ({ hovered, onMouseEnter, onMouseLeave, position, tooltipContent }: MarkerProps) => {
//   const [markerRef, marker] = useAdvancedMarkerRef()

//   return (
//     <>
//       <AdvancedMarker
//         ref={markerRef}
//         clickable
//         position={position}
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//       >
//         <Pin
//           background={hovered ? '#dc2626' : '#991b1b'}
//           borderColor={hovered ? '#dc2626' : '#991b1b'}
//           glyphColor={hovered ? '#fca5a5' : '#fca5a5'}
//           scale={hovered ? 0.9 : 0.8}
//         />
//       </AdvancedMarker>
//       {tooltipContent && hovered && (
//         <InfoWindow anchor={marker} headerDisabled>
//           <div className="flex flex-col gap-2 dark:text-textLightMode">
//             <h3>Order: {tooltipContent.name}</h3>
//             <p>{tooltipContent.address}</p>
//           </div>
//         </InfoWindow>
//       )}
//     </>
//   )
// }

// const ShippingAddressMap = ({ shippingAddress, onClose, filtersAreActive }: ShippingAddressMapProps) => {
//   console.log('filtersAreActive', filtersAreActive)
//   console.log('shippingAddress', shippingAddress)

//   const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)
//   const [centeredLocation, setCenteredLocation] = useState<{ lat: number; lng: number } | null>(null)

//   const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

//   useEffect(() => {
//     removeBodyOverflow()
//     const handlePressEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         onClose()
//       }
//     }

//     document.addEventListener('keydown', handlePressEscape)

//     return () => {
//       resetBodyOverflow()
//       document.removeEventListener('keydown', handlePressEscape)
//     }
//   }, [onClose])

//   // Check if API key is available
//   if (!googleMapsApiKey) {
//     return (
//       <div
//         onMouseDown={(e) => e.stopPropagation()}
//         onPointerDown={(e) => e.stopPropagation()}
//         onClick={onClose}
//         className="fixed left-0 top-0 z-[120] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm"
//       >
//         <div
//           onMouseDown={(e) => e.stopPropagation()}
//           onPointerDown={(e) => e.stopPropagation()}
//           onClick={(e) => e.stopPropagation()}
//           className="flex h-auto max-h-[90%] w-[80%] flex-col gap-6 rounded-xl bg-white p-6 shadow-xl max-sm:w-[90%] max-sm:p-4 lg:p-10 dark:bg-gray-800"
//         >
//           <div className="flex items-center justify-between gap-2">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shipping Addresses Map</h1>
//             <button
//               onClick={onClose}
//               className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
//             >
//               <XMarkIcon className="size-6" />
//             </button>
//           </div>
//           <div className="flex h-[600px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
//             <div className="text-center">
//               <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Google Maps API Key Required</p>
//               <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//                 Please add your Google Maps API key to the environment variables.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div
//         onMouseDown={(e) => e.stopPropagation()}
//         onPointerDown={(e) => e.stopPropagation()}
//         onClick={onClose}
//         className="fixed left-0 top-0 z-[120] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm"
//       >
//         <div
//           onMouseDown={(e) => e.stopPropagation()}
//           onPointerDown={(e) => e.stopPropagation()}
//           onClick={(e) => e.stopPropagation()}
//           className="flex h-auto max-h-[90%] w-[80%] flex-col gap-6 rounded-xl bg-white p-6 shadow-xl max-sm:w-[90%] max-sm:p-4 lg:p-10 dark:bg-gray-800"
//         >
//           <div className="flex items-center justify-between gap-2">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shipping Addresses Map</h1>
//             <button
//               onClick={onClose}
//               className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
//             >
//               <XMarkIcon className="size-6" />
//             </button>
//           </div>
//           <div className="flex h-[600px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
//             <div className="flex flex-col items-center gap-4 text-center">
//               <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Error fetching geocoded addresses</p>
//               <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{error}</p>
//               <button onClick={fetchGeocodedAddresses} className="w-fit rounded-md bg-primary px-4 py-2 text-white">
//                 Retry
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div
//       onMouseDown={(e) => e.stopPropagation()}
//       onPointerDown={(e) => e.stopPropagation()}
//       onClick={onClose}
//       className="fixed left-0 top-0 z-[120] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm"
//     >
//       <div
//         onMouseDown={(e) => e.stopPropagation()}
//         onPointerDown={(e) => e.stopPropagation()}
//         onClick={(e) => e.stopPropagation()}
//         className="flex h-auto max-h-[90%] w-[80%] flex-col gap-6 rounded-xl bg-white p-6 shadow-xl max-sm:w-[90%] max-sm:p-4 lg:p-10 dark:bg-gray-800"
//       >
//         <div className="flex items-center justify-between gap-2">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shipping Addresses Map</h1>
//           <button
//             onClick={onClose}
//             className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
//           >
//             <XMarkIcon className="size-6" />
//           </button>
//         </div>

//         <div className="flex flex-col gap-4 overflow-y-auto">
//           {filtersActive && <p className="text-sm text-gray-600 dark:text-gray-400">{`(Filters are being applied)`}</p>}
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             {!loading && (
//               <>
//                 Showing {shippingAddress.length} shipping address{shippingAddress.length !== 1 ? 'es' : ''}
//                 {validGeocodedAddresses.length !== shippingAddress.length && (
//                   <span className="ml-2 text-orange-600">({validGeocodedAddresses.length} successfully geocoded)</span>
//                 )}
//               </>
//             )}
//           </div>

//           <div className="flex h-[600px] w-full overflow-hidden rounded-lg rounded-br-none border border-gray-200 max-md:flex-col max-md:rounded-bl-none md:rounded-tr-none dark:border-gray-700">
//             {loading ? (
//               <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-800">
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Converting {shippingAddress.length} addresses to map coordinates...
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="h-full w-[calc(100%-300px)] max-md:h-[400px] max-md:w-full">
//                   <APIProvider apiKey={googleMapsApiKey}>
//                     <Map
//                       style={{ width: '100%', height: '100%' }}
//                       defaultCenter={{ lat: 54.0, lng: -2.0 }}
//                       defaultZoom={6}
//                       gestureHandling={'greedy'}
//                       disableDefaultUI={true}
//                       mapId="map"
//                       center={centeredLocation}
//                     >
//                       {validGeocodedAddresses.map((address, index) => (
//                         <RenderMarker
//                           key={index}
//                           hovered={hoveredMarker === address.id}
//                           onMouseEnter={() => {
//                             setHoveredMarker(address.id)
//                           }}
//                           onMouseLeave={() => {
//                             setHoveredMarker(null)
//                           }}
//                           position={address.position}
//                           tooltipContent={{ name: address.name, address: address.address }}
//                         />
//                       ))}
//                     </Map>
//                   </APIProvider>
//                 </div>
//                 <div className="h-full w-[300px] overflow-y-auto border-l border-gray-200 bg-gray-50 max-md:h-[300px] max-md:w-full max-md:border-l-0 max-md:border-t dark:border-gray-700 dark:bg-gray-900">
//                   <div className="sticky top-0 z-10 bg-gray-50 px-4 py-3 shadow-sm dark:bg-gray-900">
//                     <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
//                       Shipping Addresses ({validGeocodedAddresses.length})
//                     </h3>
//                   </div>
//                   <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {validGeocodedAddresses.map((address, index) => {
//                       const isHovered = hoveredMarker === address.id

//                       return (
//                         <div
//                           key={index}
//                           className={`group px-4 py-3 transition-colors ${isHovered ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
//                           onMouseEnter={() => {
//                             setHoveredMarker(address.id)
//                             setCenteredLocation(address.position)
//                           }}
//                           onMouseLeave={() => {
//                             setHoveredMarker(null)
//                             setCenteredLocation(null)
//                           }}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div
//                               className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-blue-600 transition-colors ${isHovered ? 'bg-blue-200 dark:bg-blue-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}
//                             >
//                               <MapPinIcon className="h-4 w-4" />
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <div className="flex items-center justify-between">
//                                 <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
//                                   {address.name}
//                                 </p>
//                               </div>
//                               <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
//                                 {address.address}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ShippingAddressMap
