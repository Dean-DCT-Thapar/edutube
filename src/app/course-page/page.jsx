"use client"

import React from 'react'
import Header from '../component/L_Header'
import SideBar from '../component/VidSideBar'
import VideoPlayer from '../component/localVideoPlayer.jsx'

const page = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    console.log("Client mount - setting isClient to true")
    setIsClient(true);
  }, []);

  return (
    <>
      <Header />
      <div style={{display:"flex"}}> 
        <SideBar />
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            {isClient ? <VideoPlayer src="/videos/video1.mp4" /> : <p>Loading video...</p>}
        </div>
      </div>
    </>
  )
}

export default page


