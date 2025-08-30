import { supabase } from './supabase';

// Get conversations for the current user
export async function getConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          user_id,
          profiles(email, full_name, role)
        ),
        messages:messages(
          id,
          content,
          created_at,
          sender_id,
          profiles(email, full_name)
        )
      `)
      .or(`participants.user_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getConversations:', error);
    return [];
  }
}

// Get messages for a specific conversation
export async function getMessages(conversationId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles(email, full_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
}

// Send a new message
export async function sendMessage(conversationId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

// Create a new conversation
export async function createConversation(title, participantEmails = []) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  try {
    // Start a transaction
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        title: title,
        created_by: user.id
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const participants = [user.id]; // Always include the creator
    
    // Get user IDs for participant emails
    if (participantEmails.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .in('email', participantEmails);

      if (usersError) throw usersError;
      
      participants.push(...users.map(u => u.id));
    }

    // Insert participants
    const participantData = participants.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }));

    const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participantData);

    if (partError) throw partError;

    return conversation;
  } catch (error) {
    console.error('Error in createConversation:', error);
    throw error;
  }
}

// Subscribe to real-time message updates
export function subscribeToMessages(conversationId, callback) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      callback
    )
    .subscribe();
}

// Subscribe to conversation updates
export function subscribeToConversations(callback) {
  return supabase
    .channel('conversations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations'
      },
      callback
    )
    .subscribe();
}

// Mark conversation as read
export async function markConversationAsRead(conversationId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
  } catch (error) {
    console.error('Error marking conversation as read:', error);
  }
}
