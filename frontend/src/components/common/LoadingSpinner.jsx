import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'default', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  const containerClasses = {
    small: 'p-2',
    default: 'p-8',
    large: 'p-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <motion.div
        className={`border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {message && (
        <motion.p
          className="mt-4 text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default LoadingSpinner