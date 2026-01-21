import type { Organisation } from '@/context/OrganisationContext'
import { initialOrganisations } from '@/context/OrganisationContext'
import { faker } from '@faker-js/faker'

export const authPages = ['/login', '/reset-password']

// Update organization IDs to match new structure
export const ORGANISATION_IDS = {
  ALLSEE_TECHNOLOGIES: 'allsee-technologies',
  ALLSEE_BIRMINGHAM: 'allsee-birmingham',
} as const

export type DeviceMedia = {
  name: string
  preview_url: string
}

export type Entity = {
  id: string
  name: string
}

export type Device = {
  name: string
  location: string
  id: string
  status: 'online' | 'offline' | 'error' | 'asleep'
  last_seen: Date
  ipAddress: string
  model: string
  version: string
  organisation: Entity
  position: { lat: number; lng: number }
  address: string
  tags: string[]
  now_playing: DeviceMedia
  publish_status: 'Published' | 'Unpublished'
  licence: string
  licence_expiry: Date
  resolution: { width: number; height: number }
}

export type DeviceStatusGroups = {
  all: Device[]
  online: Device[]
  offline: Device[]
  errors: Device[]
  asleep: Device[]
}

export const TagColors = [
  '#FCA5A5',
  '#93C5FD',
  '#86EFAC',
  '#FDE68A',
  '#D8B4FE',
  '#F9A8D4',
  '#A5B4FC',
  '#5EEAD4',
  '#FDBA74',
  '#D1D5DB',
]

const findOrganisationEntity = (orgId: string): Entity => {
  const search = (orgs: Organisation[]): Entity | null => {
    for (const org of orgs) {
      if (org.id === orgId) {
        return { id: org.id, name: org.name }
      }
      if (org.children) {
        const found = search(org.children)
        if (found) return found
      }
    }
    return null
  }
  const found = search(initialOrganisations)
  if (found) return found

  // Fallback mapping for old organization IDs
  const orgNameMap: Record<string, string> = {
    'allsee-technologies': 'Allsee Technologies',
    'allsee-birmingham': 'Allsee Birmingham',
  }
  return { id: orgId, name: orgNameMap[orgId] || orgId }
}

export const generateDevice = (deviceIndex: number, baseSeed?: number): Device => {
  // Use base seed + device index to ensure each device is unique but reproducible
  const deviceSeed = baseSeed ? baseSeed + deviceIndex : undefined
  if (deviceSeed) {
    faker.seed(deviceSeed)
  }

  const statuses: Device['status'][] = ['online', 'offline', 'error', 'asleep']
  const models = [
    'Samsung Smart Signage',
    'LG Digital Display',
    'Sony Professional Display',
    'Panasonic Commercial TV',
    'Sharp Business Monitor',
  ]

  const companyNames = ['Chaiiwala', 'Asda', 'Bullring', 'Warburtons', 'Matalan', 'Sainsburys', 'Tesco']

  // UK locations with realistic coordinates
  const ukLocations = [
    { city: 'London', lat: 51.5074, lng: -0.1278, address: '123 Oxford Street, London W1D 2HX' },
    { city: 'Manchester', lat: 53.4808, lng: -2.2426, address: '45 Market Street, Manchester M1 1WR' },
    { city: 'Birmingham', lat: 52.4862, lng: -1.8904, address: '78 New Street, Birmingham B2 4BA' },
    { city: 'Liverpool', lat: 53.4084, lng: -2.9916, address: '12 Church Street, Liverpool L1 3BT' },
    { city: 'Leeds', lat: 53.8008, lng: -1.5491, address: '34 Briggate, Leeds LS1 6HD' },
    { city: 'Sheffield', lat: 53.3811, lng: -1.4701, address: '56 Fargate, Sheffield S1 2HE' },
    { city: 'Bristol', lat: 51.4545, lng: -2.5879, address: '89 Broadmead, Bristol BS1 3DX' },
    { city: 'Newcastle', lat: 54.9783, lng: -1.6178, address: '23 Northumberland Street, Newcastle NE1 7DE' },
    { city: 'Nottingham', lat: 52.9548, lng: -1.1581, address: '67 Lister Gate, Nottingham NG1 7BW' },
    { city: 'Leicester', lat: 52.6369, lng: -1.1398, address: '45 Gallowtree Gate, Leicester LE1 5AD' },
    { city: 'Coventry', lat: 52.4068, lng: -1.5197, address: '12 Smithford Way, Coventry CV1 1FX' },
    { city: 'Bradford', lat: 53.796, lng: -1.7594, address: '34 Kirkgate, Bradford BD1 1QR' },
    { city: 'Cardiff', lat: 51.4816, lng: -3.1791, address: '78 Queen Street, Cardiff CF10 2BY' },
    { city: 'Belfast', lat: 54.5973, lng: -5.9301, address: '23 Donegall Place, Belfast BT1 5BA' },
    { city: 'Edinburgh', lat: 55.9533, lng: -3.1883, address: '56 Princes Street, Edinburgh EH2 2AN' },
    { city: 'Glasgow', lat: 55.8642, lng: -4.2518, address: '89 Buchanan Street, Glasgow G1 3HL' },
    { city: 'Southampton', lat: 50.9097, lng: -1.4044, address: '12 Above Bar, Southampton SO14 7DU' },
    { city: 'Portsmouth', lat: 50.8198, lng: -1.088, address: '34 Commercial Road, Portsmouth PO1 4BT' },
    { city: 'Brighton', lat: 50.8225, lng: -0.1372, address: '67 North Street, Brighton BN1 1ZA' },
    { city: 'Plymouth', lat: 50.3755, lng: -4.1427, address: '45 Armada Way, Plymouth PL1 2AA' },
  ]

  const tags = [
    'Retail',
    'Restaurant',
    'Hotel',
    'Office',
    'School',
    'University',
    'Hospital',
    'Gym',
    'Library',
    'Museum',
    'Theatre',
    'Cinema',
    'Bar',
    'Pub',
    'Club',
    'Shop',
    'Department Store',
    'Supermarket',
    'Mall',
    'Shopping Center',
    'Shopping Mall',
  ]

  // Generate playlist objects (relevant to retail/promotional contexts)
  const dummyDeviceMedia: DeviceMedia[] = [
    { name: 'Winter Promo', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Summer Sale', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Holiday Special', preview_url: '/images/default_avatar.jpeg' },
    { name: 'New Arrivals', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Weekly Deals', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Seasonal Collection', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Featured Products', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Brand Spotlight', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Customer Favorites', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Limited Edition', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Clearance Event', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Flash Sale', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Weekend Special', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Monthly Highlights', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Product Launch', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Spring Collection', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Autumn Promo', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Christmas Campaign', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Back to School', preview_url: '/images/default_avatar.jpeg' },
    { name: 'Valentine Special', preview_url: '/images/default_avatar.jpeg' },
  ]

  // Helper function to generate licence code (used for both generateDevice and raw data)
  const generateLicenceCode = (seed?: number): string => {
    if (seed !== undefined) {
      faker.seed(seed)
    }
    return faker.string.numeric(8)
  }

  // Helper function to generate licence expiry date
  const generateLicenceExpiry = (seed?: number): Date => {
    if (seed !== undefined) {
      faker.seed(seed)
    }
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + faker.number.int({ min: 1, max: 5 }))
    return expiryDate
  }

  // Helper function to generate resolution
  const generateResolution = (seed?: number): { width: number; height: number } => {
    if (seed !== undefined) {
      faker.seed(seed)
    }
    const resolutions = [
      { width: 1920, height: 1080 }, // Full HD
      { width: 1920, height: 540 }, // Stretch
      { width: 3840, height: 2160 }, // 4K
      { width: 2560, height: 720 }, // Wide
      { width: 1280, height: 720 }, // HD
      { width: 2560, height: 1440 }, // QHD
    ]
    return faker.helpers.arrayElement(resolutions)
  }

  const selectedLocation = faker.helpers.arrayElement(ukLocations)
  const companyName = faker.helpers.arrayElement(companyNames)

  // Randomly select 0-4 tags
  const numberOfTags = faker.number.int({ min: 0, max: 4 })
  const selectedTags = faker.helpers.arrayElements(tags, numberOfTags)

  // Find organisation entity from initialOrganisations or create a dummy one
  const findOrgEntity = (name: string): Entity => {
    const findOrg = (orgs: typeof initialOrganisations): Entity | null => {
      for (const org of orgs) {
        if (org.name === name) {
          return { id: org.id, name: org.name }
        }
        if (org.children) {
          const found = findOrg(org.children)
          if (found) return found
        }
      }
      return null
    }
    return findOrg(initialOrganisations) || { id: faker.string.uuid(), name: companyName }
  }

  const selectedModel = faker.helpers.arrayElement(models)
  const selectedResolution = generateResolution(deviceSeed)

  return {
    id: faker.string.uuid(),
    name: `${companyName} Screen ${faker.number.int({ min: 1, max: 10 })}`,
    location: selectedLocation.city,
    status: faker.helpers.arrayElement(statuses),
    last_seen: faker.date.recent({ days: 7 }),
    ipAddress: faker.internet.ipv4(),
    model: selectedModel,
    version: faker.system.semver(),
    organisation: findOrgEntity(companyName),
    position: {
      lat: selectedLocation.lat + faker.number.float({ min: -0.1, max: 0.1 }), // Add some variation
      lng: selectedLocation.lng + faker.number.float({ min: -0.1, max: 0.1 }),
    },
    address: selectedLocation.address,
    tags: selectedTags,
    now_playing: faker.helpers.arrayElement(dummyDeviceMedia),
    publish_status: faker.helpers.arrayElement(['Published', 'Unpublished']),
    licence: generateLicenceCode(deviceSeed),
    licence_expiry: generateLicenceExpiry(deviceSeed),
    resolution: selectedResolution,
  }
}

