'use client'
import { Button } from 'antd'
import Link from 'next/link'
import { useRelease } from './useRelease'
import { usePathname } from 'next/navigation'

export const PreviousVersionLink = () => {
  const { currentRelease, previous } = useRelease()
  const pathname = usePathname()

  // If we don't know the previous URL we can't show a link
  // Also, if we're not in production we don't want to show a link
  if (!previous || currentRelease !== 'production') return null

  return (
    <Link href={`${previous}${pathname}`}>
      <Button type="link">Use previous version</Button>
    </Link>
  )
}
