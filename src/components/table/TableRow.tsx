import React from 'react'

type TableRowProps = React.ComponentPropsWithoutRef<'tr'>

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className = '', ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b border-gray-200 transition-colors last:border-0 hover:bg-blue-100/50 dark:border-gray-700/50 dark:hover:bg-blue-900/40 ${className}`}
    {...props}
  />
))

TableRow.displayName = 'TableRow'

export default TableRow