// Helper function to generate licence code (used for raw device data)
const generateLicenceCode = (seed?: number): string => {
  if (seed !== undefined && typeof faker !== 'undefined') {
    faker.seed(seed)
  }
  return seed ? String(seed).padStart(8, '0') : String(Math.floor(Math.random() * 100000000)).padStart(8, '0')
}

// Helper function to generate licence expiry date (used for raw device data)
const generateLicenceExpiry = (seed?: number): Date => {
  if (seed !== undefined && typeof faker !== 'undefined') {
    faker.seed(seed)
  }
  const expiryDate = new Date()
  const yearsToAdd = seed ? (seed % 5) + 1 : Math.floor(Math.random() * 5) + 1
  expiryDate.setFullYear(expiryDate.getFullYear() + yearsToAdd)
  return expiryDate
}

// Playlist objects for raw device data
const dummyDeviceMedia: DeviceMedia[] = [
  {
    name: 'Mixed Zyn',
    preview_url: '/images/pmi/ZYN_MIX_ZYN3024_MORPHING-MINI-1-5MG-QUAD-0010-1920X540_MOTION_EN-OC_2.jpg',
  },
  {
    name: 'Find Your Zyn',
    preview_url: '/images/pmi/ZYN_MIX_ZYN3024_MORPHING-MINI-1-5MG-QUAD-0010-1920X540_MOTION_EN-OC_3.jpg',
  },
  { name: 'IQOS Your Choice', preview_url: '/images/pmi/IQOS 37 Inch Stretch 1920x540.jpg' },
  { name: 'IQOS Tune Out', preview_url: '/images/pmi/IQOS 37 Inch Stretch 1920x540_2.jpg' },
  { name: 'Weekly Deals', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Featured Products', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Brand Spotlight', preview_url: '/images/default_avatar.jpeg' },
  {
    name: 'Veev Perspective',
    preview_url: '/images/pmi/PMI_UK_VEEV_ONE_VEEVMAV25_COURAGEOUS-B_KEY-VISUAL_EN-GB_1920x540.jpg',
  },
  { name: 'Limited Edition', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Clearance Event', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Flash Sale', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Weekend Special', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Monthly Highlights', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Product Launch', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Spring Collection', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Autumn Promo', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Christmas Campaign', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Back to School', preview_url: '/images/default_avatar.jpeg' },
  { name: 'Valentine Special', preview_url: '/images/default_avatar.jpeg' },
]

// Helper function to get resolution based on model
const getResolutionForModel = (model: string): { width: number; height: number } => {
  const modelLower = model.toLowerCase()
  if (modelLower.includes('stretch') || modelLower.includes('600')) {
    return { width: 1920, height: 540 }
  }
  if (modelLower.includes('4m') || modelLower.includes('4m')) {
    return { width: 3840, height: 720 }
  }
  if (modelLower.includes('2m') || modelLower.includes('2m')) {
    return { width: 2560, height: 720 }
  }
  // Default for standard screens (43in, 32", etc.)
  return { width: 1920, height: 1080 }
}

// Raw device data keyed by organisation ID
const rawDevicesData: Record<string, Device[]> = {
  'allsee-technologies': [
    {
      id: 'allsee-tech-1',
      name: 'London Office Screen 1',
      tags: ['Office', 'Main Display'],
      location: 'London',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '43in Screen',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.101',
      version: '1.0.0',
      position: { lat: 51.5074, lng: -0.1278 },
      address: 'London, UK',
      now_playing: dummyDeviceMedia[0],
      publish_status: 'Published',
      licence: generateLicenceCode(101),
      licence_expiry: generateLicenceExpiry(101),
      resolution: getResolutionForModel('43in Screen'),
    },
    {
      id: 'allsee-tech-2',
      name: 'London Office Screen 2',
      tags: ['Office', 'Reception'],
      location: 'London',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '37in Stretch',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.102',
      version: '1.0.0',
      position: { lat: 51.5074, lng: -0.1278 },
      address: 'London, UK',
      now_playing: dummyDeviceMedia[1],
      publish_status: 'Published',
      licence: generateLicenceCode(102),
      licence_expiry: generateLicenceExpiry(102),
      resolution: getResolutionForModel('37in Stretch'),
    },
    {
      id: 'allsee-tech-3',
      name: 'Manchester Office Screen',
      tags: ['Office', 'Conference Room'],
      location: 'Manchester',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '4m LED Header',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.103',
      version: '1.0.0',
      position: { lat: 53.4808, lng: -2.2426 },
      address: 'Manchester, UK',
      now_playing: dummyDeviceMedia[2],
      publish_status: 'Published',
      licence: generateLicenceCode(103),
      licence_expiry: generateLicenceExpiry(103),
      resolution: getResolutionForModel('4m LED Header'),
    },
    {
      id: 'allsee-tech-4',
      name: 'Leeds Office Screen',
      tags: ['Office', 'Main Display'],
      location: 'Leeds',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '43in Screen',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.104',
      version: '1.0.0',
      position: { lat: 53.8008, lng: -1.5491 },
      address: 'Leeds, UK',
      now_playing: dummyDeviceMedia[3],
      publish_status: 'Published',
      licence: generateLicenceCode(104),
      licence_expiry: generateLicenceExpiry(104),
      resolution: getResolutionForModel('43in Screen'),
    },
    {
      id: 'allsee-tech-5',
      name: 'Bristol Office Screen',
      tags: ['Office', 'Reception'],
      location: 'Bristol',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '2M LED Header',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.105',
      version: '1.0.0',
      position: { lat: 51.4545, lng: -2.5879 },
      address: 'Bristol, UK',
      now_playing: dummyDeviceMedia[4],
      publish_status: 'Published',
      licence: generateLicenceCode(105),
      licence_expiry: generateLicenceExpiry(105),
      resolution: getResolutionForModel('2M LED Header'),
    },
    {
      id: 'allsee-tech-6',
      name: 'Newcastle Office Screen',
      tags: ['Office', 'Main Display'],
      location: 'Newcastle',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '43in Screen',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.106',
      version: '1.0.0',
      position: { lat: 54.9783, lng: -1.6178 },
      address: 'Newcastle, UK',
      now_playing: dummyDeviceMedia[5],
      publish_status: 'Published',
      licence: generateLicenceCode(106),
      licence_expiry: generateLicenceExpiry(106),
      resolution: getResolutionForModel('43in Screen'),
    },
    {
      id: 'allsee-tech-7',
      name: 'Nottingham Office Screen',
      tags: ['Office', 'Conference Room'],
      location: 'Nottingham',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '37in Stretch',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.107',
      version: '1.0.0',
      position: { lat: 52.9548, lng: -1.1581 },
      address: 'Nottingham, UK',
      now_playing: dummyDeviceMedia[6],
      publish_status: 'Published',
      licence: generateLicenceCode(107),
      licence_expiry: generateLicenceExpiry(107),
      resolution: getResolutionForModel('37in Stretch'),
    },
    {
      id: 'allsee-tech-8',
      name: 'Cardiff Office Screen',
      tags: ['Office', 'Reception'],
      location: 'Cardiff',
      organisation: { id: 'allsee-technologies', name: 'Allsee Technologies' },
      model: '4m LED Header',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.1.108',
      version: '1.0.0',
      position: { lat: 51.4816, lng: -3.1791 },
      address: 'Cardiff, UK',
      now_playing: dummyDeviceMedia[7],
      publish_status: 'Published',
      licence: generateLicenceCode(108),
      licence_expiry: generateLicenceExpiry(108),
      resolution: getResolutionForModel('4m LED Header'),
    },
  ],
  'allsee-birmingham': [
    {
      id: 'birmingham-1',
      name: 'Birmingham City Centre Screen 1',
      tags: ['Retail', 'Main Store'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '37in Stretch',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.2.101',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[8],
      publish_status: 'Published',
      licence: generateLicenceCode(201),
      licence_expiry: generateLicenceExpiry(201),
      resolution: getResolutionForModel('37in Stretch'),
    },
    {
      id: 'birmingham-2',
      name: 'Birmingham City Centre Screen 2',
      tags: ['Retail', 'Main Store'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '4m LED Header',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.2.102',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[9],
      publish_status: 'Published',
      licence: generateLicenceCode(202),
      licence_expiry: generateLicenceExpiry(202),
      resolution: getResolutionForModel('4m LED Header'),
    },
    {
      id: 'birmingham-3',
      name: 'Birmingham Retail Park Screen 1',
      tags: ['Retail', 'Main Store'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '43in Screen',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.2.103',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[10],
      publish_status: 'Published',
      licence: generateLicenceCode(203),
      licence_expiry: generateLicenceExpiry(203),
      resolution: getResolutionForModel('43in Screen'),
    },
    {
      id: 'birmingham-4',
      name: 'Birmingham Retail Park Screen 2',
      tags: ['Retail', 'Reception'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '2M LED Header',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.2.104',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[11],
      publish_status: 'Published',
      licence: generateLicenceCode(204),
      licence_expiry: generateLicenceExpiry(204),
      resolution: getResolutionForModel('2M LED Header'),
    },
    {
      id: 'birmingham-5',
      name: 'Birmingham Shopping Centre Screen',
      tags: ['Retail', 'Main Store'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '600 Header',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.2.105',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[12],
      publish_status: 'Published',
      licence: generateLicenceCode(205),
      licence_expiry: generateLicenceExpiry(205),
      resolution: getResolutionForModel('600 Header'),
    },
    {
      id: 'birmingham-6',
      name: 'Birmingham High Street Screen 1',
      tags: ['Retail', 'Main Store'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '37in Stretch',
      status: 'online',
      last_seen: new Date(),
      ipAddress: '192.168.2.106',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[13],
      publish_status: 'Published',
      licence: generateLicenceCode(206),
      licence_expiry: generateLicenceExpiry(206),
      resolution: getResolutionForModel('37in Stretch'),
    },
    {
      id: 'birmingham-7',
      name: 'Birmingham High Street Screen 2',
      tags: ['Retail', 'Main Store'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '4M LED Header',
      status: 'error',
      last_seen: new Date(),
      ipAddress: '192.168.2.107',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[14],
      publish_status: 'Published',
      licence: generateLicenceCode(207),
      licence_expiry: generateLicenceExpiry(207),
      resolution: getResolutionForModel('4M LED Header'),
    },
    {
      id: 'birmingham-8',
      name: 'Birmingham Outlet Screen',
      tags: ['Retail', 'Outlet'],
      location: 'Birmingham',
      organisation: { id: 'allsee-birmingham', name: 'Allsee Birmingham' },
      model: '43in Screen',
      status: 'offline',
      last_seen: new Date(),
      ipAddress: '192.168.2.108',
      version: '1.0.0',
      position: { lat: 52.4862, lng: -1.8904 },
      address: 'Birmingham, UK',
      now_playing: dummyDeviceMedia[15],
      publish_status: 'Unpublished',
      licence: generateLicenceCode(208),
      licence_expiry: generateLicenceExpiry(208),
      resolution: getResolutionForModel('43in Screen'),
    },
  ],
}

/**
 * Recursively collects all devices for an organisation and all its children
 * @param organisation - The organisation object
 * @param devicesData - Object keyed by organisation ID containing arrays of devices
 * @returns Array of all devices (organisation's own devices + all children's devices)
 */
const collectDevicesForOrganisation = (organisation: Organisation, devicesData: Record<string, Device[]>): Device[] => {
  let allDevices: Device[] = []

  // Add this organisation's own devices
  if (devicesData[organisation.id]) {
    allDevices = [...allDevices, ...devicesData[organisation.id]]
  }

  // Recursively add all children's devices
  if (organisation.children) {
    organisation.children.forEach((child) => {
      allDevices = [...allDevices, ...collectDevicesForOrganisation(child, devicesData)]
    })
  }

  return allDevices
}

/**
 * Find an organisation by ID in the organisations tree
 * @param organisations - Array of organisations to search
 * @param id - The organisation ID to find
 * @returns The found organisation or null
 */
const findOrganisationById = (organisations: Organisation[], id: string): Organisation | null => {
  for (const org of organisations) {
    if (org.id === id) return org
    if (org.children) {
      const found = findOrganisationById(org.children, id)
      if (found) return found
    }
  }
  return null
}

/**
 * Get all devices for a specific organisation and all its children
 * @param organisationId - The organisation ID to get devices for
 * @returns Array of devices belonging to the organisation and all its sub-organisations
 */
export const getAllDevices = (organisationId: string): Device[] => {
  /* Likely to be changed with APIs */
  // Find the organisation by ID
  const organisation = findOrganisationById(initialOrganisations, organisationId)

  if (!organisation) {
    // If organisation not found, return empty array
    return []
  }

  // Recursively collect devices from this organisation and all its children
  return collectDevicesForOrganisation(organisation, rawDevicesData)
}

// Media types
export type MediaStandard = {
  id: string
  name: string
  media_type: 'image' | 'video'
  thumbnail_url: '/images/default_avatar.jpeg'
  last_updated: Date
  tags: string[]
  organisation_id: string
  resolution: { width: number; height: number }
  organisation: string
  orientation: 'Portrait' | 'Landscape'
  folder_id?: string // ID of the folder this media belongs to (undefined for root level)
}

export type MediaFolder = {
  id: string
  name: string
  media_type: 'folder'
  last_updated: Date
  item_count: number
  organisation_id: string
  tags: string[]
  organisation: string
  folder_id?: string // ID of the parent folder (undefined for root level)
}

export type Media = MediaStandard | MediaFolder

// Raw media data keyed by organisation ID
// All media items are stored flat, with folder_id indicating parent folder
const rawMediaData: Record<string, Media[]> = {
  pmi: [], // Parent PMI has no direct media
  'pmi-morrisons': [
    // Root level folders
    {
      id: 'media-morrisons-1',
      name: 'IQOS Brand Campaign',
      media_type: 'folder',
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      item_count: 4,
      organisation_id: 'pmi-morrisons',
      tags: ['Campaign', 'IQOS', 'Brand'],
      organisation: 'Morrisons',
    },
    {
      id: 'media-morrisons-4',
      name: 'Promotional Assets',
      media_type: 'folder',
      last_updated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      item_count: 3,
      organisation_id: 'pmi-morrisons',
      tags: ['Promotional', 'Assets'],
      organisation: 'Morrisons',
    },
    // Items inside IQOS Brand Campaign folder
    {
      id: 'media-morrisons-1-1',
      name: 'IQOS Hero Banner',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['IQOS', 'Banner', 'Hero'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-1',
    },
    {
      id: 'media-morrisons-1-2',
      name: 'IQOS Product Video',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['IQOS', 'Video', 'Product'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-1',
    },
    {
      id: 'media-morrisons-1-3',
      name: 'IQOS Logo Variants',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['IQOS', 'Logo'],
      resolution: { width: 1080, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-1',
    },
    {
      id: 'media-morrisons-1-4',
      name: 'IQOS Brand Guidelines',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['IQOS', 'Brand', 'Guidelines'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-1',
    },
    // Items inside Promotional Assets folder
    {
      id: 'media-morrisons-4-1',
      name: 'Summer Sale Banner',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Promotional', 'Summer', 'Sale'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-4',
    },
    {
      id: 'media-morrisons-4-2',
      name: 'Holiday Promo Video',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Promotional', 'Holiday', 'Video'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-4',
    },
    {
      id: 'media-morrisons-4-3',
      name: 'Flash Sale Image',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Promotional', 'Flash Sale'],
      resolution: { width: 2560, height: 720 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
      folder_id: 'media-morrisons-4',
    },
    // Root level items
    {
      id: 'media-morrisons-2',
      name: 'Veev Summer Banner',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Banner', 'Veev', 'Summer'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
    },
    {
      id: 'media-morrisons-3',
      name: 'Product Showcase Video',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Video', 'Product', 'Showcase'],
      resolution: { width: 3840, height: 2160 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
    },
    {
      id: 'media-morrisons-5',
      name: 'Store Header Image',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Store', 'Header'],
      resolution: { width: 2560, height: 720 },
      organisation: 'Morrisons',
      orientation: 'Landscape',
    },
    {
      id: 'media-morrisons-6',
      name: 'Portrait Product Image',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-morrisons',
      tags: ['Product', 'Portrait', 'Display'],
      resolution: { width: 1080, height: 1920 },
      organisation: 'Morrisons',
      orientation: 'Portrait',
    },
  ],
  'pmi-sainsburys': [
    // Root level folders
    {
      id: 'media-sainsburys-1',
      name: 'Customer Services Content',
      media_type: 'folder',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      item_count: 3,
      organisation_id: 'pmi-sainsburys',
      tags: ['Customer Services', 'Content'],
      organisation: 'Sainsburys',
    },
    {
      id: 'media-sainsburys-3',
      name: 'Brand Guidelines',
      media_type: 'folder',
      last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      item_count: 2,
      organisation_id: 'pmi-sainsburys',
      tags: ['Brand', 'Guidelines'],
      organisation: 'Sainsburys',
    },
    {
      id: 'media-sainsburys-5',
      name: 'Digital Signage Assets',
      media_type: 'folder',
      last_updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      item_count: 4,
      organisation_id: 'pmi-sainsburys',
      tags: ['Digital', 'Signage', 'Assets'],
      organisation: 'Sainsburys',
    },
    // Items inside Customer Services Content folder
    {
      id: 'media-sainsburys-1-1',
      name: 'Help Desk Banner',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Customer Services', 'Help Desk'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-1',
    },
    {
      id: 'media-sainsburys-1-2',
      name: 'Support Video Guide',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Customer Services', 'Support', 'Video'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-1',
    },
    {
      id: 'media-sainsburys-1-3',
      name: 'FAQ Infographic',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Customer Services', 'FAQ'],
      resolution: { width: 1080, height: 1920 },
      organisation: 'Sainsburys',
      orientation: 'Portrait',
      folder_id: 'media-sainsburys-1',
    },
    // Items inside Brand Guidelines folder
    {
      id: 'media-sainsburys-3-1',
      name: 'Logo Usage Guide',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Brand', 'Logo', 'Guidelines'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-3',
    },
    {
      id: 'media-sainsburys-3-2',
      name: 'Color Palette Reference',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Brand', 'Color', 'Guidelines'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-3',
    },
    // Items inside Digital Signage Assets folder
    {
      id: 'media-sainsburys-5-1',
      name: 'Store Entrance Display',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Digital', 'Signage', 'Store'],
      resolution: { width: 2560, height: 720 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-5',
    },
    {
      id: 'media-sainsburys-5-2',
      name: 'Aisle Navigation Video',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Digital', 'Signage', 'Navigation'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-5',
    },
    {
      id: 'media-sainsburys-5-3',
      name: 'Product Spotlight Image',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Digital', 'Signage', 'Product'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-5',
    },
    {
      id: 'media-sainsburys-5-4',
      name: 'Promotional Display Banner',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Digital', 'Signage', 'Promotional'],
      resolution: { width: 3840, height: 720 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
      folder_id: 'media-sainsburys-5',
    },
    // Root level items
    {
      id: 'media-sainsburys-2',
      name: 'Zyn Product Image',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Product', 'Zyn', 'Image'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
    },
    {
      id: 'media-sainsburys-4',
      name: 'Counter Display Video',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Counter', 'Display', 'Video'],
      resolution: { width: 1920, height: 1080 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
    },
    {
      id: 'media-sainsburys-6',
      name: 'Promotional Banner',
      media_type: 'image',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Promotional', 'Banner'],
      resolution: { width: 3840, height: 720 },
      organisation: 'Sainsburys',
      orientation: 'Landscape',
    },
    {
      id: 'media-sainsburys-7',
      name: 'Vertical Display Video',
      media_type: 'video',
      thumbnail_url: '/images/default_avatar.jpeg',
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      organisation_id: 'pmi-sainsburys',
      tags: ['Video', 'Vertical', 'Display'],
      resolution: { width: 1080, height: 1920 },
      organisation: 'Sainsburys',
      orientation: 'Portrait',
    },
  ],
}

/**
 * Recursively collects all media for an organisation and all its children
 * @param organisation - The organisation object
 * @param mediaData - Object keyed by organisation ID containing arrays of media
 * @returns Array of all media (organisation's own media + all children's media)
 */
const collectMediaForOrganisation = (organisation: Organisation, mediaData: Record<string, Media[]>): Media[] => {
  let allMedia: Media[] = []

  // Add this organisation's own media
  if (mediaData[organisation.id]) {
    allMedia = [...allMedia, ...mediaData[organisation.id]]
  }

  // Recursively add all children's media
  if (organisation.children) {
    organisation.children.forEach((child) => {
      allMedia = [...allMedia, ...collectMediaForOrganisation(child, mediaData)]
    })
  }

  return allMedia
}

/**
 * Get all media for a specific organisation and all its children
 * @param organisationId - The organisation ID to get media for
 * @param folderId - Optional folder ID to filter media by folder
 * @returns Array of media belonging to the organisation and all its sub-organisations, optionally filtered by folder
 */
export const getAllMedia = (organisationId: string, folderId?: string): Media[] => {
  /* Likely to be changed with APIs */
  // Find the organisation by ID
  const organisation = findOrganisationById(initialOrganisations, organisationId)

  if (!organisation) {
    // If organisation not found, return empty array
    return []
  }

  // Recursively collect media from this organisation and all its children
  const allMedia = collectMediaForOrganisation(organisation, rawMediaData)

  // If folderId is provided, filter to show only items in that folder
  if (folderId) {
    return allMedia.filter((media) => media.folder_id === folderId)
  }

  // Otherwise, return only root level items (no folder_id)
  return allMedia.filter((media) => !media.folder_id)
}

/**
 * Get a folder by ID from all media
 * @param organisationId - The organisation ID
 * @param folderId - The folder ID to find
 * @returns The folder Media object or null if not found
 */
export const getFolderById = (organisationId: string, folderId: string): MediaFolder | null => {
  const organisation = findOrganisationById(initialOrganisations, organisationId)

  if (!organisation) {
    return null
  }

  const allMedia = collectMediaForOrganisation(organisation, rawMediaData)
  const folder = allMedia.find((media) => media.id === folderId && media.media_type === 'folder')

  return (folder as MediaFolder) || null
}

/**
 * Get breadcrumb path for a folder (all parent folders up to root)
 * @param organisationId - The organisation ID
 * @param folderId - The folder ID to get breadcrumbs for
 * @returns Array of folder objects from root to the specified folder
 */
export const getFolderBreadcrumbs = (organisationId: string, folderId: string): MediaFolder[] => {
  const breadcrumbs: MediaFolder[] = []
  let currentFolderId: string | undefined = folderId

  while (currentFolderId) {
    const folder = getFolderById(organisationId, currentFolderId)
    if (!folder) break

    breadcrumbs.unshift(folder) // Add to beginning of array
    currentFolderId = folder.folder_id
  }

  return breadcrumbs
}

// Playlist type
export type TimeTagCondition = {
  type: 'include' | 'exclude'
  days?: number[] // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  time?: {
    start: string // Format: "HH:mm" e.g., "10:00"
    end: string // Format: "HH:mm" e.g., "18:00"
  }
}

export type TimeTag = {
  name: string
  conditions: TimeTagCondition[]
  notes?: string
}

export type TagType = 'content' | 'time'

export type TagRecord = {
  id: string
  name: string
  tag_type: TagType
  organisation: Entity
  last_updated?: Date
  notes?: string
  time_definition?: TimeTag
  color: string // Hex color code
}

export type ActiveBetween = {
  from_date: Date | null
  from_time: string | null // Format: "HH:mm" (e.g., "09:30"), defaults to "00:00" if not set
  to_date: Date | null
  to_time: string | null // Format: "HH:mm" (e.g., "17:00"), defaults to "23:59" if not set
}

export type Playlist = {
  id: string
  name: string
  description: string
  tags: string[]
  time_tag: TimeTag[]
  organisation: Entity
  playing: number
  last_updated: Date
  media_ids: string[] // IDs of media items in this playlist
  active_between: ActiveBetween | null
}

export const timeTagOptions = [
  'Morning',
  'Midday',
  'Afternoon',
  'Evening',
  'Late Night',
  'Weekend',
  'Weekday',
  'Holiday',
]

// Helper to generate time tag conditions
const generateTimeTagConditions = (tagName: string): TimeTagCondition[] => {
  const conditions: TimeTagCondition[] = []

  // Weekend exclusion
  if (tagName === 'Weekend') {
    conditions.push({
      type: 'exclude',
      days: [1, 2, 3, 4, 5], // Sunday and Saturday
    })
  }
  // Morning include
  else if (tagName === 'Morning') {
    conditions.push({
      type: 'include',
      time: { start: '06:00', end: '12:00' },
    })
  }
  // Midday include
  else if (tagName === 'Midday') {
    conditions.push({
      type: 'include',
      time: { start: '12:00', end: '14:00' },
    })
  }
  // Afternoon include
  else if (tagName === 'Afternoon') {
    conditions.push({
      type: 'include',
      time: { start: '14:00', end: '18:00' },
    })
  }
  // Evening include
  else if (tagName === 'Evening') {
    conditions.push({
      type: 'include',
      time: { start: '18:00', end: '22:00' },
    })
  }
  // Late Night include
  else if (tagName === 'Late Night') {
    conditions.push({
      type: 'include',
      time: { start: '22:00', end: '06:00' },
    })
  }
  // Weekday - specific days
  else if (tagName === 'Weekday') {
    conditions.push({
      type: 'include',
      days: [1, 2, 3, 4, 5], // Weekdays
    })
  }
  // Holiday - all days
  else if (tagName === 'Holiday') {
    conditions.push({
      type: 'include',
    })
  }
  // Default: include all day
  else {
    conditions.push({
      type: 'include',
    })
  }

  return conditions
}

const generateTimeTags = (): TimeTag[] => {
  const count = faker.number.int({ min: 0, max: 2 })
  if (count === 0) return []
  const selectedTags = faker.helpers.arrayElements(timeTagOptions, Math.min(count, timeTagOptions.length))
  return selectedTags.map((tagName) => ({
    name: tagName,
    conditions: generateTimeTagConditions(tagName),
  }))
}

const createPlaylist = (
  playlist: Omit<Playlist, 'time_tag' | 'active_between'> & {
    active_between?: Playlist['active_between']
    time_tag?: TimeTag[]
  }
): Playlist => ({
  ...playlist,
  time_tag: playlist.time_tag || generateTimeTags(),
  active_between: playlist.active_between || null,
})

// Raw playlist data keyed by organisation ID
const rawPlaylistBaseData: Record<
  string,
  (Omit<Playlist, 'time_tag' | 'active_between'> & {
    active_between?: Playlist['active_between']
    time_tag?: TimeTag[]
  })[]
> = {
  pmi: [], // Parent PMI has no direct playlists
  'pmi-morrisons': [
    {
      id: 'playlist-morrisons-1',
      name: 'Winter Promo',
      description: 'Promotional content for winter season featuring seasonal products and special offers.',
      tags: ['Promotional', 'Seasonal', 'Winter', 'Sale', 'Holiday', 'Christmas'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 4,
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-1-1', 'media-morrisons-1-2', 'media-morrisons-1-3', 'media-morrisons-1-4'],
      active_between: {
        from_date: new Date(2025, 10, 11),
        from_time: null,
        to_date: new Date(2025, 10, 24),
        to_time: null,
      },
      time_tag: [
        {
          name: 'Weekend',
          conditions: [
            {
              type: 'exclude',
              days: [1, 2, 3, 4, 5], // Sunday and Saturday
            },
          ],
        },
      ],
    },
    {
      id: 'playlist-morrisons-2',
      name: 'Summer Sale',
      description: 'Summer sale promotional materials highlighting discounted products and special deals.',
      tags: ['Sale', 'Promotional'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 3,
      last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-4-1', 'media-morrisons-4-2', 'media-morrisons-4-3'],
      active_between: {
        from_date: new Date(2025, 10, 15),
        from_time: null,
        to_date: new Date(2025, 10, 22),
        to_time: null,
      },
    },
    {
      id: 'playlist-morrisons-3',
      name: 'Holiday Special',
      description: 'Holiday-themed content showcasing seasonal products and festive promotions.',
      tags: ['Holiday', 'Seasonal'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 4,
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-1-1', 'media-morrisons-1-2', 'media-morrisons-4-1', 'media-morrisons-4-2'],
      active_between: {
        from_date: new Date(2025, 10, 15),
        from_time: null,
        to_date: null,
        to_time: null,
      },
    },
    {
      id: 'playlist-morrisons-4',
      name: 'New Arrivals',
      description: 'Latest product launches and newly introduced items to the store.',
      tags: ['New Products', 'Featured'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 2,
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-1-3', 'media-morrisons-1-4'],
      active_between: {
        from_date: null,
        from_time: null,
        to_date: new Date(2025, 10, 22),
        to_time: '16:00',
      },
    },
    {
      id: 'playlist-morrisons-5',
      name: 'Weekly Deals',
      description: 'Weekly promotional content featuring current deals and limited-time offers.',
      tags: ['Deals', 'Weekly'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 3,
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-4-1', 'media-morrisons-4-2', 'media-morrisons-4-3'],
      active_between: null,
    },
    {
      id: 'playlist-morrisons-6',
      name: 'Seasonal Collection',
      description: 'Curated collection of seasonal products and themed promotional content.',
      tags: ['Seasonal', 'Collection'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 2,
      last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-1-1', 'media-morrisons-1-2'],
      active_between: null,
    },
    {
      id: 'playlist-morrisons-7',
      name: 'Featured Products',
      description: 'Showcase of featured and highlighted products with promotional materials.',
      tags: ['Featured', 'Products'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 4,
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-1-1', 'media-morrisons-1-2', 'media-morrisons-1-3', 'media-morrisons-1-4'],
      active_between: null,
    },
    {
      id: 'playlist-morrisons-8',
      name: 'Brand Spotlight',
      description: 'Brand-focused content highlighting key brand messaging and product features.',
      tags: ['Brand', 'Spotlight'],
      organisation: { id: 'pmi-morrisons', name: 'Morrisons' },
      playing: 3,
      last_updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      media_ids: ['media-morrisons-1-1', 'media-morrisons-1-3', 'media-morrisons-1-4'],
      active_between: null,
    },
  ],
  'pmi-sainsburys': [
    {
      id: 'playlist-sainsburys-1',
      name: 'Customer Favorites',
      description: 'Popular products and content based on customer preferences and bestsellers.',
      tags: ['Customer', 'Favorites'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 3,
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-1-1', 'media-sainsburys-1-2', 'media-sainsburys-1-3'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-2',
      name: 'Limited Edition',
      description: 'Exclusive limited edition products and special promotional content.',
      tags: ['Limited', 'Edition'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 2,
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-3-1', 'media-sainsburys-3-2'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-3',
      name: 'Clearance Event',
      description: 'Clearance sale content featuring discounted items and special offers.',
      tags: ['Clearance', 'Event'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 4,
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-1-1', 'media-sainsburys-1-2', 'media-sainsburys-1-3', 'media-sainsburys-3-1'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-4',
      name: 'Flash Sale',
      description: 'Time-limited flash sale promotions with urgent call-to-action messaging.',
      tags: ['Flash Sale', 'Promotional'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 2,
      last_updated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-1-1', 'media-sainsburys-1-2'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-5',
      name: 'Weekend Special',
      description: 'Weekend-exclusive deals and special promotions for weekend shoppers.',
      tags: ['Weekend', 'Special'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 2,
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-3-1', 'media-sainsburys-3-2'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-6',
      name: 'Monthly Highlights',
      description: 'Monthly featured products and highlights showcasing the best of the month.',
      tags: ['Monthly', 'Highlights'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 3,
      last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-1-1', 'media-sainsburys-1-2', 'media-sainsburys-1-3'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-7',
      name: 'Product Launch',
      description: 'New product launch materials and promotional content for recently introduced items.',
      tags: ['Product Launch', 'New'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 5,
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      media_ids: [
        'media-sainsburys-1-1',
        'media-sainsburys-1-2',
        'media-sainsburys-1-3',
        'media-sainsburys-3-1',
        'media-sainsburys-3-2',
      ],
    },
    {
      id: 'playlist-sainsburys-8',
      name: 'Spring Collection',
      description: 'Spring-themed collection featuring seasonal products and spring promotions.',
      tags: ['Spring', 'Collection'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 2,
      last_updated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-3-1', 'media-sainsburys-3-2'],
      active_between: null,
    },
    {
      id: 'playlist-sainsburys-9',
      name: 'Autumn Promo',
      description: 'Autumn promotional content highlighting seasonal products and fall-themed offers.',
      tags: ['Autumn', 'Promotional'],
      organisation: { id: 'pmi-sainsburys', name: 'Sainsburys' },
      playing: 3,
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      media_ids: ['media-sainsburys-1-1', 'media-sainsburys-1-2', 'media-sainsburys-1-3'],
      active_between: null,
    },
  ],
}

const rawPlaylistData: Record<string, Playlist[]> = Object.fromEntries(
  Object.entries(rawPlaylistBaseData).map(([organisationId, playlists]) => [
    organisationId,
    playlists.map((playlist) => createPlaylist(playlist)),
  ])
)

const rawTagRecords: TagRecord[] = [
  {
    id: 'tag-001',
    name: 'Holiday Campaign',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 0, 15),
    notes: 'Used for Christmas and New Year promotional playlists.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-002',
    name: 'Store Launch',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 1, 2),
    notes: 'Highlights new store openings and regional campaigns.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-003',
    name: 'Weekend',
    tag_type: 'time',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 1, 18),
    notes: 'Used for weekend programming.',
    color: TagColors[2], // #86EFAC
    time_definition: {
      name: 'Weekend',
      notes: 'Used for weekend programming.',
      conditions: [
        {
          type: 'include',
          days: [0, 6],
        },
      ],
    },
  },
  {
    id: 'tag-004',
    name: 'Morning Drive',
    tag_type: 'time',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 4),
    notes: 'Targets commuters between 6am and 10am.',
    color: TagColors[3], // #FDE68A
    time_definition: {
      name: 'Morning Drive',
      notes: 'Targets commuters between 6am and 10am.',
      conditions: [
        {
          type: 'include',
          time: { start: '06:00', end: '10:00' },
        },
      ],
    },
  },
  {
    id: 'tag-005',
    name: 'Clearance',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 0, 28),
    notes: 'Applied to aggressive markdown/clearance content.',
    color: TagColors[4], // #D8B4FE
  },
  {
    id: 'tag-006',
    name: 'Late Night',
    tag_type: 'time',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 2, 1),
    notes: 'Used for 22:00 - 06:00 overnight loops.',
    color: TagColors[5], // #F9A8D4
    time_definition: {
      name: 'Late Night',
      notes: 'Used for 22:00 - 06:00 overnight loops.',
      conditions: [
        {
          type: 'include',
          time: { start: '22:00', end: '06:00' },
        },
      ],
    },
  },
  // Device tags
  {
    id: 'tag-007',
    name: 'Convenience',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 0, 10),
    notes: 'Tags devices located in convenience store areas.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-008',
    name: 'Full Gantry',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 0, 12),
    notes: 'Tags devices installed in full gantry locations.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-009',
    name: '4m LED Header',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 0, 14),
    notes: 'Tags devices with 4m LED header displays.',
    color: TagColors[8], // #FDBA74
  },
  {
    id: 'tag-010',
    name: 'Main Store',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 0, 16),
    notes: 'Tags devices located in main store areas.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-011',
    name: '43" Screen',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 0, 18),
    notes: 'Tags devices with 43 inch screen displays.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-012',
    name: 'IQOS',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 0, 20),
    notes: 'Tags related to IQOS brand content and devices.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-013',
    name: 'Veev',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 0, 22),
    notes: 'Tags related to Veev brand content and devices.',
    color: TagColors[2], // #86EFAC
  },
  {
    id: 'tag-014',
    name: 'Plug in Back Wall',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 0, 24),
    notes: 'Tags devices that plug into back wall locations.',
    color: TagColors[3], // #FDE68A
  },
  {
    id: 'tag-015',
    name: 'Customer Services',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 0, 26),
    notes: 'Tags devices and content in customer services areas.',
    color: TagColors[4], // #D8B4FE
  },
  {
    id: 'tag-016',
    name: '4M',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 0, 28),
    notes: 'Tags devices with 4M LED displays.',
    color: TagColors[5], // #F9A8D4
  },
  {
    id: 'tag-017',
    name: '2M',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 1, 1),
    notes: 'Tags devices with 2M LED displays.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-018',
    name: 'Counter Screen',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 1, 3),
    notes: 'Tags devices located at counter screens.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-019',
    name: 'Zyn',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 5),
    notes: 'Tags related to Zyn brand content and devices.',
    color: TagColors[8], // #FDBA74
  },
  // Media tags
  {
    id: 'tag-020',
    name: 'Campaign',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 1, 7),
    notes: 'Tags media used in marketing campaigns.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-021',
    name: 'Brand',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 9),
    notes: 'Tags brand-related media and content.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-022',
    name: 'Promotional',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 11),
    notes: 'Tags promotional media and content.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-023',
    name: 'Assets',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 1, 13),
    notes: 'Tags general media assets.',
    color: TagColors[2], // #86EFAC
  },
  {
    id: 'tag-024',
    name: 'Banner',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 15),
    notes: 'Tags banner-style media content.',
    color: TagColors[3], // #FDE68A
  },
  {
    id: 'tag-025',
    name: 'Hero',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 1, 17),
    notes: 'Tags hero image/video content.',
    color: TagColors[4], // #D8B4FE
  },
  {
    id: 'tag-026',
    name: 'Video',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 19),
    notes: 'Tags video media content.',
    color: TagColors[5], // #F9A8D4
  },
  {
    id: 'tag-027',
    name: 'Product',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 21),
    notes: 'Tags product-related media content.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-028',
    name: 'Logo',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 23),
    notes: 'Tags logo media and brand assets.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-029',
    name: 'Guidelines',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 1, 25),
    notes: 'Tags brand guidelines and style guide content.',
    color: TagColors[8], // #FDBA74
  },
  {
    id: 'tag-030',
    name: 'Summer',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 1, 27),
    notes: 'Tags summer-themed media content.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-031',
    name: 'Sale',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 1),
    notes: 'Tags sale and promotional content.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-032',
    name: 'Flash Sale',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 3),
    notes: 'Tags flash sale promotional content.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-033',
    name: 'Holiday',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 5),
    notes: 'Tags holiday-themed media content.',
    color: TagColors[2], // #86EFAC
  },
  {
    id: 'tag-034',
    name: 'Store',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 7),
    notes: 'Tags store-related media content.',
    color: TagColors[3], // #FDE68A
  },
  {
    id: 'tag-035',
    name: 'Header',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 9),
    notes: 'Tags header-style media content.',
    color: TagColors[4], // #D8B4FE
  },
  {
    id: 'tag-036',
    name: 'Portrait',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 2, 11),
    notes: 'Tags portrait orientation media.',
    color: TagColors[5], // #F9A8D4
  },
  {
    id: 'tag-037',
    name: 'Display',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 2, 13),
    notes: 'Tags display media content.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-038',
    name: 'Content',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 15),
    notes: 'Tags general content media.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-039',
    name: 'Digital',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 17),
    notes: 'Tags digital signage content.',
    color: TagColors[8], // #FDBA74
  },
  {
    id: 'tag-040',
    name: 'Signage',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 19),
    notes: 'Tags digital signage media.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-041',
    name: 'Help Desk',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 21),
    notes: 'Tags help desk related content.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-042',
    name: 'Support',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 23),
    notes: 'Tags customer support content.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-043',
    name: 'FAQ',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 25),
    notes: 'Tags frequently asked questions content.',
    color: TagColors[2], // #86EFAC
  },
  {
    id: 'tag-044',
    name: 'Color',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 2, 27),
    notes: 'Tags color palette and guidelines content.',
    color: TagColors[3], // #FDE68A
  },
  {
    id: 'tag-045',
    name: 'Navigation',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 3, 1),
    notes: 'Tags navigation and wayfinding content.',
    color: TagColors[4], // #D8B4FE
  },
  // Playlist tags
  {
    id: 'tag-046',
    name: 'Seasonal',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 3, 3),
    notes: 'Tags seasonal playlist content.',
    color: TagColors[5], // #F9A8D4
  },
  {
    id: 'tag-047',
    name: 'Winter',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 5),
    notes: 'Tags winter-themed playlist content.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-048',
    name: 'Christmas',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 7),
    notes: 'Tags Christmas-themed playlist content.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-049',
    name: 'New Products',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 9),
    notes: 'Tags playlists featuring new products.',
    color: TagColors[8], // #FDBA74
  },
  {
    id: 'tag-050',
    name: 'Featured',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 3, 11),
    notes: 'Tags featured playlist content.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-051',
    name: 'Deals',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 13),
    notes: 'Tags deal-focused playlist content.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-052',
    name: 'Weekly',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 15),
    notes: 'Tags weekly playlist content.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-053',
    name: 'Collection',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 3, 17),
    notes: 'Tags collection-based playlist content.',
    color: TagColors[2], // #86EFAC
  },
  {
    id: 'tag-054',
    name: 'Products',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 19),
    notes: 'Tags product-focused playlist content.',
    color: TagColors[3], // #FDE68A
  },
  {
    id: 'tag-055',
    name: 'Spotlight',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 3, 21),
    notes: 'Tags spotlight playlist content.',
    color: TagColors[4], // #D8B4FE
  },
  {
    id: 'tag-056',
    name: 'Customer',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 3, 23),
    notes: 'Tags customer-focused playlist content.',
    color: TagColors[5], // #F9A8D4
  },
  {
    id: 'tag-057',
    name: 'Favorites',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 3, 25),
    notes: 'Tags customer favorites playlist content.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-058',
    name: 'Limited',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 3, 27),
    notes: 'Tags limited edition playlist content.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-059',
    name: 'Edition',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 1),
    notes: 'Tags edition-based playlist content.',
    color: TagColors[8], // #FDBA74
  },
  {
    id: 'tag-060',
    name: 'Event',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 3),
    notes: 'Tags event-based playlist content.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-061',
    name: 'Special',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 5),
    notes: 'Tags special playlist content.',
    color: TagColors[0], // #FCA5A5
  },
  {
    id: 'tag-062',
    name: 'Monthly',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 7),
    notes: 'Tags monthly playlist content.',
    color: TagColors[1], // #93C5FD
  },
  {
    id: 'tag-063',
    name: 'Highlights',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 9),
    notes: 'Tags highlights playlist content.',
    color: TagColors[2], // #86EFAC
  },
  {
    id: 'tag-064',
    name: 'Product Launch',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 11),
    notes: 'Tags product launch playlist content.',
    color: TagColors[3], // #FDE68A
  },
  {
    id: 'tag-065',
    name: 'New',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 13),
    notes: 'Tags new playlist content.',
    color: TagColors[4], // #D8B4FE
  },
  {
    id: 'tag-066',
    name: 'Spring',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 15),
    notes: 'Tags spring-themed playlist content.',
    color: TagColors[5], // #F9A8D4
  },
  {
    id: 'tag-067',
    name: 'Autumn',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 17),
    notes: 'Tags autumn-themed playlist content.',
    color: TagColors[6], // #A5B4FC
  },
  {
    id: 'tag-068',
    name: 'Image',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi'),
    last_updated: new Date(2025, 4, 19),
    notes: 'Tags image media content.',
    color: TagColors[7], // #5EEAD4
  },
  {
    id: 'tag-069',
    name: 'Showcase',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 4, 21),
    notes: 'Tags showcase media content.',
    color: TagColors[8], // #FDBA74
  },
  {
    id: 'tag-070',
    name: 'Vertical',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-sainsburys'),
    last_updated: new Date(2025, 4, 23),
    notes: 'Tags vertical orientation media.',
    color: TagColors[9], // #D1D5DB
  },
  {
    id: 'tag-071',
    name: '43" Screen',
    tag_type: 'content',
    organisation: findOrganisationEntity('pmi-morrisons'),
    last_updated: new Date(2025, 4, 25),
    notes: 'Tags devices with 43 inch screen displays.',
    color: TagColors[0], // #FCA5A5
  },
]

