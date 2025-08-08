import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import Chatbot from './Chatbot'
import { useAuth } from '../../context/AuthContext'
import { USER_ROLES } from '../../utils/constants'

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const { user } = useAuth()
  
  const showChatbot = user && [USER_ROLES.OPS_MEMBER, USER_ROLES.TEAM_LEAD, USER_ROLES.MANAGER].includes(user.role)
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggleChatbot={showChatbot ? () => setChatbotOpen(!chatbotOpen) : null}
          chatbotOpen={chatbotOpen}
        />
        
        <motion.main
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      {showChatbot && (
        <Chatbot 
          isOpen={chatbotOpen} 
          onClose={() => setChatbotOpen(false)} 
        />
      )}
    </div>
  )
}

export default Layout