import { useEffect } from 'react'

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = 'CNP - ' + title
  }, [title])
}
