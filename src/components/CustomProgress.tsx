'use client'

interface CustomProgressProps {
  value: number
  className?: string
}

export const CustomProgress = ({ value, className = '' }: CustomProgressProps) => {
  const percentage = Math.min(Math.max(value, 0), 100)

  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 ${className}`}>
      <div
        className="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-r from-primary to-primaryHighlight transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      >
        <div className="animate-progress absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]" />
      </div>
    </div>
  )
}
