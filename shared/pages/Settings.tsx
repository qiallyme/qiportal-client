import React, { useState, useEffect } from 'react';
import { useUser } from '../auth/context/UserContext';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  dataSharing: boolean;
  analytics: boolean;
}

const Settings: React.FC = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    sms: false,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'security'>('profile');

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings...');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'privacy', label: 'Privacy' },
                { id: 'security', label: 'Security' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        id="name"
                        type="text"
                        defaultValue={user.name}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('email')}
                        aria-label={`${notifications.email ? 'Disable' : 'Enable'} email notifications`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('push')}
                        aria-label={`${notifications.push ? 'Disable' : 'Enable'} push notifications`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('sms')}
                        aria-label={`${notifications.sms ? 'Disable' : 'Enable'} SMS notifications`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="profile-visibility" className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                      <select
                        id="profile-visibility"
                        value={privacy.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                        <p className="text-sm text-gray-500">Allow data to be shared with partners</p>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange('dataSharing', !privacy.dataSharing)}
                        aria-label={`${privacy.dataSharing ? 'Disable' : 'Enable'} data sharing`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacy.dataSharing ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
                        <p className="text-sm text-gray-500">Help improve our service with analytics</p>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange('analytics', !privacy.analytics)}
                        aria-label={`${privacy.analytics ? 'Disable' : 'Enable'} analytics`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          privacy.analytics ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Change Password
                      </button>
                    </div>
                    <div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
