'use client'
import React from 'react'
import Search from '../component/Search_new'
import SideBar from '../component/SideBar'
import TopBar from '../component/TopBar'
import SearchCard from '../component/SearchCard'
import VideoDisplay from '../component/VideoDisplay'

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-white">
    <TopBar />
    <SideBar />
      <div className="container mx-auto px-4">
        <Search />
      </div>
    </div>
  )
}

export default SearchPage
