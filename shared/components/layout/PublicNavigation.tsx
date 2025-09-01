import { useState } from "react";
import { Brain } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthProvider } from "@/auth/AuthProvider";

export function PublicNavigation() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleShowLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };

  const handleShowSignup = () => {
    setAuthMode("register");
    setShowAuth(true);
  };

  return (
    <>
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center glassmorphism">
              <Brain className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-white">QiAlly Portal</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white/90 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/90 hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="text-white/90 hover:text-white transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleShowLogin}
              className="text-white/90 hover:text-white transition-colors"
              data-testid="button-signin"
            >
              Sign In
            </button>
            <button 
              onClick={handleShowSignup}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg glassmorphism transition-all duration-200"
              data-testid="button-getstarted"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
          <AuthProvider mode={authMode} onClose={() => setShowAuth(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
