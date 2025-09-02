import React from 'react'
import TopBar from '../../component/TopBar'
import SideBar from '../../component/SideBar'
import Footer from '../../component/Footer'
import Link from 'next/link'

const page = () => {
  return (
    <div>
        <TopBar name="NAME ENDPOINT"/>
        <SideBar />
        <div>
        <div className='border-[#102c57] text-[#102c57] -z-10 font-poppins p-3 w-4/5 border-1.5 ml-4.5 sm:ml-24'>
            <p className='sm:text-3xl text-xl'>Student Details</p>
            <br/>
            <br/>
            <p className='font-bold'>Email Address</p>
            <p className='text-[#b42625]'>email endpoint</p>        {/*email endpoint*/}
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
        <button className='border-[#b42625] bg-[#b42625] text-white -z-10 font-poppins p-3 w-1/4 mt-3 border-1.5 ml-4 sm:ml-24 mb-5'>Log Out</button>
        <Footer />
        </div>
    </div>
  )
}

export default page