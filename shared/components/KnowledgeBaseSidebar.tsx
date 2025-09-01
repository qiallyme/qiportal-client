import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function KnowledgeBaseSidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      articles: [
        { title: "Welcome to Your Portal", active: false },
        { title: "Brand Style Guide", active: true },
        { title: "Project Process Overview", active: false },
      ]
    },
    {
      title: "Design Resources", 
      articles: [
        { title: "Logo Guidelines", active: false },
        { title: "Color Palette", active: false },
        { title: "Typography System", active: false },
      ]
    },
    {
      title: "Communication",
      articles: [
        { title: "How to Submit Feedback", active: false },
        { title: "Scheduling Meetings", active: false },
        { title: "Emergency Contact Info", active: false },
      ]
    }
  ];

  return (
    <aside className="w-80 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-articles"
          />
        </div>
        
        {/* Categories */}
        <div className="space-y-4">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-sm font-medium text-foreground mb-3">{category.title}</h3>
              <div className="space-y-1">
                {category.articles.map((article, articleIndex) => (
                  <a
                    key={articleIndex}
                    href="#article"
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      article.active
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    data-testid={`article-link-${categoryIndex}-${articleIndex}`}
                  >
                    {article.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
