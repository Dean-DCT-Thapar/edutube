import React from 'react'
import Header from '../component/TopBar'
import SideBar from '../component/SideBar'
import L_Sidebar from '../component/L_SideBar'
import Video from '../component/L_Video'

const page = () => {
  return (
    <>
      <Header />
      <L_Sidebar />
      <SideBar />
      <Video title={"L2.1: Introduction"} videoID={"qV31Ssoi1mk"} />
    </>
  )
}

export default page