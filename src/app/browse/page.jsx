'use client'
import React from 'react'
import Browse from '../component/Browse'
import SideBar from '../component/SideBar'
import TopBar from '../component/TopBar'

const BrowsePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="flex">
        <SideBar />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <Browse />
        </main>
      </div>
    </div>
  )
}

export default BrowsePage
