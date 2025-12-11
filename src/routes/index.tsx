import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Check localStorage directly for auth state
    const authStorage = localStorage.getItem('auth-storage')
    let isAuthenticated = false
    
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage)
        isAuthenticated = parsed.state?.isAuthenticated || false
      } catch (e) {
        console.error('Error parsing auth storage:', e)
      }
    }
    
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    } else {
      throw redirect({ to: '/login' })
    }
  },
})
