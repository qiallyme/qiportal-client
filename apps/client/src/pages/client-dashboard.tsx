import { ClientNavigation } from "@shared/components/client/ClientNavigation";
import { ClientSidebar } from "@shared/components/client/ClientSidebar";
import { useRequireClient } from "@shared/utils/authGuards";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@shared/lib/queryClient";
import { Plus, ExternalLink } from "lucide-react";
import { Button } from "@ui/button";

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
    <section className="min-h-screen dark-gradient-bg">
      <ClientNavigation />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        <ClientSidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="dark-gradient-card rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Welcome back, <span data-testid="text-welcome-name" className="electric-text">{user.name?.split(' ')[0]}</span>
                </h2>
                <p className="text-white/70">Here's what's happening with your projects</p>
              </div>
              <Button 
                data-testid="button-new-service-request"
                className="glass-button-primary glow-blue"
              >
                <Plus className="mr-2 h-4 w-4" /> New Service Request
              </Button>
            </div>
          </div>

          {/* Project Progress Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectProgress.slice(0, 3).map((project: any) => (
              <div 
                key={project.id} 
                className="dark-gradient-card rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
                data-testid={`project-card-${project.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    project.status === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                    project.status === "in_progress" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                    "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  }`}>
                    {project.status === "in_progress" ? "In Progress" : 
                     project.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white font-medium">{project.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        project.status === "completed" ? "bg-green-500" :
                        project.status === "in_progress" ? "bg-blue-500" :
                        "bg-orange-500"
                      }`}
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">
                    Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "TBD"}
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors" data-testid={`view-project-${project.id}`}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Messages & Knowledge Base Access */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Messages */}
            <div className="dark-gradient-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Messages</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors" data-testid="button-view-all-messages">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10" data-testid={`message-${index}`}>
                    <div className={`w-8 h-8 ${message.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs font-medium">{message.initials}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{message.sender}</p>
                        <span className="text-xs text-white/70">{message.time}</span>
                      </div>
                      <p className="text-sm text-white/80">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Base Quick Access */}
            <div className="dark-gradient-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Knowledge Base</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors" data-testid="button-browse-kb">
                  Browse All
                </button>
              </div>
                
              {/* Search Bar */}
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder="Search your knowledge base..." 
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  data-testid="input-kb-search"
                />
              </div>
              
              {/* Recent KB Articles */}
              <div className="space-y-3">
                {recentKbArticles.map((article, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
                    data-testid={`kb-article-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white mb-1">{article.title}</h4>
                        <p className="text-xs text-white/70">{article.description}</p>
                      </div>
                      <ExternalLink className="h-3 w-3 text-white/50 ml-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
