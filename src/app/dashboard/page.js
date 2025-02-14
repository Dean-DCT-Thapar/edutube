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
import Card from '../component/Card';

import Searchbar from '../component/Searchbar/searchbar.jsx';
import Coursetoggle from '../component/Toggle/toggle.jsx';
import Cards from '../component/Card/carousel.jsx';
import SearchCard from '../component/SearchCard';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();

    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState("Courses");
    const [watchHistory, setWatchHistory] = useState([]);
    const [loadingWatchHistory, setLoadingWatchHistory] = useState(false);

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
                    throw new Error('Authentication failed');
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage, {id: loadingToast});
                router.push('/login');
            });
    }, [router]);

    useEffect(() => {
        if (activeTab != "Courses") {
            setLoadingWatchHistory(true);
            axios.get('/api/watch-history')
                .then((response) => {
                    setWatchHistory(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching watch history:", error);
                })
                .finally(() => {
                    setLoadingWatchHistory(false);
                });
        }
    }, [activeTab]);

    const gridStyle = {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      width: "80%",
      gap: "2rem",
      padding: "1rem",
    };

    return (
      <div>
        <TopBar name={userData?.name} />
        <SideBar />
        <div className='ml-20'>
          <div>
            <img src='/dashboard_header.svg' className='w-9/12 sm:w-11/12 sm:mx-auto sm:top-32 absolute -z-10'/>
            <CurrentDate />
            <p className='sm:text-xl text-xs font-montserrat ml-[15%] max-w-fit text-white font-light mt-[7%]'>{userData ? userData.name : "Loading..."}</p>
          </div>
          <div className='sm:mt-[15%] mt-4'>
            <Searchbar />
            <Coursetoggle setActiveTab={setActiveTab} />
          </div>
          <div>
            {activeTab === "Courses" ? (
              <div>
                <p className='text-3xl font-poppins text-[#102c57] font-bold'>YOUR ENROLLED COURSES</p>
                <Cards/>
              </div>
            ) : (
              <div>
                <p className='text-3xl font-poppins text-[#102c57] font-bold'>YOUR WATCH HISTORY</p>
                {loadingWatchHistory ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {watchHistory.map((result, index) => (
                      <li key={index} style={{ marginBottom: "10px" }}>
                        <div>
                          <Link href={`/course_page/${result.teacher_id}?chapter=${result.chapter_number}&lecture=${result.lecture_number}`}>
                            <SearchCard main_title={result.title} subtitle1={result.course_name} subtitle2={result.teacher_name} type="lecture" subtitle3={"Progress- " + result.progress_percentage + "%"} />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    )
}