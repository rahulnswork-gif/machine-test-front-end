import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '../api/authApi'
import { useAuthStore } from '@/store/useAuthStore'
import type { LoginRequest, RegisterRequest } from '@/types/api'

export const useLogin = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (_data, credentials) => {
      // Store user info in Zustand
      login({
        id: '1', // We'll get this from a separate /me endpoint if available
        name: credentials.username,
        email: credentials.username,
      })
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      console.error('Login failed:', error)
      // Error will be handled in the component
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: async (user, variables) => {
      // After successful registration, log the user in
      try {
        await authApi.login({
          username: variables.email,
          password: variables.password,
        })
        
        login({
          id: user.id.toString(),
          name: user.email || 'User',
          email: user.email || '',
        })
        
        navigate({ to: '/dashboard' })
      } catch (error) {
        console.error('Auto-login after registration failed:', error)
        navigate({ to: '/login' })
      }
    },
    onError: (error: any) => {
      console.error('Registration failed:', error)
    },
  })
}
