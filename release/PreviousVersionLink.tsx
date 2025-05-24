import { Button } from 'antd'
import Link from 'next/link'
import { useRelease } from './useRelease'

export const PreviousVersionLink = () => {
  const { currentRelease, previous } = useRelease()

  // If we don't know the previous URL we can't show a link
  // Also, if we're not in production we don't want to show a link
  if (!previous || currentRelease !== 'production') return null

  return (
    <Link href={previous}>
      <Button type="link">Use previous version</Button>
    </Link>
  )
}
