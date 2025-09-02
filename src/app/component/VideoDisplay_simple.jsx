import React from 'react';

const VideoDisplay = (props) => {
  // Early return if essential props are missing
  if (!props || !props.video_code) {
    console.warn('VideoDisplay: Missing required props', { props });
    return (
      <div className="flex flex-col gap-5">
        <div className="font-poppins flex flex-col gap-5">
          <div className="flex flex-row gap-3 text-3xl">
            <p className="font-semibold text-[#b42625]">{props?.heading || 'Video'}</p>
          </div>
        </div>
        <div className="text-red-600 bg-red-50 p-4 rounded">
          Error: Video cannot be loaded. Missing video ID.
        </div>
      </div>
    );
  }

  console.log('VideoDisplay: Received props', { props });

  return (
    <div className="flex flex-col gap-5">
      <div className="font-poppins flex flex-col gap-5">
        <div className="flex flex-row gap-3 text-3xl">
          <p className="font-semibold text-[#b42625]">{props.heading || 'Video Lecture'}</p>
        </div>
      </div>
      <div className="relative">
        {props.video_code ? (
          <div className="relative">
            <iframe
              width="750"
              height="500"
              src={`https://www.youtube.com/embed/${props.video_code}?rel=0&modestbranding=1&controls=1`}
              title={props.heading || 'Video Lecture'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <div className="w-[750px] h-[500px] bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">No video available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
