import { Phone, Video, Info, Paperclip, Send } from "lucide-react";
import { Button } from "@ui/button";
import { Textarea } from "@ui/textarea";

interface Message {
  id: string;
  senderId: string;
  content: string;
  messageType: string;
  createdAt: string;
  isRead: boolean;
}

interface MessageContentProps {
  conversation: any;
  messages: Message[];
  currentUserId: string;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export function MessageContent({
  conversation,
  messages,
  currentUserId,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onKeyPress,
  isLoading
}: MessageContentProps) {
  return (
    <main className="flex-1 flex flex-col">
      {/* Conversation Header */}
      <header className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {conversation?.participants?.[0]?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground" data-testid="conversation-participant">
                {conversation?.title || "Conversation"}
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
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex items-start space-x-3 ${
              message.senderId === currentUserId ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.senderId === currentUserId ? "bg-accent" : "bg-primary"
            }`}>
              <span className="text-white text-xs font-medium">
                {message.senderId === currentUserId ? "Y" : "T"}
              </span>
            </div>
            <div className={`flex-1 max-w-md ${message.senderId === currentUserId ? "text-right" : ""}`}>
              <div className={`rounded-lg p-3 ${
                message.senderId === currentUserId 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-foreground"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className={`text-xs text-muted-foreground mt-1 ${
                message.senderId === currentUserId ? "text-right" : ""
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
              onChange={(e) => onMessageInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              rows={1}
              className="resize-none"
              data-testid="textarea-message-input"
            />
          </div>
          <Button 
            onClick={onSendMessage}
            disabled={!messageInput.trim() || isLoading}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
