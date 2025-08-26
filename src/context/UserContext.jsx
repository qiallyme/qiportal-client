// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState('guest')
  const [hydrated, setHydrated] = useState(false)

  // map email to role (temporary; move to user_metadata later)
  const applyRole = (userEmail) => {
    const admins  = ['admin@qially.me', 'crice4485@gmail.com']
    const clients = ['info@qially.me', 'client1@email.com']
    if (admins.includes(userEmail))  return 'admin'
    if (clients.includes(userEmail)) return 'client'
    return 'guest'
  }

  useEffect(() => {
    let mounted = true

    // 1) initial session
    supabase.auth.getSession().then(({ data }) => {
      const e = data.session?.user?.email ?? null
      if (!mounted) return
      setEmail(e)
      setRole(e ? applyRole(e) : 'guest')
      setHydrated(true)
    })

    // 2) reactive updates
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const e = session?.user?.email ?? null
      setEmail(e)
      setRole(e ? applyRole(e) : 'guest')
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Authentication methods
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  return (
    <UserContext.Provider value={{ 
      email, 
      role, 
      hydrated,
      signIn,
      signUp,
      signOut,
      resetPassword
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
