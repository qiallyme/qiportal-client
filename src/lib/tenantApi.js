/**
 * Tenant-Aware API Wrapper
 * Provides secure, filtered access to Supabase data based on current tenant
 */

import { supabase } from './supabase';
import { getCurrentTenant, validateTenantAccess, getTenantQuery } from './tenant';

/**
 * Knowledge Base API with tenant filtering
 */
export const tenantKB = {
  /**
   * Get KB files for current tenant
   */
  async getFiles() {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await getTenantQuery('kb_files', tenant.slug)
      .select('*')
      .order('title');
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get KB file by path for current tenant
   */
  async getFile(path) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await getTenantQuery('kb_files', tenant.slug)
      .select('*')
      .eq('path', path)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Search KB files for current tenant
   */
  async searchFiles(query) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await getTenantQuery('kb_files', tenant.slug)
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('title');
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get KB files by tag for current tenant
   */
  async getFilesByTag(tag) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await getTenantQuery('kb_files', tenant.slug)
      .select('*')
      .contains('tags', [tag])
      .order('title');
    
    if (error) throw error;
    return data;
  }
};

/**
 * Conversations API with tenant filtering
 */
export const tenantConversations = {
  /**
   * Get conversations for current tenant
   */
  async getConversations() {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await getTenantQuery('conversations', tenant.slug)
      .select(`
        *,
        conversation_participants!inner(user_id),
        messages(count)
      `)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get conversation by ID for current tenant
   */
  async getConversation(id) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await getTenantQuery('conversations', tenant.slug)
      .select(`
        *,
        conversation_participants(
          *,
          profiles(email, full_name)
        ),
        messages(
          *,
          profiles(email, full_name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Create conversation for current tenant
   */
  async createConversation(conversationData) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        ...conversationData,
        client_id: tenant.slug
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

/**
 * Messages API with tenant filtering
 */
export const tenantMessages = {
  /**
   * Get messages for a conversation in current tenant
   */
  async getMessages(conversationId) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    // First verify the conversation belongs to this tenant
    const { data: conversation, error: convError } = await getTenantQuery('conversations', tenant.slug)
      .select('id')
      .eq('id', conversationId)
      .single();
    
    if (convError) throw new Error('Conversation not found or access denied');
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles(email, full_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at');
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Send message in current tenant
   */
  async sendMessage(messageData) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    // Verify the conversation belongs to this tenant
    const { data: conversation, error: convError } = await getTenantQuery('conversations', tenant.slug)
      .select('id')
      .eq('id', messageData.conversation_id)
      .single();
    
    if (convError) throw new Error('Conversation not found or access denied');
    
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

/**
 * User Management API with tenant filtering
 */
export const tenantUsers = {
  /**
   * Get users for current tenant
   */
  async getUsers() {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    // Only admins can see all users in a tenant
    if (access.role !== 'admin') {
      throw new Error('Insufficient permissions');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('client_slug', tenant.slug)
      .order('full_name');
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get current user's profile for current tenant
   */
  async getCurrentUser() {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Update current user's profile for current tenant
   */
  async updateProfile(updates) {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('email', user.email)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

/**
 * Client/Organization API
 */
export const tenantClient = {
  /**
   * Get current tenant information
   */
  async getInfo() {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('slug', tenant.slug)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get user memberships for current tenant
   */
  async getMemberships() {
    const tenant = getCurrentTenant();
    const access = await validateTenantAccess(tenant.slug);
    
    if (!access.authorized) {
      throw new Error('Access denied to this tenant');
    }
    
    // Only admins can see all memberships
    if (access.role !== 'admin') {
      throw new Error('Insufficient permissions');
    }
    
    const { data, error } = await supabase
      .from('client_memberships')
      .select(`
        *,
        profiles(email, full_name),
        clients(name, slug)
      `)
      .eq('client_id', tenant.slug)
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

/**
 * Generic tenant-aware query builder
 * Use this for custom queries that need tenant filtering
 */
export function createTenantQuery(tableName, tenantSlug = null) {
  const tenant = tenantSlug || getCurrentTenant().slug;
  return getTenantQuery(tableName, tenant);
}

/**
 * Execute a tenant-aware query with access validation
 */
export async function executeTenantQuery(queryFn, tenantSlug = null) {
  const tenant = tenantSlug || getCurrentTenant().slug;
  const access = await validateTenantAccess(tenant);
  
  if (!access.authorized) {
    throw new Error('Access denied to this tenant');
  }
  
  return queryFn();
}
