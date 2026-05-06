'use client'
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { SchoolRounded, LoginRounded } from '@mui/icons-material';
import frontendApi from '@/utils/frontendApiClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AdminLoginHelper from '../component/AdminLoginHelper';
import AdminDebugHelper from '../component/AdminDebugHelper';
import Link from 'next/link';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const router = useRouter();
  const supportEmail = 'dct.office@thapar.edu';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Login page: Checking authentication...');
        // Check authentication using cookies via API
        const response = await frontendApi.verifyAuth();
        
        console.log('Login page: Auth check response:', response);
        if (response.status === 200) {
          console.log('Login page: User already authenticated, redirecting...');
          // Check for return URL first
          const returnUrl = sessionStorage.getItem('returnUrl');
          if (returnUrl) {
            sessionStorage.removeItem('returnUrl');
            window.location.href = returnUrl; // Use full page redirect
            return;
          }
          
          // Default role-based redirect
          switch (response.role) {
            case 'student':
              window.location.href = '/dashboard'; // Use full page redirect
              break;
            case 'teacher':
              window.location.href = '/teacher-dashboard'; // Use full page redirect
              break;
            case 'admin':
              window.location.href = '/admin-dashboard'; // Use full page redirect
              break;
            default:
              console.error('Unknown role:', response.role);
          }
        }
      } catch (error) {
        console.log("Login page: Not authenticated, staying on login page");
        // No need to clear localStorage as we're using cookies now
      }
    };

    // Only check auth if we're not already redirecting
    if (window.location.pathname === '/login') {
      checkAuth();
    }
  }, [router]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsForgotModalOpen(false);
      }
    };

    if (isForgotModalOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isForgotModalOpen]);

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Login form submitted with:', { email: formValues.email, password: '***' });
    const loadingToast = toast.loading('Signing in...', {id: 'login-loading'});
    try {
        console.log('Calling /api/login...');
        const response = await frontendApi.login(formValues.email, formValues.password);
        
        console.log('Login response:', response);
        if (response.success) {
            toast.dismiss(loadingToast);
            console.log('Login successful, user role:', response.role);
            
            // Since we're using cookies now, we don't need to store tokens in localStorage
            // The cookies are automatically set by the /api/login endpoint
            
            // Redirect based on return URL or role
            const returnUrl = sessionStorage.getItem('returnUrl');
            if (returnUrl) {
                console.log('Redirecting to return URL:', returnUrl);
                sessionStorage.removeItem('returnUrl');
                window.location.href = returnUrl; // Use full page redirect instead of router
            } else {
                // Default role-based redirect
                console.log('Redirecting based on role:', response.role);
                switch (response.role) {
                  case 'student':
                    window.location.href = '/dashboard'; // Use full page redirect
                    break;
                  case 'teacher':
                    window.location.href = '/teacher-dashboard'; // Use full page redirect
                    break;
                  case 'admin':
                    window.location.href = '/admin-dashboard'; // Use full page redirect
                    break;
                  default:
                    toast.error('Unknown user role', {id: loadingToast});
                }
            }
        }
    }catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.message || 'Login failed';
        toast.error(errorMessage, {id: loadingToast});
        setFormValues({ email: '', password: '' });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Images */}
      <img className="h-screen w-screen absolute sm:hidden block object-cover" src="hostelMphone.jpg" alt="Hostel" />
      <img className="h-screen w-screen absolute sm:block hidden object-cover" src="mHostel.jpg" alt="Hostel" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 bg-opacity-90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <SchoolRounded className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome Back</h1>
          <p className="text-gray-200 drop-shadow">Sign in to continue your learning journey</p>
        </div>

        {/* Login Form */}
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl border border-gray-200 p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formValues.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                placeholder="Enter your email"
              />
              <p className="mt-2 text-xs text-gray-600">
                Students: use your <code>{'<rollnumber>@thapar.edu'}</code> email to sign in.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formValues.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit(e);
                    }
                  }}
                  className="w-full px-4 py-3 pr-12 bg-white border-2 border-red-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LoginRounded className="mr-2" />
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Welcome to Thapar EduTube
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Digital Learning Platform
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-200 drop-shadow">
            &copy; {new Date().getFullYear()} Thapar University. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Admin Login Helper for Development */}
      {/* <AdminLoginHelper /> */}
      
      {/* Debug Helper for Troubleshooting */}
      {/* <AdminDebugHelper /> */}

      {isForgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          onClick={() => setIsForgotModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="forgot-password-title" className="text-xl font-semibold text-gray-900">
                Forgot password?
              </h2>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close forgot password dialog"
              >
                Close
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              No worries - we can help you reset access. Please email us at{' '}
              <span className="font-semibold text-gray-900">{supportEmail}</span> with your details:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              <li>Students: include your roll number.</li>
              <li>Teachers: your official email is enough.</li>
            </ul>

            <a
              href={`mailto:${supportEmail}?subject=Password%20Reset%20Request`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Email Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
