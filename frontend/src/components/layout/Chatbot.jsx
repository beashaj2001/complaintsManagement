import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Lightbulb,
  Minimize2,
  Maximize2
} from 'lucide-react'
import Button from '../common/Button'
import { chatbotAPI } from '../../utils/api'
import toast from 'react-hot-toast'

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant. I can help you find customer information, account details, and transaction history. What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // Load suggestions on mount
  useEffect(() => {
    if (isOpen) {
      loadSuggestions()
      // Focus input when chatbot opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])
  
  const loadSuggestions = async () => {
    try {
      const response = await chatbotAPI.getSuggestions()
      setSuggestions(response.data.suggestions || [])
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    }
  }
  
  const sendMessage = async (message = inputValue) => {
    if (!message.trim()) return
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    
    try {
      const response = await chatbotAPI.query({
        query: message
      })
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        data: response.data.data,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get response from chatbot')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date()
      }
    ])
  }
  
  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }
  
  const renderMessageData = (data) => {
    if (!data) return null
    
    return (
      <motion.div
        className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <pre className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {JSON.stringify(data, null, 2)}
        </pre>
      </motion.div>
    )
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed right-4 bottom-4 z-50 glass-card shadow-2xl ${
            isMinimized ? 'w-80 h-16' : 'w-80 h-96'
          }`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  AI Assistant
                </h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsMinimized(!isMinimized)}
                icon={isMinimized ? Maximize2 : Minimize2}
                className="!p-1"
              />
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                icon={X}
                className="!p-1"
              />
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary-600' 
                          : 'bg-gradient-to-br from-secondary-500 to-secondary-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-3 h-3 text-white" />
                        ) : (
                          <Bot className="w-3 h-3 text-white" />
                        )}
                      </div>
                      
                      <div>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {renderMessageData(message.data)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="px-4 pb-2">
                  <div className="flex items-center space-x-1 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Quick actions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(suggestion)}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => sendMessage()}
                    disabled={isLoading || !inputValue.trim()}
                    icon={Send}
                    className="!p-2"
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Chatbot