import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

const Input = forwardRef(({
  label,
  error,
  helper,
  icon: Icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  animate = true,
  required = false,
  ...props
}, ref) => {
  const inputClasses = `
    input-field 
    ${Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-500'}
    ${className}
  `
  
  const InputComponent = animate ? motion.input : 'input'
  const inputProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  } : {}
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} pl-3 pr-3 flex items-center pointer-events-none`}>
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <InputComponent
          ref={ref}
          type={type}
          className={inputClasses}
          {...inputProps}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helper}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input