import { useState } from "react";
import { ArrowLeft, Bot } from "lucide-react";
import { useLocation } from "wouter";
import { KnowledgeBaseSidebar } from "@shared/components/kb/KnowledgeBaseSidebar";
import { AiChatSidebar } from "@shared/components/kb/AiChatSidebar";
import { useRequireAuth } from "@shared/utils/authGuards";
import { Button } from "@ui/button";

export default function KnowledgeBase() {
  const { user, loading } = useRequireAuth();
  const [, setLocation] = useLocation();
  const [showChatBot, setShowChatBot] = useState(true);

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

  return (
    <section className="min-h-screen bg-background">
      {/* KB Header */}
      <header className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/dashboard")}
                data-testid="button-go-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Knowledge Base</h1>
                <p className="text-sm text-muted-foreground">
                  {user.clientSlug ? `${user.clientSlug.charAt(0).toUpperCase() + user.clientSlug.slice(1).replace('-', ' ')} Resources` : "Resources"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowChatBot(!showChatBot)}
                variant={showChatBot ? "default" : "secondary"}
                data-testid="button-toggle-chatbot"
              >
                <Bot className="mr-2 h-4 w-4" /> AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <KnowledgeBaseSidebar />
        
        {/* KB Main Content */}
        <main className={`flex-1 flex ${showChatBot ? "" : "mr-96"}`}>
          {/* Article Content */}
          <div className="flex-1 p-8">
            <article className="max-w-4xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="article-title">
                  Brand Style Guide
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Last updated: <span data-testid="text-last-updated">Dec 1, 2024</span></span>
                  <span>•</span>
                  <span>5 min read</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">Design</span>
                </div>
              </header>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-muted-foreground mb-6">
                  This guide outlines the visual identity and brand standards for your organization. 
                  Please refer to these guidelines when creating any marketing materials or communications.
                </p>
                
                <h2 className="text-xl font-semibold text-foreground mb-4">Logo Usage</h2>
                <div className="bg-secondary rounded-lg p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-primary-foreground text-2xl font-bold">LOGO</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Primary Logo</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-card border-2 border-border rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-foreground text-2xl font-bold">LOGO</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Secondary Logo</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-foreground mb-4">Color Palette</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { name: "Primary", color: "bg-primary", hex: "#6366F1" },
                    { name: "Accent", color: "bg-accent", hex: "#A855F7" },
                    { name: "Success", color: "bg-green-500", hex: "#10B981" },
                    { name: "Warning", color: "bg-orange-500", hex: "#F59E0B" },
                  ].map((colorInfo, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 ${colorInfo.color} rounded-lg mx-auto mb-2`}></div>
                      <p className="text-xs text-muted-foreground">{colorInfo.name}</p>
                      <p className="text-xs font-mono text-foreground">{colorInfo.hex}</p>
                    </div>
                  ))}
                </div>
                
                <h2 className="text-xl font-semibold text-foreground mb-4">Typography</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Heading Font</h3>
                    <p className="text-muted-foreground">Used for titles and headings throughout the brand</p>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-lg text-foreground mb-2">Body Text Font</p>
                    <p className="text-muted-foreground">Used for paragraphs and body text content</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* AI Chat Sidebar */}
          {showChatBot && <AiChatSidebar />}
        </main>
      </div>
    </section>
  );
}
