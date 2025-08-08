import React from 'react'
import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  padding = 'default',
  hover = true,
  glass = false,
  animate = true,
  ...props
}) => {
  const baseClasses = 'rounded-xl shadow-sm border transition-all duration-300'
  
  const backgroundClasses = glass 
    ? 'glass border-white/20 dark:border-gray-700/50'
    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  
  const hoverClasses = hover 
    ? 'hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1'
    : ''
  
  const paddingClasses = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  }
  
  const classes = `${baseClasses} ${backgroundClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`
  
  if (animate) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card