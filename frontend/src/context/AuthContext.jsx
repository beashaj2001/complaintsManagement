import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { apiClient } from '../utils/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Get current user
  const getCurrentUser = async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await apiClient.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to get current user:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await apiClient.post('/auth/login', {
        email,
        password
      })
      
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      setToken(access_token)
      
      // Get user data
      await getCurrentUser()
      
      toast.success('Login successful! Welcome back! 🎉')
      return true
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true)
      await apiClient.post('/auth/register', userData)
      
      toast.success('Registration successful! Please login.')
      return true
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }

  // Initialize auth state
  useEffect(() => {
    getCurrentUser()
  }, [])

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}