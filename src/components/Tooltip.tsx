import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Tooltip component for showing full text on hover
interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  content: string
  show: boolean
  className?: string
  tooltipClassName?: string
  noWrap?: boolean
  usePortal?: boolean
  delay?: number // Delay in milliseconds before showing tooltip
}

const Tooltip = ({
  children,
  content,
  show,
  className,
  tooltipClassName,
  noWrap,
  usePortal = false,
  delay = 0,
  ...rest
}: TooltipProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isHovered && triggerRef.current && usePortal) {
      const rect = triggerRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8, // 8px gap from the sidebar
      })
    }
  }, [isHovered, usePortal])

  const handleMouseEnter = () => {
    if (delay > 0) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true)
      }, delay)
    } else {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovered(false)
  }

  // Portal-based tooltip (for sidebar icons)
  const portalTooltipElement = usePortal && show && isHovered && (
    <div
      className={`pointer-events-none fixed z-[9999] min-h-6 min-w-6 max-w-xs -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700 ${tooltipClassName}`}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
    >
      <div className={` ${noWrap ? '' : 'whitespace-normal break-all'}`}>{content}</div>
      <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-gray-700" />
    </div>
  )

  // Regular tooltip (original behavior)
  // Use state-based visibility when delay is provided, otherwise use CSS group-hover for immediate display
  const regularTooltipElement = !usePortal && (
    <div
      className={`pointer-events-none absolute left-0 top-full z-50 mt-1 min-h-6 min-w-6 max-w-xs rounded-md bg-gray-900 px-2 py-1 text-xs text-white transition-opacity dark:bg-gray-700 ${tooltipClassName} ${
        delay > 0
          ? show && isHovered
            ? 'opacity-100'
            : 'opacity-0'
          : show
            ? 'opacity-0 group-hover:opacity-100'
            : 'opacity-0'
      }`}
    >
      <div className={` ${noWrap ? '' : 'whitespace-normal break-all'}`}>{content}</div>
      <div className="absolute -top-1 left-3 h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700" />
    </div>
  )

  return (
    <>
      <div
        ref={triggerRef}
        className={`group relative inline-block w-full ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
        {regularTooltipElement}
      </div>
      {usePortal && typeof window !== 'undefined' && createPortal(portalTooltipElement, document.body)}
    </>
  )
}

export default Tooltip
