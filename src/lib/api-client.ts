import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.user) {
          // Token is stored separately, we'll add it from the response
          const accessToken = localStorage.getItem('access_token')
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
          }
        }
      } catch (error) {
        console.error('Error parsing auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (error.response?.status === 403) {
        useAuthStore.getState().logout()
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const accessToken = localStorage.getItem('access_token')
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)

        apiClient.defaults.headers.common['Authorization'] =
          'Bearer ' + access_token
        originalRequest.headers['Authorization'] = 'Bearer ' + access_token

        processQueue(null, access_token)
        return apiClient(originalRequest)
      } catch (err) {
        processQueue(err, null)
        useAuthStore.getState().logout()
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status !== 401 && error.response?.status !== 403) {
      const message = error.response?.data?.detail || 'An unexpected error occurred'
      useToastStore.getState().addToast(message, 'error')
    }

    return Promise.reject(error)
  }
)

export default apiClient
