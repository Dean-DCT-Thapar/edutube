import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import frontendApi from '@/utils/frontendApiClient';

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
  const [playerError, setPlayerError] = useState(null);
  const embedOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;

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
    if (now - lastSentRef.current < 5001) {
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
      await frontendApi.post('/api/watch-history', {
        lecture_id: props.lec_id,  // Fixed: use lecture_id instead of videoId
        progress: Math.round(progress),  // Round progress to avoid decimals
        current_time: Math.floor(currentTime)  // Send actual current time in seconds
      });
      console.log('Watch history sent successfully');
    } catch (error) {
      console.error('Error in sendWatchHistory:', error);
      console.error('Error details:', error.message);
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
          const response = await frontendApi.get(`/api/watch-history/getVideoProgress/${props.lec_id}`);
          console.log('API response:', response);
          
          const progress = response.progress || 0;
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

  // Reset error state when switching videos.
  useEffect(() => {
    setPlayerError(null);
  }, [props?.video_code, props?.lec_id]);

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

      // Best-effort iframe hardening for embedded YouTube behavior.
      if (typeof playerInstance.getIframe === 'function') {
        const iframe = playerInstance.getIframe();
        if (iframe) {
          iframe.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          );
          iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          iframe.setAttribute('allowfullscreen', 'true');
        }
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
          <>
            {!playerError ? (
              <YouTube 
                key={`video-${props.video_code}-${props.lec_id || 'no-id'}`}
                videoId={props.video_code}
                opts={{
                  height: '100%',
                  width: '100%',
                  host: 'https://www.youtube-nocookie.com',
                  playerVars: {
                    rel: 0,
                    autoplay: 0,
                    modestbranding: 1,
                    controls: 1,
                    playsinline: 1,
                    iv_load_policy: 3,
                    enablejsapi: 1,
                    origin: embedOrigin,
                  },
                }}
                onReady={onPlayerReady}
                onError={(error) => {
                  console.error('YouTube player error:', error);
                  setPlayerError(error?.data || 'embed-error');
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
              <div className="w-full h-full bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-xl text-center space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    YouTube is blocking playback in embedded mode
                  </h3>
                  <p className="text-sm text-gray-600">
                    This can happen when YouTube asks for an account verification check. Open the video directly, complete sign-in there if prompted, then return here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                    <a
                      href={`https://www.youtube.com/watch?v=${props.video_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      Open Video on YouTube
                    </a>
                    <button
                      type="button"
                      onClick={() => setPlayerError(null)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Try Embed Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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

