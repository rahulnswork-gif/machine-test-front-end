import apiClient from '@/lib/api-client'
import type { LoginRequest, RegisterRequest, Token, User } from '@/types/api'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<Token> => {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await apiClient.post<Token>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    
    // Store the access token
    localStorage.setItem('access_token', response.data.access_token)
    
    return response.data
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', userData)
    return response.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('access_token')
  },

  refreshToken: async (): Promise<Token> => {
    const response = await apiClient.post<Token>('/auth/refresh')
    localStorage.setItem('access_token', response.data.access_token)
    return response.data
  },
}
