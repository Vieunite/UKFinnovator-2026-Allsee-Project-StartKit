import React from 'react'

type TableHeadProps = React.ComponentPropsWithoutRef<'thead'>

const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(({ className = '', ...props }, ref) => (
  <thead ref={ref} className={` ${className}`} {...props} />
))

TableHead.displayName = 'TableHead'

export default TableHead
