'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function Sidebar() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});

  // Fetch sidebar data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('../api/sidebar'); // Replace with your API endpoint
        setData(response.data);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    }
    fetchData();
  }, []);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-64 h-screen p-4 bg-[#b52827]">
      <h2 className="text-lg font-bold mb-4">Course Overview</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id} className="mb-2">
            <div
              className="flex items-center justify-between cursor-pointer p-2 bg-gray-200 hover:bg-white hover:text-[#b52827]"
              onClick={() => toggleExpand(item.id)}
            >
              <span>{item.title}</span>
              {expanded[item.id] ? <ExpandLess /> : <ExpandMore />}
            </div>
            {expanded[item.id] && (
              <ul className="ml-4 mt-2">
                {item.subitems.map((subitem) => (
                  <li key={subitem.id} className="p-2 bg-gray-50 hover:bg-white hover:text-[#b52827]">
                    {subitem.title}
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