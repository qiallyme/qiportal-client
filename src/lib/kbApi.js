import { supabase } from './supabase';

// Get client slug from user profile
export async function getClientSlug() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user profile to determine client slug
  const { data: profile } = await supabase
    .from('profiles')
    .select('client_slug, role')
    .eq('email', user.email)
    .single();

  if (profile?.client_slug) {
    return profile.client_slug;
  }

  // Fallback: derive from email domain or role
  if (profile?.role === 'admin') {
    return 'admin'; // Admin can access all KBs
  }

  // For testing, return a default client slug
  return 'zy';
}

// List documents for a specific client
export async function listDocs(clientSlug) {
  try {
    const { data, error } = await supabase
      .from('kb_files')
      .select('*')
      .eq('client_slug', clientSlug)
      .order('title');

    if (error) {
      console.error('Error fetching KB documents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in listDocs:', error);
    return [];
  }
}

// Get signed URL for a document
export async function getSignedUrl(path) {
  try {
    const { data, error } = await supabase.storage
      .from('kb')
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    throw error;
  }
}

// Search documents
export async function searchDocs(clientSlug, query) {
  try {
    const { data, error } = await supabase
      .from('kb_files')
      .select('*')
      .eq('client_slug', clientSlug)
      .or(`title.ilike.%${query}%,tags.cs.{${query}}`)
      .order('title');

    if (error) {
      console.error('Error searching KB documents:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchDocs:', error);
    return [];
  }
}

// Get document content
export async function getDocContent(path) {
  try {
    const signedUrl = await getSignedUrl(path);
    const response = await fetch(signedUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching document content:', error);
    throw error;
  }
}
