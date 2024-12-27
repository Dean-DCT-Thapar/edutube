'use client'
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
const WINDOWS_HOST = '192.168.29.209';


export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/verify-auth');
        if (response.data.status === 200) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.log("Not authenticated");
      }
    };

    // Only check auth if we're not already redirecting
    if (window.location.pathname === '/login') {
      checkAuth();
    }
  }, [router]);

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.post('/api/login', {
            email: formValues.email,
            password: formValues.password,
        });
        
        if (response.data.success) {
            router.push('/dashboard');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        toast.error(errorMessage);
        setFormValues({ email: '', password: '' });
    }
  };

  return (
    <div>
      <img className="h-screen w-screen absolute sm:hidden block" src="hostelMphone.jpg" alt="Hostel" />
      <img className="h-screen w-screen absolute sm:block hidden" src="mHostel.jpg" alt="Hostel" />
      <div className="bg-[#ededed] shadow-2xl shadow-black opacity-95 border-black rounded-xl h-2/3 pb-8 sm:w-1/3 w-2/3 mx-auto sm:top-55 top-32 relative">
        <img className="mx-auto w-72 relative" src="dcmsLogo.png" alt="Logo" />
        <h1 className="text-black font-sans text-center font-semibold text-3xl -mt-9">Sign In</h1>
        <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-black font-sans w-2/3 mx-auto font-semibold text-lg">Email</label>
            <input
              required
              className="w-2/3 mx-auto bg-[#ededed] border-2 border-[#b95454] rounded-xl focus:outline-[#974545] text-black py-1 px-2"
              placeholder="Email Address"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col mt-5">
            <div className='flex flex-row justify-between w-2/3 mx-auto'>
              <label className="text-black font-sans font-semibold text-lg">Password</label>
              <button onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityIcon className='text-black'/> : <VisibilityOffIcon className='text-black'/>}
              </button>
            </div>
            <input
              required
              className="w-2/3 mx-auto bg-[#ededed] border-2 border-[#b95454] rounded-xl focus:outline-[#974545] text-black py-1 px-2"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formValues.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button type='submit' className='text-white bg-[#b95454] border-2 border-[#b95454] rounded-xl w-2/3 mx-auto mt-5 py-1 hover:bg-[#ededed] hover:text-black hover:ease-linear duration-75'>Sign In</button>
        </form>
      </div>
    </div>
  );
}
