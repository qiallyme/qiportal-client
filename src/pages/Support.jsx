import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export default function Support() {
  const { email, role } = useUser();
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      title: 'Login issues with new interface',
      status: 'open',
      priority: 'high',
      category: 'Technical',
      created: '2024-01-15',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'TKT-002',
      title: 'Billing question about subscription',
      status: 'in-progress',
      priority: 'medium',
      category: 'Billing',
      created: '2024-01-14',
      lastUpdate: '1 day ago'
    },
    {
      id: 'TKT-003',
      title: 'Feature request: Dark mode',
      status: 'closed',
      priority: 'low',
      category: 'Feature Request',
      created: '2024-01-10',
      lastUpdate: '3 days ago'
    }
  ]);

  const tabs = [
    { id: 'tickets', name: 'My Tickets', icon: '🎫' },
    { id: 'new-ticket', name: 'New Ticket', icon: '➕' },
    { id: 'faq', name: 'FAQ', icon: '❓' },
    { id: 'contact', name: 'Contact', icon: '📞' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-2 text-gray-600">Get help with your account, billing, and technical issues</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'tickets' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Support Tickets</h2>
                <button 
                  onClick={() => setActiveTab('new-ticket')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Ticket
                </button>
              </div>
              
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>#{ticket.id}</span>
                          <span>•</span>
                          <span>{ticket.category}</span>
                          <span>•</span>
                          <span>Created {ticket.created}</span>
                          <span>•</span>
                          <span>Updated {ticket.lastUpdate}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'new-ticket' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Support Ticket</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Technical Issue</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                      <option>Account Access</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      <button type="button" className="font-medium text-blue-600 hover:text-blue-500">
                        Upload files
                      </button>
                      {' '}or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tickets')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {[
                  {
                    question: 'How do I reset my password?',
                    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.'
                  },
                  {
                    question: 'How do I update my billing information?',
                    answer: 'Go to Settings > Billing to update your payment methods and billing address. You can also download invoices and manage your subscription there.'
                  },
                  {
                    question: 'What are the system requirements?',
                    answer: 'Our platform works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.'
                  },
                  {
                    question: 'How do I invite team members?',
                    answer: 'Admins can invite team members by going to the Admin panel and using the "Invite User" feature. Invitees will receive an email with setup instructions.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                      {faq.question}
                    </button>
                    <div className="px-4 pb-3">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Get in Touch</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email Support</p>
                        <p className="text-sm text-gray-600">support@qially.com</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone Support</p>
                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                        <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Live Chat</p>
                        <p className="text-sm text-gray-600">Available 24/7</p>
                        <p className="text-xs text-gray-500">Instant response</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Contact Form</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
