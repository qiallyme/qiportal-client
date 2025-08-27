import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export default function Calls() {
  const { email, role } = useUser();
  const [activeCall, setActiveCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [isInCall, setIsInCall] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calls & Conferencing</h1>
          <p className="mt-2 text-gray-600">Voice calls, video meetings, and conference management</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Call Controls */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Call Center</h2>
              
              {!isInCall ? (
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Voice Call
                    </button>
                    <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Video Call
                    </button>
                  </div>

                  {/* Dial Pad */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Dial Pad</h3>
                    <div className="grid grid-cols-3 gap-2 max-w-xs">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
                        <button
                          key={num}
                          className="px-4 py-3 text-lg font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Contacts */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Contacts</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'John Doe', phone: '+1 (555) 123-4567', lastCall: '2 hours ago' },
                        { name: 'Jane Smith', phone: '+1 (555) 987-6543', lastCall: '1 day ago' },
                        { name: 'Mike Johnson', phone: '+1 (555) 456-7890', lastCall: '3 days ago' }
                      ].map((contact, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{contact.lastCall}</span>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Call in Progress</h3>
                  <p className="text-gray-600 mb-4">Duration: 00:05:32</p>
                  <button 
                    onClick={() => setIsInCall(false)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    End Call
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Call History & Schedule */}
          <div className="space-y-6">
            {/* Call History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call History</h3>
              <div className="space-y-3">
                {[
                  { type: 'Incoming', contact: 'John Doe', duration: '5:32', time: '2 hours ago', status: 'completed' },
                  { type: 'Outgoing', contact: 'Jane Smith', duration: '12:45', time: '1 day ago', status: 'completed' },
                  { type: 'Missed', contact: 'Mike Johnson', duration: '--', time: '3 days ago', status: 'missed' }
                ].map((call, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        call.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{call.contact}</p>
                        <p className="text-sm text-gray-600">{call.type} • {call.duration}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{call.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Meetings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Meetings</h3>
              <div className="space-y-3">
                {[
                  { title: 'Project Review', time: 'Tomorrow 10:00 AM', participants: 3 },
                  { title: 'Client Consultation', time: 'Friday 2:00 PM', participants: 2 },
                  { title: 'Team Standup', time: 'Monday 9:00 AM', participants: 5 }
                ].map((meeting, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-600">{meeting.time}</p>
                    <p className="text-xs text-gray-500">{meeting.participants} participants</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
