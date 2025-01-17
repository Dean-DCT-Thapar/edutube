import React from 'react'

const Header = () => {
  return (
    <div>
        <div className="pb-3 border-b-2 shadow-sm">
        <ul className="flex flex-row justify-between">
          <li>
            <img src="/thaparLogo.webp" className="h-16 ml-2 mt-2"/>
          </li>
          <li>
            <button className="mr-5 mt-4 text-white font-bold bg-[#9f352c] p-2 rounded-3xl w-24">Sign Out</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header