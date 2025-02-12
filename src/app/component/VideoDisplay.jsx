import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const VideoDisplay = (props) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const lastSentRef = useRef(0);

  const sendWatchHistory = async () => {
    if (!player) return;
    
    const now = Date.now();
    if (now - lastSentRef.current < 5000) {
      console.log("Skipping sending watch history - throttling active.");
      return;
    }
    
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

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      sendWatchHistory();
      setLeftAtDuration(0);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      sendWatchHistory();
    };
  }, [player]);

  const [leftAtDuration, setLeftAtDuration] = useState(1000);

  useEffect(() => {
    const fetchVideoProgress = async () => {
      try {
        const response = await axios.get(`/api/get-video-progress/${props.lec_id}`);
        const leftAtDuration = response.data.left_at_duration;
        console.log('Left at duration:', leftAtDuration);
        setLeftAtDuration(leftAtDuration);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video progress:', error);
      }
    };

    fetchVideoProgress();
  }, [props.lec_id]);

  const onPlayerReady = (event) => {
    setPlayer(event.target);
    event.target.seekTo(leftAtDuration, true);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      {loading ? (
        <div className="flex h-600" style={{ position: 'absolute', top: '300px', left: '500px' }}>
          <CircularProgress />
        </div>
      ) : (<>
          <YouTube 
            videoId={props.video_code}
            opts={{
              height: '600',
              width: '1045',
              playerVars: {
                rel: 0,
                autoplay: 0,
                start: leftAtDuration || 0,
              },
            }}
            onReady={onPlayerReady}
          />
        <div className="font-poppins flex pl-5 flex-col gap-5">
          <div className="flex flex-row gap-3 text-3xl">
            <p className="font-semibold text-[#b42625]">{props.heading}</p>
          </div>
        </div>
      </>
    )}
    </div>
  );
};

export default VideoDisplay;

