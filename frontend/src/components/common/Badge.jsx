import React from 'react'
import { motion } from 'framer-motion'

const Badge = ({ 
  variant = 'default', 
  size = 'default', 
  children, 
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full border'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    primary: 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/50 dark:text-primary-300 dark:border-primary-700',
    secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200 dark:bg-secondary-900/50 dark:text-secondary-300 dark:border-secondary-700',
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700',
    error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
    info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
    glass: 'glass border-white/20 dark:border-gray-700/50 text-gray-800 dark:text-gray-200'
  }
  
  const sizes = {
    small: 'px-2.5 py-0.5 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-1.5 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const Component = animate ? motion.span : 'span'
  const motionProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 }
  } : {}
  
  return (
    <Component className={classes} {...motionProps} {...props}>
      {children}
    </Component>
  )
}

export default Badge