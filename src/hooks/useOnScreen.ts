import { RefObject, useEffect, useRef, useState } from 'react'

export default function useOnScreen(ref: RefObject<HTMLElement>, loading: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), { threshold: 1.0 })
  }, [loading])

  useEffect(() => {
    let refCurrent = ref.current

    if (!observerRef.current || !refCurrent) return

    observerRef.current.observe(refCurrent)

    return () => {
      if (!observerRef.current || !refCurrent) return
      observerRef.current.disconnect()
    }
  }, [ref, loading])

  return isOnScreen
}
