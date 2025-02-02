import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div>
        <div className="pb-3 border-b-2 shadow-sm">
        <ul className="flex flex-row justify-between">
          <li>
            <Link href="/dashboard">
            <img src="/thaparLogo.webp" className="h-16 ml-2 mt-2"/>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header