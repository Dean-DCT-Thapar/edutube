// pages/videos.js
'use client';

import { useState, useEffect } from "react";
import SkeletonCard from "../component/SkeletonCard";
import TopBar from "../component/TopBar";
import SideBar from "../component/SideBar";
import Footer from "../component/Footer";

export default function Videos() {
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setVideos([
        { id: 1, title: "Video 1" },
        { id: 2, title: "Video 2" },
      ]);
    }, 3000); // Simulated delay
  }, []);

  return (
    <>
    <TopBar name="NAME ENDPOINT"/>
    <SideBar />
    <div>
      <h1 className="text-3xl font-poppins text-[#102c57] ml-20 font-bold mb-6">WATCH HISTORY</h1>
      <div className="space-y-4">
        {/* Show skeleton loaders or real video cards */}
        {!videos
          ? Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={index} />)
          : videos.map((video) => (
              <div
                key={video.id}
                className="flex space-x-4 ml-20 mb-5 p-4 border border-gray-300 rounded-lg shadow-md w-3/4 sm:w-full max-w-xl"
              >
                {/* Actual video thumbnail */}
                <div className="bg-gray-100 rounded-lg w-32 h-20">
                  <img
                    src={`https://via.placeholder.com/150?text=Video+${video.id}`}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Actual video title */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{video.title}</h2>
                  <p className="text-gray-500">Description goes here...</p>
                </div>
              </div>
            ))}
      </div>
      <Footer />
    </div>
    </>
  );
}
