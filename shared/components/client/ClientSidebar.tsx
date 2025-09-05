import React from 'react';

export const ClientSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">TODO: Client Sidebar</h2>
        <nav className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Navigation items will be added here
          </div>
        </nav>
      </div>
    </aside>
  );
};
