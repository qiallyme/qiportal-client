import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserEmailFromJWT } from '../utils/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState('guest');

  const setUser = (userData) => {
    if (userData.email) {
      setEmail(userData.email);
      
      // Use this to define roles manually for now
      const admins = ['admin@qially.me', 'crice4485@gmail.com'];
      const clients = ['info@qially.me', 'client1@email.com'];

      if (admins.includes(userData.email)) {
        setRole('admin');
      } else if (clients.includes(userData.email)) {
        setRole('client');
      } else {
        setRole('guest');
      }
    }
  };

  useEffect(() => {
    const userEmail = getUserEmailFromJWT();
    if (userEmail) {
      setUser({ email: userEmail });
    }
  }, []);

  return (
    <UserContext.Provider value={{ email, role, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
