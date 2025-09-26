'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from './component/TopBar';
import Footer from './component/Footer';
import frontendApi from '@/utils/frontendApiClient';
import { 
  PlayArrowRounded, 
  SchoolRounded, 
  TrendingUpRounded, 
  GroupRounded,
  StarRounded,
  CheckCircleRounded,
  ArrowForwardRounded
} from '@mui/icons-material';

export default function Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: PlayArrowRounded,
      title: "Interactive Video Learning",
      description: "Engage with high-quality video lectures designed for optimal learning"
    },
    {
      icon: TrendingUpRounded,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and insights"
    },
    {
      icon: GroupRounded,
      title: "Collaborative Learning",
      description: "Connect with peers and instructors in a dynamic learning environment"
    },
    {
      icon: SchoolRounded,
      title: "Expert Instructors",
      description: "Learn from Thapar University's renowned faculty and industry experts"
    }
  ];

  useEffect(() => {
    // Check authentication status using cookie-based auth
    const checkAuth = async () => {
      try {
        const response = await frontendApi.verifyAuth();
        if (response.status === 200) {
          // User is authenticated, redirect to dashboard
          router.replace('/dashboard');
        }
      } catch (error) {
        // User is not authenticated, show landing page
        setIsChecking(false);
      }
    };

    checkAuth();

    // Feature carousel auto-rotation
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [router, features.length]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <TopBar />
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-700"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-400 animate-pulse"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Initializing your learning experience...</p>
        </main>
      </div>
    );
  }

  // Beautiful modern landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <TopBar />
      
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary-200 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary-100 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Column - Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium animate-bounce-in">
                  <StarRounded className="w-4 h-4" />
                  <span>Thapar University's Premier Learning Platform</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Learn <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Smarter</span>,
                  <br />
                  Achieve <span className="bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent">More</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Transform your academic journey with EduTube's cutting-edge digital learning platform. 
                  Access premium courses, track your progress, and excel like never before.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.replace('/login')}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Start Learning Today</span>
                  <ArrowForwardRounded className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => router.replace('/dashboard')}
                  className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:border-primary-300 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <PlayArrowRounded className="w-5 h-5" />
                  <span>Explore Dashboard</span>
                </button>
              </div>
            </div>

            {/* Right Column - Onboarding Image */}
            <div className="relative animate-fade-in-right">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 bg-white">
                {/* Main Onboarding Image */}
                <div className="aspect-[4/3] relative overflow-hidden rounded-2xl">
                  <img 
                    src="/onboardingpage.jpg"
                    alt="EduTube Learning Platform - Students engaging in digital learning"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to feature showcase if image fails
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  
                  {/* Fallback Feature Showcase */}
                  <div className="hidden bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Platform Features</h3>
                      <div className="flex space-x-1">
                        {features.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentFeature(index)}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                              index === currentFeature ? 'bg-primary-600' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Current Feature Display */}
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-4 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl">
                          {React.createElement(features[currentFeature].icon, {
                            className: "w-8 h-8 text-primary-700"
                          })}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {features[currentFeature].title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {features[currentFeature].description}
                          </p>
                        </div>
                      </div>

                      {/* Feature Preview */}
                      <div className="bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <PlayArrowRounded className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-3 bg-gradient-to-r from-primary-200 to-blue-200 rounded-full mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircleRounded className="w-4 h-4 text-green-500" />
                            <span>Interactive learning modules</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircleRounded className="w-4 h-4 text-green-500" />
                            <span>Real-time progress tracking</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircleRounded className="w-4 h-4 text-green-500" />
                            <span>Personalized learning paths</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Overlay with Platform Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <img 
                        src="/main-site-logo.svg" 
                        alt="EduTube" 
                        className="h-8 w-auto filter brightness-0 invert"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Experience Learning Excellence</h3>
                    <p className="text-sm opacity-90">Join thousands of students in their educational journey</p>
                    
                    {/* Stats overlay */}
                    <div className="flex items-center space-x-4 mt-4 text-xs opacity-80">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>2000+ Students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>500+ Lectures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual appeal */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-float opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-float-delay opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Transition */}
        <div className="relative">
          <svg className="w-full h-20 fill-primary-50" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,96L48,80C96,64,192,32,288,37.3C384,43,480,85,576,90.7C672,96,768,64,864,48C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delay {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 1s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float-delay 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}

