import { useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@ui/dialog";
import { AuthProvider } from "@shared/auth/AuthProvider";

export function HeroSection() {
  const [showAuth, setShowAuth] = useState(false);

  const handleStartTrial = () => {
    setShowAuth(true);
  };

  return (
    <>
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Intelligent Client
            <br />
            <span className="electric-text">Portal Platform</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline client relationships with AI-powered knowledge bases, real-time collaboration, 
            and intelligent project management. Built for modern service providers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleStartTrial}
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-200 shadow-xl"
              data-testid="button-starttrial"
            >
              Start Free Trial
            </button>
            <button 
              className="glassmorphism text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200"
              data-testid="button-viewdemo"
            >
              <Play className="inline mr-2 h-4 w-4" /> View Demo
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
          <AuthProvider mode="register" onClose={() => setShowAuth(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
