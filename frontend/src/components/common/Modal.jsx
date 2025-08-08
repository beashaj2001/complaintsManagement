import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  footer,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  const sizes = {
    small: 'max-w-md',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          
          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className={`glass-card w-full ${sizes[size]} relative ${className}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 pb-4">
                  {title && (
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={onClose}
                      icon={X}
                      className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    />
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="px-6 pb-6">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 rounded-b-xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal