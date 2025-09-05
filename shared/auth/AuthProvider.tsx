import { useState } from "react";
import { useUser } from "@shared/auth/context/UserContext";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Label } from "@ui/label";
import { useToast } from "@shared/hooks/use-toast";

interface AuthProviderProps {
  mode: "login" | "register";
  onClose: () => void;
}

export function AuthProvider({ mode, onClose }: AuthProviderProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        // For demo, we'll implement register later
        await login(email, password);
      }
      onClose();
      toast({
        title: "Success",
        description: `Successfully ${mode === "login" ? "logged in" : "registered"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${mode}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-testid="auth-card">
      <CardHeader>
        <CardTitle data-testid="auth-title">
          {mode === "login" ? "Sign In" : "Create Account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-name"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-password"
            />
          </div>
          
          <div className="flex space-x-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1"
              data-testid="button-submit"
            >
              {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Demo credentials: admin@qially.com / password or sarah@acmecorp.com / password
        </div>
      </CardContent>
    </Card>
  );
}
