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
    <div>
        <TopBar name={userData?.name}/>
        <SideBar />
        <div>
        <div className='border-[#102c57] border-1.5 text-[#102c57] -z-10 font-poppins p-3 w-4/5 ml-4.5 sm:ml-24'>
            <p className='sm:text-3xl text-xl'>Student Details</p>
            <br/>
            <br/>
            <p className='font-bold'>Email Address</p>
            <p className='text-[#b42625]'>{userData?.email}</p>        {/*email endpoint*/}
            <br/>
            <p className='font-bold'>Gender</p> 
            <p>gender endpoint</p>                                                 {/*gender endpoint*/}                    
            <br/>
            <p className='font-bold'>Program Type</p>
            <p>program type endpoint</p>                                            {/*program type endpoint*/}
            <br/>
            <p className='font-bold'>Branch Code</p>
            <p>branch code endpoint</p>                                            {/*branch code endpoint*/}
            <br/>
            <p className='font-bold'>Date Of Birth</p>
            <p>dob endpoint</p>                                            {/*dob endpoint*/}
            <br/>
            <p className='font-bold'>Academic Year</p>
            <p>academic year endpoint</p>                                            {/*academic year endpoint*/}
        </div>
        <div className='border-[#102c57] text-[#102c57] -z-10 font-poppins p-3 w-4/5 mt-3 border-1.5 ml-4.5 sm:ml-24'>
            <p className='sm:text-3xl text-xl'>Course Details</p>
            <br/>
            <br/>
            <p className='font-bold'>Course Code</p>
            <p>courses enrolled in</p>                          {/*endpoint for enrolled courses */}
        </div>
        <Link href="/confirmPassword">
        <button className='border-[#102c57] bg-[#102c57] text-white -z-10 font-poppins p-3 w-1/2 sm:w-1/4 mt-3 border-1.5 ml-4.5 sm:ml-48'>Change Password</button>
        </Link>
        <button onClick={handleLogout} className='border-[#b42625] bg-[#b42625] text-white -z-10 font-poppins p-3 w-1/4 mt-3 border-1.5 ml-4 sm:ml-24 mb-5'>Log Out</button>
        <Footer />
        </div>
    </div>
  )
}

export default page