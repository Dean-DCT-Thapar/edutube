import React from 'react'

const CurrentDate = () => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long", 
      day: "numeric",  
    });
  
    return (
      <div className="text-white sm:font-medium ml-10 pt-5 sm:pt-0 sm:ml-44 sm:mt-20 text-xs sm:text-lg font-montserrat">
        {formattedDate}
      </div>
    );
}

export default CurrentDate