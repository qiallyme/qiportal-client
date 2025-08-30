import { supabase } from '../lib/supabase';

/**
 * Get user email from Supabase session
 * @returns {Promise<string|null>} User email or null if not authenticated
 */
export async function getUserEmailFromSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.email || null;
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.user;
}

/**
 * Get user role based on email
 * @param {string} email - User email
 * @returns {string} User role (admin, client, or guest)
 */
export function getUserRole(email) {
  if (!email) return 'guest';
  
  const admins = ["admin@qially.me", "crice4485@gmail.com"];
  const clients = ["info@qially.me", "client1@email.com"];
  
  if (admins.includes(email)) return "admin";
  if (clients.includes(email)) return "client";
  return "guest";
}

/**
 * Force clear all authentication data
 * This is a nuclear option to clear all auth state
 */
export function forceClearAuth() {
  // Clear Supabase session
  localStorage.removeItem('supabase.auth.token');
  sessionStorage.removeItem('supabase.auth.token');
  
  // Clear any other potential auth storage
  localStorage.removeItem('sb-vwqkhjnkummwtvfxgqml-auth-token');
  sessionStorage.removeItem('sb-vwqkhjnkummwtvfxgqml-auth-token');
  
  // Clear all localStorage items that might contain auth data
  Object.keys(localStorage).forEach(key => {
    if (key.includes('supabase') || key.includes('auth')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear all sessionStorage items that might contain auth data
  Object.keys(sessionStorage).forEach(key => {
    if (key.includes('supabase') || key.includes('auth')) {
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('Force cleared all authentication data');
}
