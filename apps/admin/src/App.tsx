import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/admin-dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
