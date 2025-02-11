import React, { useState } from "react";
import Cards from "./card.jsx"; 
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { height, width } from "@mui/system";

const allCards = [
  { id: 1, name: "ANALOG ELECTRONICS", teacher: "Dr. Smith", course_code: "AE101", lessons_watched: 11, total_lessons: 34 }, 
  { id: 2, name: "DIGITAL SIGNAL PROCESSING", teacher: "Prof. Johnson", course_code: "DSP202", lessons_watched: 15, total_lessons: 30 }, 
  { id: 3, name: "DATA STRUCTURES", teacher: "Dr. Lee", course_code: "DS303", lessons_watched: 20, total_lessons: 40 }, 
  { id: 4, name: "DATABASE MANAGEMENT SYSTEMS", teacher: "Prof. Brown", course_code: "DBMS404", lessons_watched: 8, total_lessons: 20 }, 
  { id: 5, name: "OBJECT ORIENTED PROGRAMMING", teacher: "Dr. Wilson", course_code: "OOP505", lessons_watched: 12, total_lessons: 25 },
  { id: 6, name: "WEB DEVELOPMENT", teacher: "Prof. Taylor", course_code: "WD606", lessons_watched: 18, total_lessons: 36 }, 
  { id: 7, name: "MOBILE APPLICATION DEVELOPMENT", teacher: "Dr. Anderson", course_code: "MAD707", lessons_watched: 10, total_lessons: 22 }, 
  { id: 8, name: "NETWORK SECURITY", teacher: "Prof. Thomas", course_code: "NS808", lessons_watched: 14, total_lessons: 28 }, 
  { id: 9, name: "ARTIFICIAL INTELLIGENCE", teacher: "Dr. Jackson", course_code: "AI909", lessons_watched: 16, total_lessons: 32 }, 
  { id: 10, name: "MACHINE LEARNING", teacher: "Prof. White", course_code: "ML1010", lessons_watched: 9, total_lessons: 18 },
  { id: 11, name: "CLOUD COMPUTING", teacher: "Dr. Harris", course_code: "CC1111", lessons_watched: 13, total_lessons: 26 }, 
  { id: 12, name: "SOFTWARE ENGINEERING", teacher: "Prof. Martin", course_code: "SE1212", lessons_watched: 17, total_lessons: 34 }, 
  { id: 13, name: "COMPUTER GRAPHICS", teacher: "Dr. Thompson", course_code: "CG1313", lessons_watched: 7, total_lessons: 14 }, 
  { id: 14, name: "OPERATING SYSTEMS", teacher: "Prof. Garcia", course_code: "OS1414", lessons_watched: 19, total_lessons: 38 }, 
  { id: 15, name: "COMPILER DESIGN", teacher: "Dr. Martinez", course_code: "CD1515", lessons_watched: 5, total_lessons: 10 },
];

const CardsCarousel = () => {
  const [index, setIndex] = useState(0);

  const visibleCards = allCards.slice(index, index + 6);

  const handleNext = () => {
    if (index + 6 < allCards.length) {
      setIndex(index + 6);
    }
  };

  const handlePrev = () => {
    if (index - 6 >= 0) {
      setIndex(index - 6);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handlePrev} style={styles.arrow}>
        <ChevronLeft fontSize="large" />
      </button>

      <div style={styles.grid}>
        {visibleCards.map((card) => (
          <Cards name={card.name} teacher={card.teacher} course_code={card.course_code} completed_lessons={card.lessons_watched} total_lessons={card.total_lessons} key={card.id} />
        ))}
      </div>

      <button onClick={handleNext} style={styles.arrow}>
        <ChevronRight fontSize="large" />
      </button>
    </div>
  );
};

const styles = {
  container: {
    margin: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    gap: "3rem 2rem",
  },
  arrow: {
    border: "none",
    color: "black",
    background: "transparent",
    cursor: "pointer",
    height: "4rem",
    width: "auto",
  },
};

export default CardsCarousel;
