'use client'
import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import DvrSharpIcon from '@mui/icons-material/DvrSharp';
import Link from 'next/link';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
        <div className={`bg-[#102c57] h-full fixed -top-0 transition-all ${isOpen ? 'w-64' : 'w-14'}`}>
            <button onClick={toggleSidebar}>
                <MenuIcon fontSize='large' className='ml-3 mt-6'/>
            </button>
            <div className='flex flex-col ml-3 mt-10 justify-evenly h-1/2'>
              <Link href='/dashboard'>
                <div className='flex items-center'>
                  <HomeIcon fontSize='large' />
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Dashboard</span>
                </div>
                </Link>
                <div className='flex items-center'>
                  <SearchIcon fontSize='large' />
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Search</span>
                </div>
                <Link href='/profile'>
                <div className='flex items-center'>
                  <SettingsAccessibilityIcon fontSize='large'/>
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Profile</span>
                </div>
                </Link>
                <Link href='/watchHistory'>
                <div className='flex items-center'>
                  <DvrSharpIcon fontSize='large'/>
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Watch History</span>
                </div>
                </Link>
            </div>
        </div>
    </>
  )
}

export default SideBar

