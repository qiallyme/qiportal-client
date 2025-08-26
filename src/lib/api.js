import { supabase } from './supabase';

/**
 * API utility function with error handling and Supabase integration
 * @param {string} path - API endpoint path (for future use with custom API routes)
 * @param {Object} opts - Fetch options
 * @returns {Promise<Object>} API response or error object
 */
export async function api(path, opts = {}) {
  // For now, this is a placeholder for future API calls
  // Most data operations will be done directly through Supabase client
  try {
    const res = await fetch(path, { 
      credentials: "include", 
      ...opts 
    });
    
    if (res.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/login";
      return;
    }

    // Try JSON; if it fails, fall back to text.
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: true, message: "Invalid JSON", body: text };
    }
  } catch (err) {
    // Network or CORS error: surface a sane shape
    return { error: true, message: "Network error", detail: String(err) };
  }
}

/**
 * Get current user from Supabase
 * @returns {Promise<Object>} User object or null
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

/**
 * Get user session from Supabase
 * @returns {Promise<Object>} Session object or null
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}
