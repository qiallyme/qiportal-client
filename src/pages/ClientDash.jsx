// src/pages/ClientDash.jsx
import { useUser } from "../context/UserContext";

export default function ClientDash() {
  const { user, email, role } = useUser();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Client Dashboard</h1>
      <p className="mt-2 opacity-80">Signed in as: {email ?? "…"}</p>
      <p className="mt-1 opacity-80">Role: {role}</p>
      
      <div className="mt-4">
        <h2 className="text-lg font-medium mb-2">Welcome to your dashboard</h2>
        <p className="text-gray-600">
          This is where you'll see your projects, tasks, and important updates.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Quick Actions</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            View Projects
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Contact Support
          </button>
        </div>
      </div>

      <button 
        className="mt-4 underline" 
        onClick={() => window.location.href = "/logout"}
      >
        Logout
      </button>
    </div>
  );
}
