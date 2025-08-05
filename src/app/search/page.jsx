'use client'
import React from 'react'
import Search from '../component/Search_new'
import SideBar from '../component/SideBar'
import TopBar from '../component/TopBar'
import SearchCard from '../component/SearchCard'
import VideoDisplay from '../component/VideoDisplay'

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="flex">
        <SideBar />
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Search />
          </div>
        </main>
      </div>
    </div>
  )
}

export default SearchPage
