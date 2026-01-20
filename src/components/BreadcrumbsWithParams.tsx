'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Breadcrumbs from './Breadcrumbs'

const BreadcrumbsParams = ({ title }: { title?: string }) => {
  const searchParams = useSearchParams()
  const source = searchParams.get('source')
  //removedconsole.log('source', source)

  return <Breadcrumbs title={title} source={source} />
}

const BreadcrumbsWithParams = ({ title }: { title?: string }) => {
  return (
    <Suspense>
      <BreadcrumbsParams title={title} />
    </Suspense>
  )
}

export default BreadcrumbsWithParams
