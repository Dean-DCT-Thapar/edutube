import React from 'react';

const SearchCard = (props) => {
  return (
    <div
    className="flex space-x-4 mx-auto mb-5 p-4 border border-gray-300 rounded-lg shadow-md sm:w-full max-w-xl"
  >
    {/* Actual video thumbnail */}
    <div
      className={`bg-gray-100 w-20 h-20 ${
        props.type === 'teacher' ? 'rounded-full' :
        props.type === 'course' ? 'rounded-lg' :
        'rounded-md' // Default for 'lecture' or any other type
      }`}
    >
      {/* <img
        src={`none`}
        className="w-full h-full object-cover rounded-lg"
      /> */}
    </div>

    {/* Actual video title */}
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-black">{props.main_title}</h2>
      <p className="text-black">{props.subtitle1}</p>
      <p className="text-black">{props.subtitle2}</p>
      <p className={`text-[#b52827]`}>{props.subtitle3}</p>
    </div>
  </div>
  );
};

export default SearchCard;
