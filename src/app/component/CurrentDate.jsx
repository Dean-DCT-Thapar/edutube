import React from 'react'

const CurrentDate = () => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long", 
      day: "numeric",  
    });
  
    return (
      <div className="text-white sm:font-medium sm:ml-[15%] ml-[15%] sm:mt-[5%] pt-[5%] sm:pt-0 text-xs sm:text-2xl font-montserrat">
        {formattedDate}
      </div>
    );
}

export default CurrentDate