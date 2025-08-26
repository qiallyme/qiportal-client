import { supabase } from '../lib/supabase';

/**
 * Get user email from Supabase session
 * @returns {string|null} User email or null if not authenticated
 */
export function getUserEmailFromSession() {
  const session = supabase.auth.getSession();
  return session?.user?.email || null;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export function isAuthenticated() {
  const session = supabase.auth.getSession();
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
