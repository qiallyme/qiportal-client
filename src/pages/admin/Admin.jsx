import { useUser } from '../../context/UserContext'

const AdminPanel = () => {
  const { email, role } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Panel</h1>
          <p className="text-subtext">Welcome back, {email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-xl2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-subtext text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">156</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-subtext text-sm">Active Sessions</p>
                <p className="text-3xl font-bold text-white">23</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-xl2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-subtext text-sm">System Status</p>
                <p className="text-3xl font-bold text-green-400">Online</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass p-6 rounded-xl2 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn btn-primary">Add User</button>
            <button className="btn btn-ghost">View Logs</button>
            <button className="btn btn-ghost">System Settings</button>
            <button className="btn btn-ghost">Backup Data</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-6 rounded-xl2">
          <h2 className="text-xl font-semibold text-white mb-4">System Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">New user registered</p>
                <p className="text-sm text-subtext">john.doe@example.com joined the platform</p>
              </div>
              <span className="text-sm text-subtext">5 minutes ago</span>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">System warning</p>
                <p className="text-sm text-subtext">High memory usage detected</p>
              </div>
              <span className="text-sm text-subtext">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
