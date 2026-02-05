import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,  
  Moon,
  Sun,
  LogOut,
  Save,
  X,
  Camera,
  Key
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/app/providers/ThemeProvider'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

const Settings: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'security' | 'billing'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })

  const handleSave = () => {
    // TODO: Save profile changes
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'account', icon: User, label: 'Account' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
  ]

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-6 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}

                {/* Theme toggle */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center space-x-3">
                      {theme === 'dark' ? (
                        <Moon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Sun className="h-5 w-5 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">Theme</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Card className="p-6">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                    
                    {/* Avatar */}
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600">
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Profile photo</h3>
                        <p className="text-sm text-gray-500">Recommended: Square JPG, PNG at least 400px</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="md:col-span-2"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 mt-6">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  
                  {/* Storage */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Storage</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-gray-900">DriveCloud Basic</p>
                          <p className="text-sm text-gray-500">10 GB storage • Free plan</p>
                        </div>
                        <Button variant="primary">Upgrade</Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">6.5 GB of 10 GB used</span>
                          <span className="text-gray-500">65%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Language & Region */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Language & Region</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Zone
                        </label>
                        <select className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                          <option>(GMT-05:00) Eastern Time</option>
                          <option>(GMT-08:00) Pacific Time</option>
                          <option>(GMT+00:00) London</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
                  
                  {/* Change Password */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                      />
                      <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                      />
                      <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                      />
                      <Button variant="primary">
                        <Key className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Chrome on Windows</p>
                          <p className="text-sm text-gray-500">New York, USA • Just now</p>
                        </div>
                        <Button variant="outline" size="sm">Logout</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Safari on iPhone</p>
                          <p className="text-sm text-gray-500">London, UK • 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">Logout</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {/* Email notifications */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'File uploads', description: 'When files are successfully uploaded' },
                          { label: 'File shares', description: 'When someone shares a file with you' },
                          { label: 'Security alerts', description: 'Important security notifications' },
                          { label: 'Product updates', description: 'News and feature announcements' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Push notifications */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'New files', description: 'When new files are added to shared folders' },
                          { label: 'Comments', description: 'When someone comments on your files' },
                          { label: 'Download complete', description: 'When file downloads finish' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Plans</h2>
                  
                  {/* Current Plan */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">DriveCloud Basic</h3>
                        <p className="text-primary-100">Free forever • 10 GB storage</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$0</p>
                        <p className="text-primary-100">per month</p>
                      </div>
                    </div>
                    <Button variant="secondary" className="w-full">
                      Upgrade to Pro
                    </Button>
                  </div>

                  {/* Plan Comparison */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Plan Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          name: 'Basic',
                          price: '$0',
                          features: ['10 GB storage', 'Basic support', 'Up to 5 users', 'File sharing']
                        },
                        {
                          name: 'Pro',
                          price: '$9.99',
                          features: ['100 GB storage', 'Priority support', 'Up to 50 users', 'Advanced analytics', 'Custom branding']
                        },
                        {
                          name: 'Enterprise',
                          price: 'Custom',
                          features: ['Unlimited storage', '24/7 support', 'Unlimited users', 'SLA guarantee', 'Custom solutions']
                        }
                      ].map((plan, index) => (
                        <Card key={index} className="p-6 text-center">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                          <p className="text-3xl font-bold text-primary-500 mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, fIndex) => (
                              <li key={fIndex} className="text-gray-600">{feature}</li>
                            ))}
                          </ul>
                          <Button variant={plan.name === 'Pro' ? 'primary' : 'outline'} fullWidth>
                            {plan.name === 'Basic' ? 'Current Plan' : 'Choose Plan'}
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default Settings