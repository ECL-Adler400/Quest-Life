import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Settings } from './pages/Settings';
import { Dashboard } from './pages/Dashboard';
// Other imports...
import './App.css';
import NewLogo from './assets/new-logo.svg'; // Make sure to use the new logo everywhere

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <img src={NewLogo} className="corner-logo" alt="logo" />
        {/* Simplified header center - removed title and using consistent logo */}
        <div className="header-center">
          <img src={NewLogo} className="center-logo" alt="logo" />
          {/* Title removed */}
        </div>
        <nav>{/* Navigation items */}</nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          {/* Other routes */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
