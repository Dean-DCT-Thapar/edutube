'use client'
import React from 'react'
import Link from 'next/link'

const TopBar = (props) => {
  return (
    <main className='-z-10 ml-16 h-30 sm:h-44 w-9/12 sm:w-11/12 flex flex-row justify-between'>
        <Link href="/dashboard">
          <img src='/dcmsLogo.png' className='ml-3 sm:pt-0 pt-3.5 sm:mt-5 sm:-mb-6 object-fit h-20 w-50'/>
        </Link>
        <Link href="/profile">
        <div className='hidden sm:block mt-6 sm:flex-row overflow-hidden'>
            <img src='/profile.png' className='h-16 rounded-full mx-auto'/>
            <p className='text-black'>{props.name}</p>
        </div>
        </Link>
    </main>
  )
}

export default TopBar
