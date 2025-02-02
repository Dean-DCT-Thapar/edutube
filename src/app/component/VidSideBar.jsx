'use client'
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Link from 'next/link';

export default function Sidebar(props) {
  const [data, setData] = useState(props.course_data || []);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-72 h-screen p-4 bg-[#b52827]">
      <h2 className="text-lg font-bold mb-4">Course Overview</h2>
      <ul> 
        {data.map((chapter) => (
          <li key={chapter.chapter_number} className="mb-2">
            <div
              className="flex items-center justify-between cursor-pointer p-2 bg-[#b52827] hover:bg-[#b52827] hover:text-white hover:opacity-60"
              onClick={() => toggleExpand(chapter.chapter_number)}
            >
              <span>{chapter.chapter_name}</span>
              {expanded[chapter.chapter_number] ? <ExpandLess /> : <ExpandMore />}
            </div>
            {expanded[chapter.chapter_number] && (
              <ul className="ml-4 mt-2">
                {chapter.lectures.map((lecture) => (
                  <li key={lecture.lecture_number} className="p-2 bg-[#b52827] hover:bg-[#b52827] hover:text-white">
                    <Link href={`/course_page/${props.course_id}?chapter=${chapter.chapter_number}&lecture=${lecture.lecture_number}`}>
                      <span className="text-white hover:underline">{lecture.lecture_title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}