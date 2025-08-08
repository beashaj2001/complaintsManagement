import React from 'react'
import { motion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

const Button = ({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  disabled = false,
  loading = false,
  animate = true,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg focus:ring-primary-500',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white shadow-md hover:shadow-lg focus:ring-secondary-500',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-md hover:shadow-lg focus:ring-accent-500',
    success: 'bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white shadow-md hover:shadow-lg focus:ring-success-500',
    warning: 'bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-white shadow-md hover:shadow-lg focus:ring-warning-500',
    error: 'bg-gradient-to-r from-error-600 to-error-700 hover:from-error-700 hover:to-error-800 text-white shadow-md hover:shadow-lg focus:ring-error-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500',
    outline: 'bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-600 hover:border-primary-400 dark:hover:border-primary-500 focus:ring-primary-500',
    link: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline focus:ring-primary-500 p-0',
    glass: 'glass hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-800 dark:text-gray-200 shadow-lg hover:shadow-xl focus:ring-primary-500'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm rounded-md',
    default: 'px-4 py-2 text-sm rounded-lg',
    large: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-xl'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const handleClick = (e) => {
    if (disabled || loading) return
    onClick?.(e)
  }
  
  const buttonContent = (
    <>
      {loading && (
        <LoadingSpinner size="small" />
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      <span className={loading ? 'ml-2' : ''}>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </>
  )
  
  if (animate) {
    return (
      <motion.button
        className={classes}
        onClick={handleClick}
        disabled={disabled || loading}
        type={type}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }
  
  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {buttonContent}
    </button>
  )
}

export default Button