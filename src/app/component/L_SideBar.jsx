"use client";

import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

// Use forwardRef to pass ref to the SideBar component
const SideBar = () => {
  const [selectedItem, setSelectedItem] = useState(3);

   const handleClick = (item) => {
    setSelectedItem(item);
  };

  /*useEffect(() => {
    ref.current = selectedItem;
    console.log(ref.current)
    }, [selectedItem, ref]);
 */
  return (
    <div className="ml-12">
        <ul className="w-fit">
        <Link href="/introduction">
        <li className={`flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c] ${selectedItem === 0 ? 'bg-[#9f352c]' : 'bg-white'}`} onClick={() => handleClick(0)}>
            <h3 className={`mr-10 text-lg group-hover:text-white ${selectedItem === 0 ? 'text-white' : 'text-[#5e5d62]'}`}>Course Overview</h3>
        </li>
        </Link>
        <li className="flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c]">
            <h3 className="text-[#5e5d62] text-lg group-hover:text-white">L1: DIGITAL LOGIC DESIGN</h3>
            <ExpandLessIcon className="ml-6 mt-0.5 mr-2 text-[#5e5d62] group-hover:text-white"/>
        </li>
        <li className="flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c]">
            <h3 className="text-[#5e5d62] text-lg group-hover:text-white">L2: COMPUTER NETWORKS</h3>
            <ExpandMoreIcon className="ml-6 mt-0.5 mr-2 text-[#5e5d62] group-hover:text-white"/>
        </li>
        <Link href="/topicOne">
        <li className={`flex flex-row py-4 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c] ${selectedItem === 1 ? 'bg-[#9f352c]' : 'bg-white'}`} onClick={() => handleClick(1)}>
           <h3 className={`ml-2 text-lg group-hover:text-white ${selectedItem === 1 ? 'text-white' : 'text-[#5e5d62]'}`}>L2.1: Introduction</h3>
        </li>
        </Link>
        <Link href="/topicTwo">
        <li className={`flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c] ${selectedItem === 2 ? 'bg-[#9f352c]' : 'bg-white'}`} onClick={() => handleClick(2)}>
            <h3 className={`ml-2 text-lg group-hover:text-white ${selectedItem === 2 ? 'text-white' : 'text-[#5e5d62]'}`}>L2.2: Probability Theory</h3>
        </li>
        </Link>
        <li className="flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c]">
            <h3 className="ml-2 text-[#5e5d62] text-lg group-hover:text-white">L2.3: Transmission Media</h3>
        </li>
        <li className="flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c]">
            <h3 className="ml-2 text-[#5e5d62] text-lg group-hover:text-white">L2.4: Types of Networks</h3>
        </li>
        <li className="flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c]">
            <h3 className="ml-2 text-[#5e5d62] text-lg group-hover:text-white">L2.5: Protocols</h3>
        </li>
        <li className="flex flex-row py-4 pl-2 justify-between border-gray-300 border-b border-r-2 transition duration-150 group hover:cursor-pointer hover:bg-[#9f352c]">
            <h3 className="ml-2 text-[#5e5d62] text-left text-lg group-hover:text-white">L2.6: IP addressing</h3>
        </li>
        </ul>
    </div>
  )
}

export default SideBar