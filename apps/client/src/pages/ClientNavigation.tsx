import { Brain, Bot, Bell } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";

export function ClientNavigation() {
  const { user, logout } = useUser();

  const modules = [
    { key: "KB", active: true },
    { key: "Projects", active: true },
    { key: "Messages", active: true },
    { key: "Docs", active: false },
  ];

  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-primary-foreground h-4 w-4" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              {user?.clientSlug ? `${user.clientSlug.charAt(0).toUpperCase() + user.clientSlug.slice(1).replace('-', ' ')} Portal` : "Client Portal"}
            </h1>
            
            {/* Module Toggle Indicators */}
            <div className="hidden lg:flex items-center space-x-2 ml-8">
              <span className="text-xs text-muted-foreground">Modules:</span>
              <div className="flex space-x-1">
                {modules.map((module) => (
                  <span 
                    key={module.key}
                    className={`px-2 py-1 text-xs rounded-md ${
                      module.active 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`module-${module.key.toLowerCase()}`}
                  >
                    {module.key}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="button-openchat">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm font-medium" data-testid="text-username">{user?.name}</span>
              <Button 
                onClick={logout} 
                variant="ghost" 
                size="sm"
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
