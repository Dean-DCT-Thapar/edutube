"use client"

import React, { useRef, useEffect } from 'react'
import Header from '../component/TopBar'
import L_SideBar from '../component/L_SideBar'
import SideBar from '../component/SideBar'
import Overview from '../component/L_Overview';
import Welcome from '../component/L_Welcome';
import Video from '../component/L_Video';

const page = () => {

    const sidebarRef = useRef();

    const handleComp = (x) => {
        console.log(x);
        if(x === 0){
            return <Overview />
        }
        else if(x === 1){
            return <Video title={"L2.1: Examples of Uniform Convergence | Series of Function"} videoID={"9J7k1MPkR1U"} />
        }
        else if(x === 2){
            return <Video title={"L2.2: Center of Mass | Concept and Examples"} videoID={"U0dGIPA_ttk"} />
        }
        else{
            return <Welcome />
        }
    }

  return (
    <>
        <Header />
        <L_SideBar ref={sidebarRef}/>
        <SideBar />
        <Welcome />
    </>
  )
}

export default page


