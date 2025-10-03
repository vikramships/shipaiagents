'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = saved ? saved === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    updateTheme(shouldBeDark)
  }, [])

  const updateTheme = (dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    updateTheme(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors cursor-pointer"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </button>
  )
}