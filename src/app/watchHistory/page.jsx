// pages/videos.js
'use client';

import { useState, useEffect } from "react";
import TopBar from "../component/TopBar";
import SideBar from "../component/SideBar";
import Footer from "../component/Footer";
import axios from "axios";
import SearchCard from "../component/SearchCard";
import Link from "next/link";
import { CircularProgress } from '@mui/material';

export default function Videos() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  const fetchWatchHistory = async () => {
    try {
      const response = await axios.get('/api/watch-history');
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching watch history:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchWatchHistory();

  }, []);

  return (
    <>
      <TopBar name="NAME ENDPOINT" />
      <SideBar />
      <div>
        <h1 className="text-3xl font-poppins text-[#102c57] ml-20 font-bold mb-6">WATCH HISTORY</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <div>
                  <Link href={`/course_page/${result.teacher_id}?chapter=${result.chapter_number}&lecture=${result.lecture_number}`}>
                    <SearchCard main_title={result.title} subtitle1={result.course_name} subtitle2={result.teacher_name} type="lecture" subtitle3={"Progress- " + result.progress_percentage + "%"} />
                  </Link>
                </div>
              </li>
            ))}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}
