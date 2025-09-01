import { Bot, Users, TrendingUp } from "lucide-react";

export function FeatureGrid() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Knowledge Base",
      description: "RAG-enabled chatbots provide instant answers from your knowledge base with intelligent document search.",
    },
    {
      icon: Users,
      title: "Multi-Tenant Architecture",
      description: "Secure client isolation with customizable branding and feature flags for each tenant.",
    },
    {
      icon: TrendingUp,
      title: "Project Intelligence",
      description: "Real-time project tracking with progress visualization and automated client updates.",
    },
  ];

  return (
    <div className="relative z-10 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glassmorphism rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
              data-testid={`feature-card-${index}`}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="text-white h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
