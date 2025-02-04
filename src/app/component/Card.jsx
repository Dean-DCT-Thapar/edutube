import React from 'react';
import Link from 'next/link';

const Card = (props) => {
  return (
      <div className='h-[300px] w-[220px]'>
        <img src='dashboardCard2.png' className='h-40 absolute -z-10 text-black' />
        <p className='font-semibold text-white font-montserrat relative top-10 text-2xl pl-2'>{props.title}</p>
        <p className='text-white font-montserrat relative top-10 pl-2'>{props.author}</p>
        <div className='h-9 relative top-20 bg-[#d9d9d9]' />
        <a href={"/course_page/"+props.course_id} className='text-right relative top-20 text-[#b52827] pl-14'>Go to Course Page &gt;</a>
      </div>
  );
};

export default Card;
