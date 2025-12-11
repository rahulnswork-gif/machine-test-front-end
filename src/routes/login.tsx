import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const Route = createFileRoute('/login')({
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
    }
  },
  component: LoginForm,
})
