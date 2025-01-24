import React from 'react'
import Header from '../component/TopBar'
import SideBar from '../component/SideBar'
import Sidebar from '../component/VidSideBar'
import Video from '../component/L_Video'

const page = () => {
  return (
    <>
      <Header />
      <SideBar />
      <Sidebar />
      <Video title={"L2.1: Introduction"} videoID={"qV31Ssoi1mk"} />
    </>
  )
}

export default page