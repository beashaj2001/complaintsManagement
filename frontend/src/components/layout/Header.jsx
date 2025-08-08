import React from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  MessageCircle,
  LogOut,
  User,
  Settings
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Button from '../common/Button'

const Header = ({ onToggleSidebar, onToggleChatbot, chatbotOpen }) => {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <motion.header
      className="glass-card border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            onClick={onToggleSidebar}
            icon={Menu}
            className="lg:hidden"
          />
          
          {/* Search bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search complaints..."
              className="pl-10 pr-4 py-2 w-64 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="small"
            icon={Bell}
            className="relative"
          >
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></span>
          </Button>
          
          {/* Chatbot toggle */}
          {onToggleChatbot && (
            <Button
              variant={chatbotOpen ? "primary" : "ghost"}
              size="small"
              onClick={onToggleChatbot}
              icon={MessageCircle}
              className="relative"
            />
          )}
          
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="small"
            onClick={toggleTheme}
            icon={isDark ? Sun : Moon}
          />
          
          {/* User menu */}
          <div className="relative">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logout button */}
          <Button
            variant="ghost"
            size="small"
            onClick={logout}
            icon={LogOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </div>
      </div>
    </motion.header>
  )
}

export default Header