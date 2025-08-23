import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState("guest");
  const [hydrated, setHydrated] = useState(false);

  const applyRole = (userEmail) => {
    const admins = ["admin@qially.me", "crice4485@gmail.com"];
    const clients = ["info@qially.me", "client1@email.com"];
    if (admins.includes(userEmail)) return "admin";
    if (clients.includes(userEmail)) return "client";
    return "guest";
  };

  const hydrate = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.email) {
        setEmail(data.email);
        setRole(applyRole(data.email));
      }
    } catch {
      // stay guest
    } finally {
      setHydrated(true);
    }
  };

  useEffect(() => { hydrate(); }, []);

  return (
    <UserContext.Provider value={{ email, role, hydrated, setEmail, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export { UserContext };
