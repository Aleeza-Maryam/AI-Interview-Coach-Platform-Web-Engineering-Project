import React, { useState } from 'react'
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
  // Check karenge ke kya user already logged in hai
  const isAuthenticated = !!localStorage.getItem('token')

  // AGAR user pehle se logged in hai, tou splash screen nahi dikhani (false), warna true
  const [showSplash, setShowSplash] = useState(!isAuthenticated)

  // Sabse pehle splash screen tabhi dikhegi agar user logged in nahi hai
  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />
  }

  return (
    <BrowserRouter>
      {/* Dark modern theme toasters globally integrated */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
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