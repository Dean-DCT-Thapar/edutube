import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';

const VideoDisplay = (props) => {
  const [player, setPlayer] = useState(null);
  const containerRef = useRef(null);
  // Stores the timestamp (in ms) when the last request was sent.
  const lastSentRef = useRef(0);

  const sendWatchHistory = async () => {
    if (!player) return;
    
    // Get the current time in milliseconds.
    const now = Date.now();
    // If the last send was less than 5 seconds ago, skip sending.
    if (now - lastSentRef.current < 5000) {
      console.log("Skipping sending watch history - throttling active.");
      return;
    }
    
    // Update the last send time.
    lastSentRef.current = now;
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    const progress = duration ? (currentTime / duration) * 100 : 0;

    if(progress === 0){
      return;
    }

    try {
      await axios.post('/api/watch-history', {
        videoId: props.video_code,
        currentTime,
        progress,
      });
    } catch (error) {
      console.error('Error sending watch history:', error);
    }
  };

  // When the user clicks anywhere, if the click is not inside the video container then send watch history.
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      sendWatchHistory();
    }
  };

  useEffect(() => {
    // Add listener for clicks (using capture phase so we catch them even before they bubble).
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      // Send one final update when the component unmounts.
      sendWatchHistory();
    };
  }, [player]);

  // Save the YouTube player instance when it's ready.
  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      <div className="font-poppins flex flex-col gap-5">
        <div className="flex flex-row gap-3 text-3xl">
          <p className="font-semibold text-[#b42625]">{props.heading}</p>
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
        onReady={onPlayerReady}
      />
    </div>
  );
};

export default VideoDisplay;

