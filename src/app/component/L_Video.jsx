import React from 'react'

const Video = ({ title,videoID }) => {
  return (
    <div>
        <h1 className='text-black absolute top-28 left-96 font-poppins font-medium text-3xl'>{title}</h1>
        <iframe 
          width={700}
          height={420}
          src={`https://www.youtube.com/embed/${videoID}`}
          allow='accelerometer; encrypted-media'
          allowFullScreen
          title='Center of Mass | Concept and Examples'
          className='mx-auto absolute left-96 top-40 shadow-2xl border-2 border-gray-200'
        />
    </div>
  )
}

export default Video
