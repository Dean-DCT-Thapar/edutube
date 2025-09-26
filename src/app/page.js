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
    <div className="min-h-screen bg-gray-900">
      <TopBar />
      
      {/* Hero Section with Background Image */}
      <main className="relative overflow-hidden min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/onboardingpage.jpg)',
          }}
        />
        
        {/* Background Overlay - Stronger overlay to handle bright red colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-transparent to-blue-900/40"></div>
        
        {/* Content overlay decorations - Subtle accent colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-white/10 to-primary-300/20 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-300/10 to-white/20 rounded-full filter blur-xl animate-pulse animation-delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-[85vh] text-center lg:text-left">
            
            {/* Hero Content - Full width with background */}
            <div className="w-full max-w-4xl space-y-8 animate-fade-in-up">
              {/* Logo Section */}
              <div className="flex justify-center lg:justify-start mb-8">
                <img 
                  src="/main-site-logo.svg" 
                  alt="EduTube" 
                  className="h-16 sm:h-20 lg:h-24 w-auto filter brightness-0 invert"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium animate-bounce-in border border-white/30">
                  <StarRounded className="w-4 h-4" />
                  <span>Thapar University's Premier Learning Platform</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                  Learn <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Smarter</span>,
                  <br />
                  Achieve <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">More</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-lg">
                  Transform your academic journey with EduTube's cutting-edge digital learning platform. 
                  Access premium courses, track your progress, and excel like never before.
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8">
                {[
                  { number: "500+", label: "Video Lectures" },
                  { number: "50+", label: "Courses Available" },
                  { number: "2000+", label: "Active Students" },
                  { number: "95%", label: "Success Rate" }
                ].map((stat, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => router.replace('/login')}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm"
                >
                  <span>Start Learning Today</span>
                  <ArrowForwardRounded className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => router.replace('/dashboard')}
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:-translate-y-1"
                >
                  <PlayArrowRounded className="w-5 h-5" />
                  <span>Explore Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave Transition */}
        <div className="relative">
          <svg className="w-full h-20 fill-gray-50" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,96L48,80C96,64,192,32,288,37.3C384,43,480,85,576,90.7C672,96,768,64,864,48C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful tools and features that make EduTube the perfect platform for your learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-blue-500 transition-all duration-300 transform group-hover:scale-110">
                    <Icon className="w-8 h-8 text-primary-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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

