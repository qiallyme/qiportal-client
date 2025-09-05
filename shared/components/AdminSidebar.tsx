import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings, 
  BarChart3,
  Shield,
  Database
} from 'lucide-react';
import { Button } from '@ui/button';

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Clients', active: false },
  { icon: FileText, label: 'Projects', active: false },
  { icon: MessageSquare, label: 'Messages', active: false },
  { icon: DollarSign, label: 'Billing', active: false },
  { icon: BarChart3, label: 'Analytics', active: false },
  { icon: Shield, label: 'Security', active: false },
  { icon: Database, label: 'Data Management', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${
                item.active 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
