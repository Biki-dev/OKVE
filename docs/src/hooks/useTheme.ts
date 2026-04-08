import { useEffect } from 'react'

const THEME_KEY = 'okve-theme'

export function useTheme() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem(THEME_KEY, 'dark')
  }, [])

  return undefined
}
