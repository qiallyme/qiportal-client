import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function MessageSidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: "1",
      participant: { name: "John (PM)", initials: "JD", color: "bg-primary" },
      lastMessage: "Updated the wireframes for your homepage. Please review when you have...",
      time: "2h",
      project: "Website Redesign",
      unread: true,
      projectColor: "text-primary"
    },
    {
      id: "2", 
      participant: { name: "Alice (Designer)", initials: "AL", color: "bg-accent" },
      lastMessage: "Brand color palette has been finalized. Check the KB for the style guide.",
      time: "1d",
      project: "Brand Guidelines",
      unread: false,
      projectColor: "text-accent"
    },
    {
      id: "3",
      participant: { name: "Team Chat", initials: "TC", color: "bg-green-500" },
      lastMessage: "Meeting scheduled for tomorrow at 2 PM EST",
      time: "2d",
      project: "General",
      unread: false,
      projectColor: "text-green-600"
    }
  ];

  return (
    <aside className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-conversations"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors ${
                conversation.unread ? "bg-primary/10 border-l-2 border-primary" : ""
              }`}
              data-testid={`conversation-${conversation.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 ${conversation.participant.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium">{conversation.participant.initials}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{conversation.participant.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{conversation.time}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {conversation.lastMessage}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${conversation.projectColor}`}>
                  Project: {conversation.project}
                </span>
                {conversation.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
