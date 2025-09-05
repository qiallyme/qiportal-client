import React from 'react';
import { Brain, Bot, Bell } from "lucide-react";
import { useUser } from "@shared/auth/context/UserContext";
import { Button } from "@shared/ui/button";

export function ClientNavigation() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <nav className="glass-nav border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">QiAlly</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-white/70 hover:text-white transition-colors" data-testid="button-openchat" aria-label="Open chat">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
            </button>
            <button className="relative p-2 text-white/70 hover:text-white transition-colors" data-testid="button-notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-white/80 hidden sm:block">{user?.email}</span>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
