import { useAuth } from '@/context/AuthContext'
import { Organisation, useOrganisation } from '@/context/OrganisationContext'
import { BuildingOfficeIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// import type { Organisation } from '@/context/OrganisationContext'

const OrganisationDropdown = () => {
  const { organisations, selectedOrganisation, setSelectedOrganisation, getOrganisationById } = useOrganisation()
  const { user } = useAuth()

  // Filter organisations based on user's organization
  const availableOrganisations = useMemo(() => {
    if (!user?.organisationId) return organisations

    const userOrg = getOrganisationById(user.organisationId)
    if (!userOrg) return organisations

    // If user belongs to Allsee Technologies, they can see both
    if (userOrg.id === 'allsee-technologies') {
      return organisations
    }

    // If user belongs to Allsee Birmingham, they can only see their own org
    if (userOrg.id === 'allsee-birmingham') {
      return [userOrg] // Return only their organization
    }

    // Default: return all
    return organisations
  }, [user, organisations, getOrganisationById])

  // Note: Organization selection logic is handled in OrganisationContext
  // This component only displays the filtered list based on user permissions
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const [search, setSearch] = useState('')
  // Collect all org ids (for open-by-default)
  const collectIds = useCallback((nodes: Organisation[]): string[] => {
    const out: string[] = []
    for (const n of nodes) {
      out.push(n.id)
      if (n.children) out.push(...collectIds(n.children))
    }
    return out
  }, [])
  const allIds = useMemo(() => collectIds(availableOrganisations), [availableOrganisations, collectIds])
  const topLevelIds = useMemo(() => availableOrganisations.map((o) => o.id), [availableOrganisations])
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allIds))

  // Close dropdown when clicking outside (including portal menu)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (dropdownRef.current && dropdownRef.current.contains(target)) return
      if (menuRef.current && menuRef.current.contains(target)) return
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Position menu using portal just below the button
  useEffect(() => {
    const updatePosition = () => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuRect({ top: rect.bottom + 6, left: rect.left, width: rect.width })
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  }, [isOpen])

  const handleOrganisationSelect = (organisation: Organisation) => {
    // If selecting the same organisation, just close the dropdown
    if (selectedOrganisation?.id === organisation.id) {
      setIsOpen(false)
      return
    }

    // Different organisation - set switching flag, update organisation, and close dropdown
    setSelectedOrganisation(organisation)
    setIsOpen(false)
  }

  // Filter tree by search (case-insensitive). Returns a pruned tree that matches.
  const filterTree = useCallback((nodes: Organisation[], term: string): Organisation[] => {
    if (!term.trim()) return nodes
    const lower = term.toLowerCase()
    const next: Organisation[] = []
    for (const node of nodes) {
      const nameMatches = node.name.toLowerCase().includes(lower)
      const children = node.children ? filterTree(node.children, term) : []
      if (nameMatches || children.length > 0) {
        next.push({ ...node, children })
      }
    }
    return next
  }, [])

  const filtered = useMemo(
    () => filterTree(availableOrganisations, search),
    [search, filterTree, availableOrganisations]
  )

  // Auto-expand based on search term length
  useEffect(() => {
    if (!search.trim()) {
      // No search: expand all
      setExpanded(new Set(allIds))
    } else if (search.length < 3) {
      // Short search (1-2 chars): only top-level expanded
      setExpanded(new Set(topLevelIds))
    } else {
      // Longer search (3+ chars): expand matching nodes and their ancestors
      const matchingIds = new Set<string>()
      const collectMatchingAndAncestors = (nodes: Organisation[], term: string, parentIds: string[] = []): void => {
        const lower = term.toLowerCase()
        for (const node of nodes) {
          const currentPath = [...parentIds, node.id]
          const nameMatches = node.name.toLowerCase().includes(lower)
          const hasMatchingChildren =
            node.children && node.children.some((child) => child.name.toLowerCase().includes(lower))
          if (nameMatches || hasMatchingChildren) {
            // Add this node and all its ancestors
            currentPath.forEach((id) => matchingIds.add(id))
            if (node.children) {
              collectMatchingAndAncestors(node.children, term, currentPath)
            }
          } else if (node.children) {
            collectMatchingAndAncestors(node.children, term, currentPath)
          }
        }
      }
      collectMatchingAndAncestors(availableOrganisations, search)
      setExpanded(matchingIds)
    }
  }, [search, allIds, topLevelIds, availableOrganisations])

  // Indentation constants
  const LEFT_GUTTER = 2
  const INDENT_STEP = 16
  const CARET_TOTAL = 18

  const renderTree = (nodes: Organisation[], depth = 0) => {
    return (
      <div className="flex flex-col">
        {nodes.map((org) => {
          const isSelected = selectedOrganisation?.id === org.id
          const hasChildren = !!org.children && org.children.length > 0
          const isExpanded = expanded.has(org.id)
          return (
            <div key={org.id} className="flex flex-col">
              <div className="flex items-stretch">
                {hasChildren ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded((prev) => {
                        const next = new Set(prev)
                        if (next.has(org.id)) next.delete(org.id)
                        else next.add(org.id)
                        return next
                      })
                    }}
                    className={`flex items-center rounded-sm px-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-gray-200`}
                    style={{ paddingLeft: `${LEFT_GUTTER + depth * INDENT_STEP}px` }}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDownIcon
                      className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                    />
                  </button>
                ) : (
                  <div style={{ width: `${LEFT_GUTTER + depth * INDENT_STEP + CARET_TOTAL}px` }} />
                )}
                <button
                  onClick={() => handleOrganisationSelect(org)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors lg:text-sm ${
                    isSelected
                      ? 'bg-primary text-white dark:bg-primary'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-zinc-800'
                  }`}
                  title={org.name}
                >
                  <BuildingOfficeIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="truncate">{org.name}</span>
                  {isSelected && (
                    <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-[10px] lg:text-[11px]">
                      Selected
                    </span>
                  )}
                </button>
              </div>
              {hasChildren && isExpanded && (
                <div className="border-l border-gray-200 dark:border-gray-700">
                  {renderTree(org.children!, depth + 1)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[330px]" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-md bg-white px-3 py-2 shadow-md transition-colors hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <span className="flex items-center gap-2 text-textLightMode dark:text-textDarkMode">
          <BuildingOfficeIcon className="h-4 w-4 lg:h-5 lg:w-5" />
          <p className="text-xs lg:text-sm">{selectedOrganisation?.name || 'Select Organisation'}</p>
        </span>
        <span
          className={`rounded-full border-[2px] border-black p-[1px] text-textLightMode transition-transform dark:border-white dark:text-textDarkMode ${isOpen ? 'rotate-180' : ''}`}
        >
          <ChevronDownIcon className="h-3 w-3 stroke-[2.5]" />
        </span>
      </button>

      {/* Floating Selector via Portal */}
      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="z-[60] rounded-md border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-zinc-900"
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuRect?.top ?? 0,
              left: menuRect?.left ?? 0,
              width: menuRect?.width ?? 320,
              minWidth: 300,
            }}
          >
            {/* Current selection header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
              <span className="truncate">Current: {selectedOrganisation?.name || 'None'}</span>
            </div>

            {/* Search */}
            <div className="border-b border-gray-200 p-2 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search organisations..."
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-zinc-800 dark:text-textDarkMode"
                />
              </div>
            </div>

            {/* Top-level grouping separator for clarity */}
            <div className="flex max-h-80 overflow-y-auto py-1">
              {filtered.map((top) => (
                <div key={top.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                  {/* Top-level row */}
                  {renderTree([top])}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default OrganisationDropdown