/**
 * Recursively collects all playlists for an organisation and all its children
 * @param organisation - The organisation object
 * @param playlistData - Object keyed by organisation ID containing arrays of playlists
 * @returns Array of all playlists (organisation's own playlists + all children's playlists)
 */
const collectPlaylistsForOrganisation = (
  organisation: Organisation,
  playlistData: Record<string, Playlist[]>
): Playlist[] => {
  let allPlaylists: Playlist[] = []

  // Add this organisation's own playlists
  if (playlistData[organisation.id]) {
    allPlaylists = [...allPlaylists, ...playlistData[organisation.id]]
  }

  // Recursively add all children's playlists
  if (organisation.children) {
    organisation.children.forEach((child) => {
      allPlaylists = [...allPlaylists, ...collectPlaylistsForOrganisation(child, playlistData)]
    })
  }

  return allPlaylists
}

/**
 * Get all playlists for a specific organisation and all its children
 * @param organisationId - The organisation ID to get playlists for
 * @returns Array of playlists belonging to the organisation and all its sub-organisations
 */
export const getAllPlaylists = (organisationId: string): Playlist[] => {
  /* Likely to be changed with APIs */
  // Find the organisation by ID
  const organisation = findOrganisationById(initialOrganisations, organisationId)

  if (!organisation) {
    // If organisation not found, return empty array
    return []
  }

  // Recursively collect playlists from this organisation and all its children
  return collectPlaylistsForOrganisation(organisation, rawPlaylistData)
}

