const SkeletonCell = ({ width = 40 }: { width?: number }) => {
  return <div className={`h-4 w-${width} animate-pulse rounded bg-gray-200 dark:bg-gray-700`} />
}

export default SkeletonCell
