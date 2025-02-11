import React, { useState } from "react";
import Cards from "./card.jsx"; 
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { height, width } from "@mui/system";

const allCards = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
  { id: 6 },
];

const CardsCarousel = () => {
  const [index, setIndex] = useState(0);

  const visibleCards = allCards.slice(index, index + 4);

  const handleNext = () => {
    if (index + 4 < allCards.length) {
      setIndex(index + 4);
    }
  };

  const handlePrev = () => {
    if (index - 4 >= 0) {
      setIndex(index - 4);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handlePrev} style={styles.arrow}>
        <ChevronLeft fontSize="large" />
      </button>

      <div style={styles.grid}>
        {visibleCards.map((card) => (
          <Cards key={card.id} />
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
    gridTemplateColumns: "repeat(2, 1fr)",
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
