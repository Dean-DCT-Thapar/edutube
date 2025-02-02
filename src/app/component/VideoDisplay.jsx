import React from 'react';

const VideoDisplay = (props) => {
  return (
    <div className='flex flex-col gap-5'>
        <div className='font-poppins flex flex-col gap-5'>
            <div className='flex flex-row gap-3 text-3xl'>
                <p className='font-semibold text-[#b42625]'>{props.heading}</p>
            </div>
        </div>
        <iframe src={'https://www.youtube.com/embed/' + props.video_code} allowFullScreen height={'500px'} width={'750px'} loading='lazy' title='pink guy' />
    </div>
  );
};

export default VideoDisplay;