/**
 * Get a device by ID
 * @param deviceId - The device ID to find
 * @returns The device object or null if not found
 */
export const getDeviceById = (deviceId: string): Device | null => {
  /* Likely to be changed with APIs */
  // Search through all organisations
  for (const orgId in rawDevicesData) {
    const device = rawDevicesData[orgId].find((d) => d.id === deviceId)
    if (device) return device
  }
  return null
}

/**
 * Get a playlist by ID
 * @param playlistId - The playlist ID to find
 * @returns The playlist object or null if not found
 */
export const getPlaylistById = (playlistId: string): Playlist | null => {
  /* Likely to be changed with APIs */
  // Search through all organisations
  for (const orgId in rawPlaylistData) {
    const playlist = rawPlaylistData[orgId].find((p) => p.id === playlistId)
    if (playlist) return playlist
  }
  return null
}

/**
 * Get ALL media for an organisation (including items in folders)
 * This is different from getAllMedia which filters by folder
 * @param organisationId - The organisation ID
 * @returns Array of all media items (including those in folders)
 */
export const getAllMediaIncludingFolders = (organisationId: string): Media[] => {
  /* Likely to be changed with APIs */
  // Find the organisation by ID
  const organisation = findOrganisationById(initialOrganisations, organisationId)

  if (!organisation) {
    // If organisation not found, return empty array
    return []
  }

  // Recursively collect ALL media from this organisation and all its children
  // This includes items in folders (unlike getAllMedia which filters them out)
  return collectMediaForOrganisation(organisation, rawMediaData)
}

