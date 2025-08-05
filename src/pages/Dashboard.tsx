import React from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { QrCode, BarChart3, Users, TrendingUp } from 'lucide-react'

const stats = [
  {
    name: 'Total QR Codes',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: QrCode,
  },
  {
    name: 'Total Scans',
    value: '1,429',
    change: '+8.2%',
    changeType: 'positive',
    icon: BarChart3,
  },
  {
    name: 'Active Users',
    value: '89',
    change: '+3.1%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Conversion Rate',
    value: '12.5%',
    change: '+2.4%',
    changeType: 'positive',
    icon: TrendingUp,
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'QR Code Created',
    description: 'Website QR Code for landing page',
    time: '2 hours ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'QR Code Scanned',
    description: 'Menu QR Code scanned 15 times',
    time: '4 hours ago',
    status: 'info',
  },
  {
    id: 3,
    type: 'QR Code Updated',
    description: 'Contact QR Code information updated',
    time: '1 day ago',
    status: 'warning',
  },
  {
    id: 4,
    type: 'QR Code Created',
    description: 'WiFi QR Code for office network',
    time: '2 days ago',
    status: 'success',
  },
]

export const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your QR codes.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'info' ? 'bg-blue-400' :
                      activity.status === 'warning' ? 'bg-yellow-400' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                  <div className="flex items-center">
                    <QrCode className="w-5 h-5 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Create New QR Code</span>
                  </div>
                  <span className="text-yellow-600">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                  </div>
                  <span className="text-gray-600">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Manage Team</span>
                  </div>
                  <span className="text-gray-600">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}