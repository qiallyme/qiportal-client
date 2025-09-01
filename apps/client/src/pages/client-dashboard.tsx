import { ClientNavigation } from "@/components/client/ClientNavigation";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { useRequireClient } from "@/utils/authGuards";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientDashboard() {
  const { user, loading } = useRequireClient();

  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

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

  const projectProgress = (projects as any[])?.map((project: any) => ({
    ...project,
    color: project.status === "completed" ? "bg-green-500" : 
           project.status === "in_progress" ? "bg-primary" : "bg-orange-500"
  })) || [];

  const recentMessages = [
    {
      sender: "John (Project Manager)",
      initials: "JD",
      message: "Updated the wireframes for your homepage. Please review when you have a chance.",
      time: "2h ago",
      color: "bg-primary"
    },
    {
      sender: "Alice (Designer)",
      initials: "AL",
      message: "Brand color palette has been finalized. Check the KB for the style guide.",
      time: "1d ago",
      color: "bg-accent"
    },
  ];

  const recentKbArticles = [
    { title: "Brand Style Guide", description: "Logo usage, colors, typography guidelines..." },
    { title: "Project Timeline", description: "Milestones and deliverables overview..." },
    { title: "Communication Best Practices", description: "How to effectively collaborate with our team..." },
  ];

  return (
    <section className="min-h-screen bg-background">
      <ClientNavigation />
      
      <div className="flex">
        <ClientSidebar />
        
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome back, <span data-testid="text-welcome-name">{user.name?.split(' ')[0]}</span>
                </h2>
                <p className="text-muted-foreground">Here's what's happening with your projects</p>
              </div>
              <Button data-testid="button-new-service-request">
                <Plus className="mr-2 h-4 w-4" /> New Service Request
              </Button>
            </div>

            {/* Project Progress Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {projectProgress.slice(0, 3).map((project: any) => (
                <div 
                  key={project.id} 
                  className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`project-card-${project.id}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      project.status === "completed" ? "bg-green-500/10 text-green-600" :
                      project.status === "in_progress" ? "bg-accent/10 text-accent" :
                      "bg-orange-500/10 text-orange-600"
                    }`}>
                      {project.status === "in_progress" ? "In Progress" : 
                       project.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${project.color}`}
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "TBD"}
                    </span>
                    <button className="text-primary hover:text-primary/80" data-testid={`view-project-${project.id}`}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Messages & Knowledge Base Access */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Messages */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Messages</h3>
                  <button className="text-primary hover:text-primary/80 text-sm" data-testid="button-view-all-messages">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentMessages.map((message, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg" data-testid={`message-${index}`}>
                      <div className={`w-8 h-8 ${message.color} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-medium">{message.initials}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">{message.sender}</p>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Base Quick Access */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Knowledge Base</h3>
                  <button className="text-primary hover:text-primary/80 text-sm" data-testid="button-browse-kb">
                    Browse All
                  </button>
                </div>
                
                {/* Search Bar */}
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    placeholder="Search your knowledge base..." 
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="input-kb-search"
                  />
                </div>
                
                {/* Recent KB Articles */}
                <div className="space-y-3">
                  {recentKbArticles.map((article, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                      data-testid={`kb-article-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground mb-1">{article.title}</h4>
                          <p className="text-xs text-muted-foreground">{article.description}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground ml-2 mt-1" />
                      </div>
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
