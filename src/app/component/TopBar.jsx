'use client'
import React from 'react'

const TopBar = (props) => {
  return (
    <main className='-z-10 ml-16 h-30 sm:h-44 w-9/12 sm:w-11/12 flex flex-row justify-between'>
        <img src='dcmsLogo.png' className='w-3/4 sm:pt-0 pt-3.5 sm:-mt-6'/>
        <div className='hidden sm:block mt-6 sm:flex-row overflow-hidden'>
            <img src='profile.png' className='h-16 rounded-full mx-auto'/>
            <p className='text-black'>{props.name}</p>
        </div>
    </main>
  )
}

export default TopBar
