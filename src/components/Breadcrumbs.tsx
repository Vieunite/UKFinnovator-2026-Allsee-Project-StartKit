'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbsProps {
  title?: string
  source?: string | null
}

const Breadcrumbs = ({ title, source }: BreadcrumbsProps) => {
  const pathname = usePathname()
  // const searchParams = useSearchParams()
  // const source = searchParams.get('source')
  const segments = pathname.split('/').filter(Boolean)

  function formatBreadcrumbText(text: string): string {
    return text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const breadcrumbLinks = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')

    const formattedText = formatBreadcrumbText(segment)

    const isLast = index === segments.length - 1

    if (source === 'my-artwork' && !isLast && index !== 0) {
      return (
        <span key={index} className="flex gap-3">
          {`>`}{' '}
          <Link
            href="/my-artwork"
            className="hover:text-textLightMode transition-colors duration-100 dark:hover:text-white"
          >
            My Artwork
          </Link>
        </span>
      )
    } else if (source === 'my-artwork' && !isLast) return

    if (source === 'featured-artist' && segment === 'artists') {
      return (
        <span key={index} className="flex gap-3">
          {`>`}{' '}
          <Link
            href="/discover/featured-artists"
            className="hover:text-textLightMode transition-colors duration-100 dark:hover:text-white"
          >
            Featured Artists
          </Link>
        </span>
      )
    }

    if (source === 'featured-playlists' && segment === 'playlists') {
      return (
        <span key={index} className="flex gap-3">
          {`>`}{' '}
          <Link
            href="/discover/featured-playlists"
            className="hover:text-textLightMode transition-colors duration-100 dark:hover:text-white"
          >
            Featured Playlists
          </Link>
        </span>
      )
    }

    return (
      <span key={index} className="flex gap-3">
        {isLast ? (
          <>
            {`>`}{' '}
            <p className="dark:text-textDarkMode text-textLightMode max-w-64 truncate">
              {title ? title : formattedText}
            </p>
          </>
        ) : (
          <>
            {`>`}{' '}
            <Link
              href={href}
              className="hover:text-textLightMode max-w-64 truncate transition-colors duration-100 dark:hover:text-white"
            >
              {formattedText}
            </Link>
          </>
        )}
      </span>
    )
  })

  return (
    <div className="dark:text-componentOutline-light flex flex-wrap gap-3 whitespace-nowrap text-xs text-[#78716C]">
      <Link href="/" className="hover:text-textLightMode transition-colors duration-100 dark:hover:text-white">
        Home
      </Link>
      {breadcrumbLinks}
    </div>
  )
}

export default Breadcrumbs
