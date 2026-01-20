import { useCallback, useRef } from 'react'

const useTimeoutMessage = (setMessage: (message: string | null) => void, duration = 3000) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showMessage = useCallback(
    (message: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setMessage(message)

      timeoutRef.current = setTimeout(() => {
        setMessage(null)
        timeoutRef.current = null
      }, duration)
    },
    [setMessage, duration]
  )

  return showMessage
}

export default useTimeoutMessage
