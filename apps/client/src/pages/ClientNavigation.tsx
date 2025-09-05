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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">QiAlly</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="button-openchat" aria-label="Open chat">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="button-notifications" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
