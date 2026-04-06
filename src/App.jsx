import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InvitePage from './InvitePage';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route: Show a welcome/placeholder message */}
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center text-white max-w-md">
              <h1 className="text-3xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-indigo-300">
                Syntechcraft Event Invites
              </h1>
              <p className="text-gray-300 mb-6">Please use a valid invitation link to view your event details.</p>
              <a href="/admin" className="text-sm font-medium text-pink-300 hover:text-pink-200 transition underline">
                Go to Admin Dashboard
              </a>
            </div>
          </div>
        } />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<Dashboard />} />

        {/* Specific invite route */}
        <Route path="/invite/:slug" element={<InvitePage />} />
        
        {/* Catch-all route to redirect back to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
