import React from 'react';
import YouTube from 'react-youtube';
import { useEffect , useRef } from 'react';

const VideoDisplay = (props) => {
  const startTime = useRef(Date.now());
  const videoRef = useRef(null);
  const lastWatchedPosition = useRef(0);

  // Track pause or video end events
  const handlePause = () => {
      if (videoRef.current) {
          lastWatchedPosition.current = videoRef.current.currentTime;
      }
  };

  const handleSaveWatchHistory = async () => {
      const watchDuration = Math.floor((Date.now() - startTime.current) / 1000);
      const progress = videoRef.current
          ? (lastWatchedPosition.current / videoRef.current.duration) * 100
          : 0;

      try {
          await fetch('/api/watch-history', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Send JWT for authentication
              },
              body: JSON.stringify({
                  lectureId,
                  watchDuration,
                  progress: isNaN(progress) ? 0 : progress,
              }),
          });
      } catch (error) {
          console.error('Error saving watch history:', error);
      }
  };

  // Save watch history on tab close or navigation
  useEffect(() => {
      window.addEventListener('beforeunload', handleSaveWatchHistory);

      return () => {
          handleSaveWatchHistory();
          window.removeEventListener('beforeunload', handleSaveWatchHistory);
      };
  }, []);

  // New function to handle video end
  const handleEnd = () => {
      console.log('Video has ended');
      // Additional logic can be added here
  };

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

