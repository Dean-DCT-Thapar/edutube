import React from 'react';
import YouTube from 'react-youtube';


const VideoDisplay = (props) => {
  return (
    <div className='flex flex-col gap-5'>
        <div className='font-poppins flex flex-col gap-5'>
            <div className='flex flex-row gap-3 text-3xl'>
                <p className='font-semibold text-[#b42625]'>{props.heading}</p>
            </div>
        </div>
        <YouTube 
        videoId={props.video_code}
        opts={{
          height: '500',
          width: '750',
          playerVars: {
            rel: 0,
            autoplay: 0,
          },
        }} 
        onPause={handlePause}
        onEnd={handleEnd}
        />
    </div>
  );
};

export default VideoDisplay;

