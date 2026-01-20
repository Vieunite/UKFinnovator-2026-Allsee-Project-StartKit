import React from 'react'

type TableHeadRowProps = React.ComponentPropsWithoutRef<'tr'>

const TableHeadRow = React.forwardRef<HTMLTableRowElement, TableHeadRowProps>(({ className = '', ...props }, ref) => (
  <tr
    ref={ref}
    className={`text-muted-foreground sticky top-0 z-10 border-b border-gray-200 text-left text-sm font-medium dark:border-gray-800 ${className}`}
    {...props}
  />
))

TableHeadRow.displayName = 'TableHeadRow'

export default TableHeadRow
