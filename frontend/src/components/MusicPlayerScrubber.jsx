import React, { useState, useEffect } from 'react';

const MusicPlayerScrubber = ({ playbackResponse }) => {
  const [progressMs, setProgressMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);

  useEffect(() => {
    // Update progress and duration when the playback response changes
    if (playbackResponse) {
      setProgressMs(playbackResponse.progress_ms);
      setDurationMs(playbackResponse.item.duration_ms);
    }
  }, [playbackResponse]);

  const calculatePercentage = () => {
    return (progressMs / durationMs) * 100;
  };

  return (
    <div>
      <div style={{ width: '100%', background: '#ddd', height: '10px' }}>
        <div
          style={{
            width: `${calculatePercentage()}%`,
            background: '#1db954',
            height: '100%',
          }}
        />
      </div>
      <p>
        {formatTime(progressMs)} / {formatTime(durationMs)}
      </p>
    </div>
  );
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default MusicPlayerScrubber;
