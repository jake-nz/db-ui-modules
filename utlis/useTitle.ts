import { useEffect } from 'react'

const prefix = process.env.NEXT_PUBLIC_TITLE_PREFIX || ''
const suffix = process.env.NEXT_PUBLIC_TITLE_SUFFIX || ''

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = prefix + title + suffix
  }, [title])
}
