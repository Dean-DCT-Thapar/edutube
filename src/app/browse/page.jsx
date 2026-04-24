'use client'
import React from 'react'
import Browse from '../component/Browse'
import SideBar from '../component/SideBar'
import TopBar from '../component/TopBar'
import Footer from '../component/Footer'

const BrowsePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <TopBar />
      <div className="flex min-w-0">
        <SideBar />
        <main className="flex-1 min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out">
          <Browse />
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default BrowsePage
