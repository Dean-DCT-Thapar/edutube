import React, { useState } from "react";
import Cards from "./card.jsx"; 
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { height, width } from "@mui/system";

const allCards = [
  { id: 1, name: "ANALOG ELECTRONICS" }, 
  { id: 2, name: "DIGITAL SIGNAL PROCESSING" }, 
  { id: 3, name: "DATA STRUCTURES" }, 
  { id: 4, name: "DATABASE MANAGEMENT SYSTEMS" }, 
  { id: 5, name: "OBJECT ORIENTED PROGRAMMING" },
  { id: 6, name: "WEB DEVELOPMENT" }, 
  { id: 7, name: "MOBILE APPLICATION DEVELOPMENT" }, 
  { id: 8, name: "NETWORK SECURITY" }, 
  { id: 9, name: "ARTIFICIAL INTELLIGENCE" }, 
  { id: 10, name: "MACHINE LEARNING" },
  { id: 11, name: "CLOUD COMPUTING" }, 
  { id: 12, name: "SOFTWARE ENGINEERING" }, 
  { id: 13, name: "COMPUTER GRAPHICS" }, 
  { id: 14, name: "OPERATING SYSTEMS" }, 
  { id: 15, name: "COMPILER DESIGN" },
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
          <Cards name={card.name} key={card.id} />
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
