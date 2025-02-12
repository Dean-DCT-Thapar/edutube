'use client'
import { useState, useEffect } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Link from 'next/link';

export default function Sidebar(props) {
  const [data, setData] = useState(props.course_data || []);
  const [expanded, setExpanded] = useState({});
  const chapterNumber = new URLSearchParams(window.location.search).get('chapter');
  const lectureNumber = new URLSearchParams(window.location.search).get('lecture');

  useEffect(() => {
    if (chapterNumber) {
      setExpanded((prev) => ({ ...prev, [chapterNumber]: true }));
    }
  }, [chapterNumber]);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-96 h-screen p-4 bg-white absolute right-0 shadow-lg border-t-4 border-black overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-black border-b pb-2">Course Overview</h2>
      <ul> 
        {data.map((chapter) => (
          <li key={chapter.chapter_number} className="mb-2">
            <div
              className="flex items-center justify-between cursor-pointer p-2 bg-white hover:bg-[#eeeeee] hover:text-white hover:opacity-60 border-b border-black"
              onClick={() => toggleExpand(chapter.chapter_number)}
            >
              <span className="text-black text-lg border-t border-b border-black">{chapter.chapter_name}</span>
              {expanded[chapter.chapter_number] ? <ExpandLess style={{ color: 'black' }} /> : <ExpandMore style={{ color: 'black' }} />}
            </div>
            {expanded[chapter.chapter_number] && (
              <ul className="ml-4 mt-2">
                {chapter.lectures.map((lecture) => (
                  <Link key={`${chapter.chapter_number}-${lecture.lecture_number}`} href={`/course_page/${props.course_id}?chapter=${chapter.chapter_number}&lecture=${lecture.lecture_number}`}>
                    <li key={lecture.lecture_number} className={`p-2 bg-white hover:bg-[#eeeeee] hover:text-white border-b border-black ${chapter.chapter_number === parseInt(chapterNumber) && lecture.lecture_number === parseInt(lectureNumber) ? 'bg-[#eeeeee] text-white' : ''}`}>
                        <span className="text-black text-lg">{lecture.lecture_title}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="border-t mt-4 pt-2"></div>
    </div>
  );
}