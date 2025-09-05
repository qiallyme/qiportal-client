import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { kbApi } from "@shared/lib/kbApi";
import { useUser } from "@shared/auth/context/UserContext";
import { useToast } from "@shared/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  sources?: Array<{ title: string; path: string }>;
  timestamp: Date;
}

export function AiChatSidebar() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I can help you find information in your knowledge base. What would you like to know about your brand guidelines?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await kbApi.chatWithAi(inputMessage, user?.clientSlug);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        sources: response.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Bot className="text-accent-foreground h-4 w-4" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask questions about your resources</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4" data-testid="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              message.type === "user" ? "bg-primary" : "bg-accent"
            }`}>
              {message.type === "user" ? (
                <User className="text-primary-foreground h-3 w-3" />
              ) : (
                <Bot className="text-accent-foreground h-3 w-3" />
              )}
            </div>
            <div className={`flex-1 max-w-sm ${message.type === "user" ? "text-right" : ""}`}>
              <div className={`rounded-lg p-3 ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-foreground"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/20">
                    <p className="text-xs opacity-75 mb-1">Sources:</p>
                    {message.sources.map((source, index) => (
                      <p key={index} className="text-xs opacity-75">
                        • {source.title}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Bot className="text-accent-foreground h-3 w-3" />
            </div>
            <div className="flex-1 bg-secondary rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Ask about your knowledge base..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
