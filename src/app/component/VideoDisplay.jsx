import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';

const VideoDisplay = (props) => {
  // Early return if essential props are missing
  if (!props || !props.video_code) {
    console.warn('VideoDisplay: Missing required props');
    return (
      <div className="flex flex-col gap-5">
        <div className="text-red-600">
          Error: Video cannot be loaded. Missing required data.
        </div>
      </div>
    );
  }

  const [player, setPlayer] = useState(null);
  const containerRef = useRef(null);
  const lastSentRef = useRef(0);
  const [resumeProgress, setResumeProgress] = useState(0); // Store progress percentage
  const [playerReady, setPlayerReady] = useState(false);

  const sendWatchHistory = async () => {
    if (!player) return;
    
    // Validate required props
    if (!props.lec_id) {
      console.warn('No lecture ID provided, skipping watch history update');
      return;
    }
    
    // Get the current time in milliseconds.
    const now = Date.now();
    // If the last send was less than 5 seconds ago, skip sending.
    if (now - lastSentRef.current < 5000) {
      console.log("Skipping sending watch history - throttling active.");
      return;
    }
    
    // Update the last send time.
    lastSentRef.current = now;
    
    try {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const progress = duration ? (currentTime / duration) * 100 : 0;

      if(progress === 0){
        return;
      }

      console.log('Sending watch history:', { 
        lecture_id: props.lec_id, 
        progress: Math.round(progress),
        current_time: Math.floor(currentTime)
      });
      await axios.post('/api/watch-history', {
        lecture_id: props.lec_id,  // Fixed: use lecture_id instead of videoId
        progress: Math.round(progress),  // Round progress to avoid decimals
        current_time: Math.floor(currentTime)  // Send actual current time in seconds
      });
      console.log('Watch history sent successfully');
    } catch (error) {
      console.error('Error in sendWatchHistory:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const handleClickOutside = (event) => {
    try {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        sendWatchHistory();
      }
    } catch (error) {
      console.error('Error in handleClickOutside:', error);
    }
  };

  useEffect(() => {
    const addClickListener = () => {
      try {
        if (typeof document !== 'undefined' && document.addEventListener) {
          document.addEventListener('click', handleClickOutside, true);
        }
      } catch (error) {
        console.error('Error adding click listener:', error);
      }
    };

    const removeClickListener = () => {
      try {
        if (typeof document !== 'undefined' && document.removeEventListener) {
          document.removeEventListener('click', handleClickOutside, true);
        }
        sendWatchHistory();
      } catch (error) {
        console.error('Error removing click listener:', error);
      }
    };

    addClickListener();
    return removeClickListener;
  }, [player]);

  // Fetch resume position when component mounts or lec_id changes
  useEffect(() => {
    const fetchVideoProgress = async () => {
      try {
        console.log('Fetching video progress for lecture ID:', props.lec_id);
        
        // Fetch progress from watch history
        if (props.lec_id) {
          console.log('Making API call to get video progress...');
          const response = await axios.get(`/api/watch-history/getVideoProgress/${props.lec_id}`);
          console.log('API response:', response.data);
          
          const progress = response.data.progress || 0;
          if (progress > 0) {
            setResumeProgress(progress); // Store the progress percentage
            console.log('Will resume from progress:', progress, '% (will calculate time after video loads)');
          } else {
            console.log('No progress found, starting from beginning');
            setResumeProgress(0);
          }
        } else {
          console.log('No lecture ID provided, skipping progress fetch');
        }
      } catch (error) {
        console.error('Error fetching video progress:', error);
        setResumeProgress(0);
      }
    };

    // Only fetch if we have a valid lecture ID
    if (props && props.lec_id) {
      fetchVideoProgress();
    } else {
      console.log('Skipping progress fetch - no valid lecture ID');
      setResumeProgress(0);
    }
  }, [props?.lec_id]);

  // Handle seeking to the correct position when player is ready
  useEffect(() => {
    console.log('Seek useEffect triggered:', { 
      hasPlayer: !!player, 
      playerReady, 
      resumeProgress 
    });
    
    if (player && playerReady && resumeProgress > 0) {
      console.log('Starting seek timer...');
      const seekTimer = setTimeout(() => {
        try {
          console.log('Attempting to seek...');
          
          // Additional safety check
          if (!player || typeof player.getDuration !== 'function' || typeof player.seekTo !== 'function') {
            console.warn('Player not properly initialized for seeking');
            return;
          }
          
          console.log('Player methods verified, getting duration...');
          
          // Calculate time using actual video duration
          const actualDuration = player.getDuration();
          console.log('Actual video duration:', actualDuration);
          
          if (actualDuration && actualDuration > 0) {
            const seekTime = (resumeProgress / 100) * actualDuration;
            console.log('Calculated seek time from', resumeProgress, '% of', actualDuration, 'seconds =', seekTime, 'seconds');
            console.log('Seeking to time:', seekTime, 'seconds');
            player.seekTo(seekTime, true);
            console.log('Seek command sent successfully');
          } else {
            console.warn('Could not get video duration for progress calculation, duration:', actualDuration);
          }
        } catch (error) {
          console.error('Error seeking to resume position:', error);
          console.error('Error stack:', error.stack);
        }
      }, 1500); // Give the player more time to fully load
      
      // Cleanup timer on unmount
      return () => {
        console.log('Cleaning up seek timer');
        clearTimeout(seekTimer);
      };
    } else {
      console.log('Seek conditions not met:', {
        hasPlayer: !!player,
        playerReady,
        resumeProgress
      });
    }
  }, [player, playerReady, resumeProgress]);

  // Save the YouTube player instance when it's ready.
  const onPlayerReady = (event) => {
    console.log('Player ready event received');
    try {
      // Additional safety checks
      if (!event || !event.target) {
        console.error('Invalid player ready event:', event);
        return;
      }
      
      const playerInstance = event.target;
      
      // Verify the player has the required methods
      if (typeof playerInstance.getCurrentTime !== 'function' || 
          typeof playerInstance.getDuration !== 'function' || 
          typeof playerInstance.seekTo !== 'function') {
        console.error('Player instance missing required methods');
        return;
      }
      
      console.log('Player ready and validated');
      setPlayer(playerInstance);
      setPlayerReady(true);
    } catch (error) {
      console.error('Error in onPlayerReady:', error);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <div className="w-full h-full">
        {props.video_code ? (
          <YouTube 
            key={`video-${props.video_code}-${props.lec_id || 'no-id'}`}
            videoId={props.video_code}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                rel: 0,
                autoplay: 0,
                modestbranding: 1,
                controls: 1,
              },
            }}
            onReady={onPlayerReady}
            onError={(error) => {
              console.error('YouTube player error:', error);
            }}
            onStateChange={(event) => {
              console.log('YouTube player state changed:', event.data);
            }}
            style={{
              width: '100%',
              height: '100%'
            }}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-gray-600">No video available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;

