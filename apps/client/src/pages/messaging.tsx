import { useState } from "react";
import { Phone, Video, Info, Paperclip, Send } from "lucide-react";
import { useRequireAuth } from "@shared/utils/authGuards";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@shared/lib/queryClient";
import { useWebSocket } from "@shared/hooks/useWebSocket";
import { MessageSidebar } from "@shared/components/messaging/MessageSidebar";
import { MessageContent } from "@shared/components/messaging/MessageContent";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { useToast } from "@shared/hooks/use-toast";

export default function Messaging() {
  const { user, loading } = useRequireAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("1");
  const [messageInput, setMessageInput] = useState("");
  const { messages: wsMessages } = useWebSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/conversations", selectedConversationId, "messages"],
    enabled: !!selectedConversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; messageType?: string }) => {
      const res = await apiRequest("POST", `/api/conversations/${selectedConversationId}/messages`, messageData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", selectedConversationId, "messages"] });
      setMessageInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
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

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    
    sendMessageMutation.mutate({
      content: messageInput,
      messageType: "text"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConversation = (conversations as any[])?.find((c: any) => c.id === selectedConversationId);

  return (
    <section className="min-h-screen bg-background">
      <div className="flex h-screen">
        <MessageSidebar />
        
        {selectedConversationId ? (
          <main className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <header className="p-4 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {selectedConversation?.participants?.[0]?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground" data-testid="conversation-participant">
                      {selectedConversation?.title || "Conversation"}
                    </h3>
                    <p className="text-xs text-muted-foreground">Online now</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" data-testid="button-start-call">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" data-testid="button-start-video-call">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" data-testid="button-view-project-details">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </header>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-container">
              {(messages as any[])?.map((message: any) => (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-3 ${
                    message.senderId === user.id ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.senderId === user.id ? "bg-accent" : "bg-primary"
                  }`}>
                    <span className="text-white text-xs font-medium">
                      {message.senderId === user.id ? user.name?.charAt(0) : "T"}
                    </span>
                  </div>
                  <div className={`flex-1 max-w-md ${message.senderId === user.id ? "text-right" : ""}`}>
                    <div className={`rounded-lg p-3 ${
                      message.senderId === user.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-foreground"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs text-muted-foreground mt-1 ${
                      message.senderId === user.id ? "text-right" : ""
                    }`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm" data-testid="button-attach-file">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    className="resize-none"
                    data-testid="textarea-message-input"
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
