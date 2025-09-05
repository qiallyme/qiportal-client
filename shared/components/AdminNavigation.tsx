import React from 'react';
import { Brain, Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@ui/button';

export function AdminNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">QiAlly Admin</h1>
            <p className="text-sm text-gray-500">Portal Management</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6">
          <button 
            className="relative p-2 text-gray-500 hover:text-gray-700"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-gray-500">Administrator</p>
            </div>
          </div>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
