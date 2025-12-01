"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ApiFetcher from '@/utils/apis';
import { toast } from 'react-toastify';
import { loginAuth } from "@/utils/auth"; 

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [loginData, setLoginData] = useState({ email: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptTerms: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  // Set active tab based on current route and check for saved email
  useEffect(() => {
    if (router.pathname === '/register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }

    // Check if there's a saved email in localStorage
    const savedEmail = localStorage.getItem('loginEmail');
    if (savedEmail) {
      setLoginData({ email: savedEmail });
    }
  }, [router.pathname]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ email: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!loginData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoginLoading(true);

    try {
      // Save email to localStorage
      localStorage.setItem('loginEmail', loginData.email);

      // Make API call to send email OTP
      const formData = new FormData();
      formData.append('email', loginData.email);
      formData.append('view', 'email');

      const response = await ApiFetcher.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If email sent successfully, show OTP modal
      if (response.data) {
        toast.success('OTP sent to your email!');
        setShowOtpModal(true);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error messages from API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
      
      // Remove saved email on error
      localStorage.removeItem('loginEmail');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsOtpLoading(true);

    try {
      
      const savedEmail = localStorage.getItem('loginEmail');
      if (!savedEmail) {
        toast.error('Session expired. Please try logging in again.');
        setShowOtpModal(false);
        return;
      }

      // Make API call to verify OTP
      const formData = new FormData();
      formData.append('email', savedEmail);
      formData.append('view', 'otp');
      formData.append('otp', otp);

      const response = await ApiFetcher.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If OTP verification is successful
      if (response.data) {
        toast.success('Login successful!');
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
        loginAuth(response.data.data.token);
        
        // Remove saved email from localStorage
        localStorage.removeItem('loginEmail');
        
        // Reset OTP and close modal
        setOtp('');
        setShowOtpModal(false);
        
        // Redirect to home page after successful login
        router.push('/');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      // Handle specific error messages from API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('OTP verification failed. Please try again.');
      }
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const savedEmail = localStorage.getItem('loginEmail');
    if (!savedEmail) {
      toast.error('No email found. Please try logging in again.');
      return;
    }

    try {
      
      // Make API call to resend OTP
      const formData = new FormData();
      formData.append('email', savedEmail);
      formData.append('view', 'email');

      const response = await ApiFetcher.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast.success('OTP resent to your email!');
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    }
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Validation
    if (!registerData.name || !registerData.email || !registerData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!registerData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      
      // Make API call to register endpoint
      const response = await ApiFetcher.post('/auth/register', {
        email: registerData.email,
        phone: registerData.phone,
        name: registerData.name
      });

      // If registration is successful
      if (response.data) {
        toast.success('Registration successful! Welcome to our platform.');
        
        // Reset form
        setRegisterData({
          name: '',
          email: '',
          phone: '',
          acceptTerms: true
        });

        // Redirect to home page after successful registration
        router.push('/');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error messages from API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setActiveTab('login');
    router.push('/login');
  };

  const switchToRegister = () => {
    setActiveTab('register');
    router.push('/register');
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 ">
        {/* Tabs */}
        <div className="flex justify-center mb-3 border-b border-gray-200">
          <button
            onClick={switchToLogin}
            className={`px-8 py-3 text-lg font-semibold transition-colors ${
              activeTab === 'login'
                ? 'text-gray-900 border-b-2 border-green-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={switchToRegister}
            className={`px-8 py-3 text-lg font-semibold transition-colors ${
              activeTab === 'register'
                ? 'text-gray-900 border-b-2 border-green-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-center text-gray-600 mb-6">
              Enter your email to login to your account
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoginLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoginLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={switchToRegister}
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-center text-gray-600 mb-6">
              There are many advantages to creating an account: the payment process is faster, Use of Escrow and much more.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={registerData.acceptTerms}
                  onChange={handleRegisterChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
              </div>
              <label className="ml-3 text-sm text-gray-600">
                By tapping "Sign Up" you accept our{' '}
                <Link href="/terms" className="text-green-600 font-semibold hover:text-green-700">
                  terms
                </Link>{' '}
                and{' '}
                <Link href="/conditions" className="text-green-600 font-semibold hover:text-green-700">
                  condition
                </Link>
              </label>
            </div>

            <button
              onClick={handleRegister}
              disabled={!registerData.acceptTerms || isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={switchToLogin}
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center px-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Enter OTP
            </h2>
            <p className="text-center text-gray-600 mb-6">
              We sent a verification code to your email
            </p>

            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <button
                  onClick={closeOtpModal}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Back to login
                </button>
                <button
                  onClick={handleResendOtp}
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={handleOtpSubmit}
                disabled={isOtpLoading || !otp}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isOtpLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      closeOtpModal();
                      switchToRegister();
                    }}
                    className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}