/**
 * Get media items for a specific playlist
 * @param playlistId - The playlist ID
 * @returns Array of media items in the playlist
 */
export const getMediaForPlaylist = (playlistId: string): Media[] => {
  /* Likely to be changed with APIs */
  const playlist = getPlaylistById(playlistId)
  if (!playlist || !playlist.media_ids || playlist.media_ids.length === 0) {
    return []
  }

  // Get ALL media for the playlist's organisation (including items in folders)
  const allMedia = getAllMediaIncludingFolders(playlist.organisation.id)

  // Filter media by the playlist's media_ids
  return allMedia.filter((media) => playlist.media_ids.includes(media.id))
}

export const getAllTags = (): TagRecord[] => {
  /* Likely to be changed with APIs */
  return rawTagRecords.map((tag) => ({
    ...tag,
    organisation: { ...tag.organisation },
    last_updated: tag.last_updated ? new Date(tag.last_updated) : undefined,
    time_definition: tag.time_definition
      ? {
          ...tag.time_definition,
          conditions: tag.time_definition.conditions.map((condition: TimeTagCondition) => ({
            ...condition,
            time: condition.time ? { ...condition.time } : undefined,
          })),
        }
      : undefined,
  }))
}

/**
 * Get tag color from tag name by looking up TagRecord
 * If tag doesn't exist in records, assign a random but deterministic color
 * @param tagName - The tag name to look up
 * @returns The hex color code or a random color if not found
 */
export const getTagColor = (tagName: string): string => {
  /* Likely to be changed with APIs */
  const allTags = getAllTags()
  const tag = allTags.find((t) => t.name.toLowerCase() === tagName.toLowerCase())
  if (tag?.color) {
    return tag.color
  }
  // If tag doesn't exist, assign a random but deterministic color based on tag name
  // This ensures the same tag name always gets the same color
  let hash = 0
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % TagColors.length
  return TagColors[colorIndex]
}

/**
 * Get tag colors for multiple tag names
 * @param tagNames - Array of tag names
 * @returns Record mapping tag names to their colors
 */
export const getTagColors = (tagNames: string[]): Record<string, string> => {
  /* Likely to be changed with APIs */
  const colors: Record<string, string> = {}
  tagNames.forEach((tagName) => {
    colors[tagName] = getTagColor(tagName)
  })
  return colors
}
