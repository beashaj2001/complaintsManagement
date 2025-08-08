import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  FileText,
  Users,
  Settings,
  BarChart3,
  UserCog,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { USER_ROLES } from '../../utils/constants'

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const { user } = useAuth()
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: Object.values(USER_ROLES)
    },
    {
      name: 'Complaints',
      href: '/complaints',
      icon: FileText,
      roles: Object.values(USER_ROLES)
    },
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: Shield,
      roles: [USER_ROLES.ADMIN]
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: [USER_ROLES.ADMIN]
    },
    {
      name: 'Team Management',
      href: '/admin/teams',
      icon: Building2,
      roles: [USER_ROLES.ADMIN]
    },
    {
      name: 'SLA Management',
      href: '/admin/sla',
      icon: Clock,
      roles: [USER_ROLES.ADMIN]
    }
  ]
  
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  )
  
  return (
    <>
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 glass-card border-r-2 border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            className="flex items-center space-x-3"
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-gradient">CMS</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complaint Management</p>
              </div>
            )}
          </motion.div>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item, index) => {
            const isActive = location.pathname === item.href
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 w-5 h-5 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    }`}
                  />
                  <motion.span
                    className="ml-3"
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {!collapsed && item.name}
                  </motion.span>
                  
                  {isActive && (
                    <motion.div
                      className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
        
        {/* User info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <motion.div
            className="flex items-center space-x-3"
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Mobile backdrop */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
    </>
  )
}

export default Sidebar