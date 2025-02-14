import React from 'react'
import Link from 'next/link'

const Header = (props) => {
  return (
    <div className="shadow-lg" style={{ zIndex: 2 }}>
        <div className="pb-3 border-b-2 shadow-sm">
        <ul className="flex flex-row space-x-4 items-center">
          <li className="flex justify-center cursor-pointer">
            <Link href="/dashboard" className="cursor-pointer">
              <img src="/thaparLogo.webp" className="h-16 ml-2 mt-2"/>
            </Link>
          </li>
          <li className="flex justify-center">
            <img src="/vert_line.png" className="h-16 ml-2 mt-2"/>
          </li>
          <li className="flex justify-center items-start h-full">
            <h1 className="font-poppins font-semibold text-2xl text-black mt-2">{props.heading}</h1>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header