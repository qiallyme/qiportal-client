import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function Messages() {
  const { email, role } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const conversations = [
    {
      id: 1,
      title: 'Process Optimization Updates',
      participants: ['Cody', 'Sarah'],
      lastMessage: 'The timeline has been updated based on your feedback.',
      lastMessageTime: '2 hours ago',
      unread: true,
      status: 'active',
      messages: [
        { id: 1, sender: 'Cody', message: 'Hi! I wanted to update you on the process optimization project.', time: '2 hours ago', type: 'received' },
        { id: 2, sender: 'You', message: 'Thanks Cody, what\'s the latest?', time: '1 hour ago', type: 'sent' },
        { id: 3, sender: 'Cody', message: 'The timeline has been updated based on your feedback.', time: '2 hours ago', type: 'received' }
      ]
    },
    {
      id: 2,
      title: 'System Integration Planning',
      participants: ['Mike', 'John'],
      lastMessage: 'Please review the technical specifications.',
      lastMessageTime: '1 day ago',
      unread: false,
      status: 'active',
      messages: [
        { id: 1, sender: 'Mike', message: 'I\'ve prepared the technical specifications for the system integration.', time: '1 day ago', type: 'received' },
        { id: 2, sender: 'You', message: 'Great, I\'ll review them this week.', time: '1 day ago', type: 'sent' },
        { id: 3, sender: 'Mike', message: 'Please review the technical specifications.', time: '1 day ago', type: 'received' }
      ]
    },
    {
      id: 3,
      title: 'General Support',
      participants: ['Support Team'],
      lastMessage: 'Your issue has been resolved.',
      lastMessageTime: '3 days ago',
      unread: false,
      status: 'resolved',
      messages: [
        { id: 1, sender: 'Support Team', message: 'We\'ve identified the issue with your login.', time: '3 days ago', type: 'received' },
        { id: 2, sender: 'You', message: 'Thank you for the quick response.', time: '3 days ago', type: 'sent' },
        { id: 3, sender: 'Support Team', message: 'Your issue has been resolved.', time: '3 days ago', type: 'received' }
      ]
    }
  ];

  const teamMembers = [
    { id: 1, name: 'Cody', role: 'Project Manager', avatar: 'CD', online: true },
    { id: 2, name: 'Sarah', role: 'Process Specialist', avatar: 'SM', online: true },
    { id: 3, name: 'Mike', role: 'Technical Lead', avatar: 'MT', online: false },
    { id: 4, name: 'John', role: 'Support Specialist', avatar: 'JS', online: true },
    { id: 5, name: 'Support Team', role: 'General Support', avatar: 'ST', online: true }
  ];

  const filteredConversations = conversations.filter(conv => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return conv.unread;
    if (activeTab === 'active') return conv.status === 'active';
    if (activeTab === 'resolved') return conv.status === 'resolved';
    return true;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Communicate with your QiAlly team</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-ghost">Help</button>
              <button className="btn btn-primary">New Conversation</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', name: 'All', count: conversations.length },
                  { id: 'unread', name: 'Unread', count: conversations.filter(c => c.unread).length },
                  { id: 'active', name: 'Active', count: conversations.filter(c => c.status === 'active').length },
                  { id: 'resolved', name: 'Resolved', count: conversations.filter(c => c.status === 'resolved').length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{member.avatar}</span>
                      </div>
                      {member.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-500 truncate">{member.role}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <div className="bg-white rounded-xl shadow-sm border h-[600px] flex flex-col">
                {/* Conversation Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedConversation.title}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.participants.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'sent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversation List (Mobile) */}
        <div className="lg:hidden mt-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.title}
                        </h4>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
