'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { useState ,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import frontendApi from '@/utils/frontendApiClient';
import TopBar from '../component/TopBar'
import SideBar from '../component/SideBar'
import Footer from '../component/Footer'
import Link from 'next/link'
import { 
  PersonOutlined, 
  EmailOutlined, 
  LockOutlined, 
  ExitToAppOutlined,
  AccountCircleOutlined,
  SchoolOutlined
} from '@mui/icons-material';

const page = () => {

  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {

      try {
        const [authResponse, userDataResponse] = await Promise.all([
          frontendApi.verifyAuth(),
          frontendApi.getUserData()
        ]);

        if (authResponse.status === 200) {
          if (authResponse.role !== 'student') {
            throw new Error('Access denied. Students only.');
          }
          
          setUserData(userDataResponse);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
        toast.error(errorMessage);
        
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    const logoutToast = toast.loading('Logging out...', { id: 'logout' });
    
    try {
      await fetch('/api/logout', { method: 'POST' });
      toast.success('Logged out successfully', { id: 'logout' });
      router.push('/login');
    } catch (error) {
      toast.error('Logout failed', { id: 'logout' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar name={userData?.name} />
      
      <div className="flex flex-1">
        <SideBar />
        
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
            
            {/* Profile Header - Mobile responsive */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                    <AccountCircleOutlined className="text-4xl sm:text-5xl text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-2 sm:border-4 border-white flex items-center justify-center">
                    <span className="text-xs sm:text-sm">✓</span>
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{userData?.name || 'Student Profile'}</h1>
                  <p className="text-primary-100 text-sm sm:text-base mb-2">{userData?.email}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      <SchoolOutlined className="text-sm mr-1" />
                      Student
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Student Details - Mobile responsive */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <PersonOutlined className="mr-3 text-primary-600" />
                  Student Details
                </h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center mb-2">
                      <EmailOutlined className="text-primary-600 mr-2 text-lg" />
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Address</p>
                    </div>
                    <p className="text-primary-600 font-medium text-sm sm:text-base break-all">{userData?.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center mb-2">
                      <PersonOutlined className="text-primary-600 mr-2 text-lg" />
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Full Name</p>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{userData?.name || 'Not specified'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center mb-2">
                      <SchoolOutlined className="text-primary-600 mr-2 text-lg" />
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Account Type</p>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">Student Account</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center mb-2">
                      <AccountCircleOutlined className="text-primary-600 mr-2 text-lg" />
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Status</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-gray-700 text-sm sm:text-base">Active</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 sm:col-span-2">
                    <div className="flex items-center mb-2">
                      <PersonOutlined className="text-primary-600 mr-2 text-lg" />
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">Learning Progress</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                      <Link href="/browse" className="bg-white border border-gray-100 rounded-lg p-3 sm:p-2 flex-1 text-center group/stat cursor-pointer shadow-sm flex items-center justify-between sm:block">
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-tight font-medium">Courses Enrolled</div>
                        <div className="text-xl font-bold text-primary-600 group-hover/stat:text-primary-800 transition-colors">{userData?.enrolled_courses?.length || 0}</div>
                      </Link>
                      <Link href="/watchHistory" className="bg-white border border-gray-100 rounded-lg p-3 sm:p-2 flex-1 text-center group/stat cursor-pointer shadow-sm flex items-center justify-between sm:block">
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-tight font-medium">Videos Watched</div>
                        <div className="text-xl font-bold text-green-600 group-hover/stat:text-green-800 transition-colors">{userData?.videos_watched || 0}</div>
                      </Link>
                      <Link href="/dashboard" className="bg-white border border-gray-100 rounded-lg p-3 sm:p-2 flex-1 text-center group/stat cursor-pointer shadow-sm flex items-center justify-between sm:block">
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-tight font-medium">Learning Hours</div>
                        <div className="text-xl font-bold text-blue-600 group-hover/stat:text-blue-800 transition-colors">{userData?.learning_hours || 0}h</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/confirmPassword" className="block">
                <button className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 space-x-2">
                  <LockOutlined className="text-lg" />
                  <span>Change Password</span>
                </button>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="w-full inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 space-x-2"
              >
                <ExitToAppOutlined className="text-lg" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default page