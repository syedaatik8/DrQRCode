import React from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, QrCode, BarChart3, HelpCircle, Settings, Upload, FileText } from 'lucide-react'
import { HelpModal } from './HelpModal'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Generate QR Code', href: '/generate', icon: QrCode },
  { name: 'Resume Builder', href: '/resume-builder', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const bottomNavigation = [
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const [showHelpModal, setShowHelpModal] = useState(false)

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-800">
        <img 
          src="/favicon-drqrcode.png" 
          alt="Dr. QR Code" 
          className="w-8 h-8 mr-3"
        />
        <div>
          <span className="text-xl font-semibold text-white">Dr. QR Code</span>
          <p className="text-xs text-gray-400">Not A Real Doctor</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-gray-800 space-y-2">
        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          Help
        </button>
        
        <Link
          to="/settings"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
      
      <HelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </div>
  )
}