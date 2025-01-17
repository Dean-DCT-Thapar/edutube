import React from 'react'
import Header from '../component/L_Header'
import SideBar from '../component/SideBar'
import L_Sidebar from '../component/L_SideBar'
import Video from '../component/L_Video'

const page = () => {
  return (
    <>
      <Header />
      <L_Sidebar />
      <SideBar />
      <Video title={"L2.2: Probability Theory"} videoID={"dZqpQ8pPUOM"} />
    </>
  )
}

export default page