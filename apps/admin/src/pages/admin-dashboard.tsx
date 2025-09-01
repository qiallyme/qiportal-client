import { AdminNavigation } from "@/components/AdminNavigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useRequireAdmin } from "@shared/utils/authGuards";
import { Building, CheckSquare, DollarSign, MessageSquare, FileText, ExternalLink, Check } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useRequireAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    { icon: Building, label: "Total Clients", value: "24", change: "+3 this month", color: "text-primary" },
    { icon: CheckSquare, label: "Active Projects", value: "147", change: "+12 this week", color: "text-accent" },
    { icon: DollarSign, label: "Monthly Revenue", value: "$89.5k", change: "+18% from last month", color: "text-green-600" },
    { icon: MessageSquare, label: "Unread Messages", value: "43", change: "Requires attention", color: "text-orange-600" },
  ];

  const recentActivity = [
    { 
      icon: FileText, 
      message: "New project started for Acme Corp", 
      time: "2 hours ago",
      iconColor: "text-primary bg-primary/10"
    },
    { 
      icon: MessageSquare, 
      message: "Message from Tech Solutions", 
      time: "4 hours ago",
      iconColor: "text-accent bg-accent/10"
    },
    { 
      icon: Check, 
      message: "Invoice paid by Retail Plus", 
      time: "1 day ago",
      iconColor: "text-green-600 bg-green-500/10"
    },
  ];

  const clients = [
    { name: "Acme Corp", initials: "AC", projects: "5 active projects", color: "bg-primary" },
    { name: "Tech Solutions", initials: "TS", projects: "2 active projects", color: "bg-accent" },
    { name: "Retail Plus", initials: "RP", projects: "1 active project", color: "bg-green-500" },
  ];

  return (
    <section className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Admin Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color.replace('text-', 'bg-')}/10`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                  <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity & Client Management */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3" data-testid={`activity-${index}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${activity.iconColor}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Quick Access */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Client Quick Access</h3>
                <div className="space-y-3">
                  {clients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg" data-testid={`client-${client.name.toLowerCase().replace(' ', '-')}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${client.color} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-sm font-medium">{client.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.projects}</p>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm" data-testid={`view-client-${index}`} aria-label="View Client" title="View Client">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
