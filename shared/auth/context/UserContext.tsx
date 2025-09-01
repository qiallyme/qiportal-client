import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  role: string;
  clientSlug?: string;
  name: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isClient: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "client_user" || user?.role === "team_member";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
          const userData = await authApi.me();
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem("sessionId");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { sessionId, user: userData } = await authApi.login(email, password);
    localStorage.setItem("sessionId", sessionId);
    setUser(userData);
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem("sessionId");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, isAdmin, isClient }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
