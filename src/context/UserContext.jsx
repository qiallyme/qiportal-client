// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const UserContext = createContext(null)

// Test mode - set to true for immediate testing without Supabase
const TEST_MODE = false

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState('guest')
  const [hydrated, setHydrated] = useState(false)

  // map email to role (temporary; move to user_metadata later)
  const applyRole = (userEmail) => {
    const admins = ['admin@qially.me', 'crice4485@gmail.com']
    const clients = ['info@qially.me', 'client1@email.com']
    if (admins.includes(userEmail)) return 'admin'
    if (clients.includes(userEmail)) return 'client'
    return 'guest'
  }

  useEffect(() => {
    let mounted = true

    if (TEST_MODE) {
      // Test mode - skip Supabase and set hydrated immediately
      setHydrated(true)
      return
    }

    // 1) initial session
    supabase.auth.getSession().then(async ({ data }) => {
      const e = data.session?.user?.email ?? null
      if (!mounted) return
      setEmail(e)
      
      if (e) {
        // Fetch user role from profiles table
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('email', e)
            .single()
          
          setRole(profileData?.role || 'guest')
        } catch (error) {
          console.error('Error fetching user role:', error)
          setRole('guest')
        }
      } else {
        setRole('guest')
      }
      
      setHydrated(true)
    })

    // 2) reactive updates
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const e = session?.user?.email ?? null
      setEmail(e)
      
      if (e) {
        // Fetch user role from profiles table
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('email', e)
            .single()
          
          setRole(profileData?.role || 'guest')
        } catch (error) {
          console.error('Error fetching user role:', error)
          setRole('guest')
        }
      } else {
        setRole('guest')
      }
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  // Authentication methods
  const signIn = async (email, password) => {
    if (TEST_MODE) {
      // Test mode - immediately authenticate if email is in our test list
      const testEmails = ['admin@qially.me', 'crice4485@gmail.com', 'info@qially.me', 'client1@email.com']
      
      if (testEmails.includes(email)) {
        setEmail(email)
        setRole(applyRole(email))
        return { data: { user: { email } }, error: null }
      } else {
        return { data: null, error: { message: 'Invalid test email. Use: admin@qially.me, crice4485@gmail.com, info@qially.me, or client1@email.com' } }
      }
    }

    // Real Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    if (TEST_MODE) {
      // Test mode - treat signup same as signin for testing
      return signIn(email, password)
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    if (TEST_MODE) {
      // Test mode - immediately sign out
      setEmail(null)
      setRole('guest')
      return { error: null }
    }

    // Real Supabase sign out
    const { error } = await supabase.auth.signOut()
    
    // Always update local state regardless of Supabase response
    setEmail(null)
    setRole('guest')
    
    return { error }
  }

  const resetPassword = async (email) => {
    if (TEST_MODE) {
      // Test mode - just return success
      return { data: { message: 'Test mode: Password reset email would be sent' }, error: null }
    }

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
      resetPassword,
      testMode: TEST_MODE
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
