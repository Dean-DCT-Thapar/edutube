'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react'
import TopBar from '../component/TopBar'
import SideBar from '../component/SideBar'
import SkeletonCourseCard from '../component/SkeletonCourseCard'
import SkeletonVidCard from '../component/SkeletonVidCard'
import CurrentDate from '../component/CurrentDate'
import Footer from '../component/Footer'
import Card from '../component/Card'

export default function Dashboard() {
    const router = useRouter();

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadingToast = toast.loading('Loading...', { id: 'dashboard-loading' });

        Promise.all([
            axios.get('/api/verify-auth'),
            axios.get('/api/get-user-data')
        ])
            .then(([authResponse, userDataResponse]) => {
                if (authResponse.data.status === 200) {
                    if (authResponse.data.role !== 'student') {
                        throw new Error('Access denied. Students only.');
                    }
                    toast.success('Loaded successfully', { id: 'dashboard-loading' } , { duration: 100 });
                    setUserData(userDataResponse.data);
                } else {
                    throw new Error(authResponse.data.message || 'Authentication failed');
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
        <div>
      <TopBar name="NAME ENDPOINT"/>
      <SideBar />
      <div className='ml-20'>
        <div>
          <img src='dashboardCard1.png' className='w-9/12 sm:w-11/12 sm:mx-auto sm:top-32 absolute -z-10'/>
          <CurrentDate />
          <p className='sm:text-sm text-xs font-montserrat sm:ml-44 ml-10 pt-5 sm:pt-0 text-white font-light sm:mt-20'>NAME ENDPOINT</p>
        </div>
        <div className='sm:mt-32 mt-10'>
          <p className='text-3xl font-poppins text-[#102c57] font-bold'>YOUR WATCH HISTORY</p>
          <SkeletonVidCard />
        </div>
        <div>
          <p className='text-3xl font-poppins text-[#102c57] font-bold mt-10'>YOUR COURSES</p>
          <SkeletonCourseCard />
        </div>
      </div>
      <Footer />
    </div>
    );
}