'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from './component/TopBar';
import Footer from './component/Footer';
import axios from 'axios';

export default function Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status using cookie-based auth
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/verify-auth');
        if (response.data.status === 200) {
          // User is authenticated, redirect to dashboard
          router.replace('/dashboard');
        }
      } catch (error) {
        // User is not authenticated, show landing page
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-blue-100">
        <TopBar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </main>
      </div>
    );
  }

  // Show a beautiful landing splash while redirecting
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-blue-100">
      <TopBar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-xl w-full text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-800 mb-4 drop-shadow-lg">Welcome to EduTube</h1>
          <p className="text-lg text-gray-700 mb-8">Your personalized learning platform for video courses, progress tracking, and more.</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.replace('/login')}
              className="px-6 py-3 rounded-lg bg-primary-700 text-white font-semibold shadow hover:bg-primary-800 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => router.replace('/dashboard')}
              className="px-6 py-3 rounded-lg bg-white border border-primary-700 text-primary-800 font-semibold shadow hover:bg-primary-50 transition-all"
            >
              Dashboard
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

