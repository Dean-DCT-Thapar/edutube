'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from './component/TopBar';
import Footer from './component/Footer';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status (replace with your actual logic)
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
    if (isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [router]);

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

