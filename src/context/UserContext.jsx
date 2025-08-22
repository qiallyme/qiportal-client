import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserEmailFromJWT } from '../utils/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState('guest');

  useEffect(() => {
    const userEmail = getUserEmailFromJWT();
    setEmail(userEmail);

    // Use this to define roles manually for now
    const admins = ['admin@qially.me', 'crice4485@gmail.com'];
    const clients = ['info@qially.me', 'client1@email.com'];

    if (admins.includes(userEmail)) {
      setRole('admin');
    } else if (clients.includes(userEmail)) {
      setRole('client');
    } else {
      setRole('guest');
    }
  }, []);

  return (
    <UserContext.Provider value={{ email, role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
