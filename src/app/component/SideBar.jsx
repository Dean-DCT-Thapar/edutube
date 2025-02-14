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
        <div className={`bg-[#102C57] h-full fixed z-10 -top-0 transition-all ${isOpen ? 'w-64' : 'w-16'}`}>
            <button onClick={toggleSidebar}>
                <MenuIcon fontSize='large' className='ml-4 mt-12'/>
            </button>
            <div className='flex flex-col ml-4 mt-10 justify-evenly h-1/2'>
              <Link href='/dashboard'>
                <div className='flex items-center'>
                  <HomeIcon fontSize='large' />
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Dashboard</span>
                </div>
                </Link>
                <Link href='/search'>
                <div className='flex items-center'>
                  <SearchIcon fontSize='large' />
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Search</span>
                </div>
                </Link>
                <Link href='/profile'>
                <div className='flex items-center'>
                  <SettingsAccessibilityIcon fontSize='large'/>
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl`}>Profile</span>
                </div>
                </Link>
                <Link href='/watchHistory'>
                <div className='flex items-center'>
                  <DvrSharpIcon fontSize='large'/>
                  <span className={`${isOpen ? 'block' : 'hidden'} ml-4 text-white font-poppins text-2xl whitespace-nowrap`}>Watch History</span>
                </div>
                </Link>
            </div>
        </div>
    </>
  )
}

export default SideBar

