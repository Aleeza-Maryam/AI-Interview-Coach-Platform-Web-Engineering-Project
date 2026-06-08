import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Report from './pages/Report'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SplashScreen from './components/SplashScreen'
import InterviewSession from './pages/InterviewSession'
function App() {
  const isAuthenticated = !!localStorage.getItem('token')

  // AGAR user pehle se logged in hai, tou splash screen nahi dikhani (false), warna true
  const [showSplash, setShowSplash] = useState(!isAuthenticated)

  // Theme (light/dark) persisted in localStorage; default to dark
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light')
    else document.documentElement.classList.remove('light')
    localStorage.setItem('theme', theme)
  }, [theme])

  
  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />
  }

  return (
    <BrowserRouter>
      <button
        onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        title="Toggle theme"
        style={{
          position: 'fixed',
          left: 16,
          top: 70,
          zIndex: 60,
          padding: '8px 10px',
          borderRadius: 8,
          background: 'var(--card)',
          color: 'var(--text)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      {/* Dark modern theme toasters globally integrated */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--text)',
            border: '1px solid rgba(59,130,246,0.08)',
            fontFamily: 'monospace',
            fontSize: '13px'
          },
        }} 
      />

      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes - Agar token nahi hai tou automatic login par redirect */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/interview" element={isAuthenticated ? <Interview /> : <Navigate to="/login" />} />
        <Route path="/report" element={isAuthenticated ? <Report /> : <Navigate to="/login" />} />
<Route path="/interview-session" element={<InterviewSession />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App