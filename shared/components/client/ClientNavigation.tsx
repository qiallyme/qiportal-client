import React from 'react';

export const ClientNavigation: React.FC = () => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">QiAlly Client Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">TODO: Add navigation items</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
