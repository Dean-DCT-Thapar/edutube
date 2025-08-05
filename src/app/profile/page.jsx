'use client'
import React from 'react'
import toast from 'react-hot-toast'
import { useState ,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import TopBar from '../component/TopBar'
import SideBar from '../component/SideBar'
import Footer from '../component/Footer'
import Link from 'next/link'

const page = () => {

  const router = useRouter();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadingToast = toast.loading('Loading...', { id: 'loading' });

    Promise.all([
        axios.get('/api/verify-auth'),
        axios.get('/api/get-user-data')
    ])
        .then(([authResponse, userDataResponse]) => {
            if (authResponse.data.status === 200) {
                if (authResponse.data.role !== 'student') {
                    throw new Error('Access denied. Students only.');
                }
                toast.dismiss(loadingToast);
                setUserData(userDataResponse.data);
            } else {
                throw new Error('Authentication failed');
            }
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
            toast.error(errorMessage, {id: loadingToast});
            router.push('/login');
        });
}, [router]);

  const handleLogout = async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/login');
    } catch (error) {
        toast.error('Logout failed');
    }
};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar name={userData?.name} />
      
      <div className="flex flex-1">
        <SideBar />
        
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Student Details */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-800 mb-6">Student Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Email Address</p>
                  <p className="text-accent-600 font-medium">{userData?.email}</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Gender</p>
                  <p className="text-gray-700">Gender endpoint</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Program Type</p>
                  <p className="text-gray-700">Program type endpoint</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Branch Code</p>
                  <p className="text-gray-700">Branch code endpoint</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Date Of Birth</p>
                  <p className="text-gray-700">DOB endpoint</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Academic Year</p>
                  <p className="text-gray-700">Academic year endpoint</p>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-800 mb-6">Course Details</h2>
              
              <div>
                <p className="font-semibold text-gray-900 mb-1">Course Code</p>
                <p className="text-gray-700">Courses enrolled in</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/confirmPassword" className="flex-1">
                <button className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200">
                  Change Password
                </button>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-accent-600 text-white hover:bg-accent-500 focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all duration-200"
              >
                Log Out
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