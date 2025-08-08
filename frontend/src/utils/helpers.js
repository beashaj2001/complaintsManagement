import { formatDistanceToNow, parseISO, isAfter, differenceInHours } from 'date-fns'

// Date formatting utilities
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
  } catch (error) {
    return 'Invalid date'
  }
}

// SLA utilities
export const calculateSLAStatus = (createdAt, slaHours) => {
  if (!createdAt || !slaHours) return { status: 'unknown', timeLeft: 0, isBreached: false }
  
  try {
    const created = parseISO(createdAt)
    const slaDeadline = new Date(created.getTime() + (slaHours * 60 * 60 * 1000))
    const now = new Date()
    
    const isBreached = isAfter(now, slaDeadline)
    const timeLeft = Math.max(0, differenceInHours(slaDeadline, now))
    
    let status = 'safe'
    if (isBreached) {
      status = 'breached'
    } else if (timeLeft <= 2) {
      status = 'critical'
    } else if (timeLeft <= 4) {
      status = 'warning'
    }
    
    return { status, timeLeft, isBreached }
  } catch (error) {
    return { status: 'unknown', timeLeft: 0, isBreached: false }
  }
}

export const formatSLATime = (hours) => {
  if (hours === 0) return 'Expired'
  if (hours < 1) return `${Math.round(hours * 60)} minutes`
  if (hours === 1) return '1 hour'
  if (hours < 24) return `${hours} hours`
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  if (days === 1 && remainingHours === 0) return '1 day'
  if (remainingHours === 0) return `${days} days`
  
  return `${days}d ${remainingHours}h`
}

// Text utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const capitalizeFirst = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatCamelCase = (string) => {
  if (!string) return ''
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = key.split('.').reduce((obj, k) => obj?.[k], a)
    const bValue = key.split('.').reduce((obj, k) => obj?.[k], b)
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Number utilities
export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0'
  return new Intl.NumberFormat('en-US').format(number)
}

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}

// Color utilities
export const getStatusColor = (status) => {
  const colors = {
    open: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50',
    inprocess: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50',
    pending: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50',
    closed: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50'
  }
  return colors[status] || colors.open
}

export const getSeverityColor = (severity) => {
  const colors = {
    low: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/50',
    medium: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50',
    high: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50',
    critical: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50'
  }
  return colors[severity] || colors.medium
}

export const getSLAColor = (status) => {
  const colors = {
    safe: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-orange-600 dark:text-orange-400',
    breached: 'text-red-600 dark:text-red-400',
    unknown: 'text-gray-600 dark:text-gray-400'
  }
  return colors[status] || colors.unknown
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone) && phone.length >= 10
}

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting ${key} to localStorage:`, error)
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Theme utilities
export const getThemeColors = (isDark) => ({
  background: isDark ? '#111827' : '#F9FAFB',
  surface: isDark ? '#1F2937' : '#FFFFFF',
  text: {
    primary: isDark ? '#F9FAFB' : '#111827',
    secondary: isDark ? '#D1D5DB' : '#6B7280'
  },
  border: isDark ? '#374151' : '#E5E7EB'
})