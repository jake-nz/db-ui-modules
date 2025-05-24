'use client'
import { useEffect, useState } from 'react'

type Release = 'production' | 'previous' | 'development'

const production = process.env.NEXT_PUBLIC_PROD_URL
const previous = process.env.NEXT_PUBLIC_PREV_URL

if (!production) console.warn('NEXT_PUBLIC_PROD_URL not set')
if (!previous) console.warn('NEXT_PUBLIC_PREV_URL not set')

const toHostname = (url: string | undefined) => (url ? new URL(url).hostname : null)

const getCurrnetRelease = () => {
  // If we don't know the production URL we can't switch to it so there's no point showing we are in another env
  if (!production) return 'production'

  const hostname = window.location.hostname
  switch (hostname) {
    // Treat localhost as production to mirror prod and show no warning
    case 'localhost':
    case toHostname(production):
      return 'development'
    case toHostname(previous):
      return 'previous'
    default:
      return 'development'
  }
}

export const useRelease = () => {
  // Default to production because other envs display a warning
  const [currentRelease, setRelease] = useState<Release>('production')
  useEffect(() => setRelease(getCurrnetRelease()), [])
  return { currentRelease, production, previous }
}
