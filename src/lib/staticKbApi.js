import { supabase } from './supabase';

// Load access control configuration
let accessControlConfig = null;

async function loadAccessControl() {
  if (accessControlConfig) return accessControlConfig;
  
  try {
    const response = await fetch('/kb/access-control.json');
    if (response.ok) {
      accessControlConfig = await response.json();
      return accessControlConfig;
    }
  } catch (error) {
    console.error('Error loading access control config:', error);
  }
  
  // Fallback to default config
  return {
    'zy': {
      members: ['info@qially.me', 'client1@email.com'],
      public: false,
      name: 'QiAlly'
    }
  };
}

// Check if user has access to a specific client's knowledge base
export async function checkClientAccess(clientSlug) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const config = await loadAccessControl();
  const clientConfig = config[clientSlug];
  
  if (!clientConfig) return false;
  
  // Check if user is a member
  if (clientConfig.members.includes(user.email)) {
    return true;
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', user.email)
    .single();
    
  if (profile?.role === 'admin') {
    return true;
  }
  
  return false;
}

// Get all clients the user has access to
export async function getUserClients() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const config = await loadAccessControl();
  const accessibleClients = [];

  for (const [clientSlug, clientConfig] of Object.entries(config)) {
    if (clientConfig.members.includes(user.email)) {
      accessibleClients.push({
        slug: clientSlug,
        name: clientConfig.name || clientSlug,
        description: clientConfig.description || ''
      });
    }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', user.email)
    .single();
    
  if (profile?.role === 'admin') {
    // Admin can access all clients
    return Object.entries(config).map(([clientSlug, clientConfig]) => ({
      slug: clientSlug,
      name: clientConfig.name || clientSlug,
      description: clientConfig.description || ''
    }));
  }

  return accessibleClients;
}

// Get client knowledge base index
export async function getClientKBIndex(clientSlug) {
  const hasAccess = await checkClientAccess(clientSlug);
  if (!hasAccess) {
    throw new Error('Access denied');
  }

  try {
    const response = await fetch(`/kb/${clientSlug}/search-index.json`);
    if (!response.ok) {
      throw new Error('Failed to load knowledge base index');
    }
    
    const documents = await response.json();
    return documents;
  } catch (error) {
    console.error('Error loading KB index:', error);
    return [];
  }
}

// Get document content
export async function getDocumentContent(clientSlug, documentPath) {
  const hasAccess = await checkClientAccess(clientSlug);
  if (!hasAccess) {
    throw new Error('Access denied');
  }

  try {
    const response = await fetch(`/kb/${clientSlug}/${documentPath}.json`);
    if (!response.ok) {
      throw new Error('Document not found');
    }
    
    const document = await response.json();
    return document;
  } catch (error) {
    console.error('Error loading document:', error);
    throw error;
  }
}

// Search documents within a client's knowledge base
export async function searchClientDocuments(clientSlug, query) {
  const hasAccess = await checkClientAccess(clientSlug);
  if (!hasAccess) {
    throw new Error('Access denied');
  }

  try {
    const documents = await getClientKBIndex(clientSlug);
    
    if (!query) return documents;
    
    // Simple search implementation
    const searchTerm = query.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.description.toLowerCase().includes(searchTerm) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      doc.content.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
}

// Get document HTML URL
export function getDocumentUrl(clientSlug, documentPath) {
  return `/kb/${clientSlug}/${documentPath}.html`;
}

// Get client knowledge base URL
export function getClientKBUrl(clientSlug) {
  return `/kb/${clientSlug}/index.html`;
}

// Get main knowledge base portal URL
export function getMainKBUrl() {
  return '/kb/index.html';
}

// Check if static knowledge base is available
export async function isStaticKBAvailable() {
  try {
    const response = await fetch('/kb/access-control.json');
    return response.ok;
  } catch (error) {
    return false;
  }
}
