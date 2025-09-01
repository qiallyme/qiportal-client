import { useState } from "react";
import { Brain, Bell, Eye } from "lucide-react";
import { useUser } from "@shared/auth/context/UserContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@qially/ui";
import { Button } from "@qially/ui";

export function AdminNavigation() {
  const { user, logout } = useUser();
  const [selectedClient, setSelectedClient] = useState<string>("admin");

  const clients = [
    { value: "admin", label: "Admin View" },
    { value: "acme-corp", label: "Acme Corp" },
    { value: "tech-solutions", label: "Tech Solutions" },
    { value: "retail-plus", label: "Retail Plus" },
  ];

  const handleViewAsClient = () => {
    if (selectedClient !== "admin") {
      // Navigate to client view - this would be implemented with router
      console.log("Viewing as client:", selectedClient);
    }
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-primary-foreground h-4 w-4" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">QiAlly Admin</h1>
            
            {/* Client Switcher */}
            <div className="ml-8 flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Viewing as:</span>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-40" data-testid="select-client">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.value} value={client.value}>
                      {client.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleViewAsClient}
                size="sm"
                variant="secondary"
                disabled={selectedClient === "admin"}
                data-testid="button-viewasclient"
              >
                <Eye className="mr-1 h-4 w-4" /> View as Client
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="button-notifications" aria-label="Notifications" title="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
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
