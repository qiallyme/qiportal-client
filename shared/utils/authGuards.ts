import { useUser } from "@shared/auth/context/UserContext";
import { useEffect } from "react";
import { useLocation } from "wouter";

export function useRequireAuth() {
  const { user, loading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  return { user, loading };
}

export function useRequireAdmin() {
  const { user, loading, isAdmin } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      setLocation("/");
    }
  }, [user, loading, isAdmin, setLocation]);

  return { user, loading, isAdmin };
}

export function useRequireClient() {
  const { user, loading, isClient } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isClient)) {
      setLocation("/");
    }
  }, [user, loading, isClient, setLocation]);

  return { user, loading, isClient };
}
