import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { VerificationPending } from './pages/VerificationPending';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { OTPVerification } from './components/auth/OTPVerification'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={
              <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <SignInForm />
              </div>
            } />
            <Route path="/signup" element={
              <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <SignUpForm />
              </div>
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;