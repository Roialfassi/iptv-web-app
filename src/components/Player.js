// src/components/Player.js
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import '../styles/Player.css';

const Player = ({ channel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (channel && videoRef.current) {
      // Destroy previous HLS instance if exists
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const video = videoRef.current;
      
      // Check if the channel URL is HLS (.m3u8)
      if (channel.url.includes('.m3u8')) {
        // Check if HLS is supported
        if (Hls.isSupported()) {
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(channel.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play()
              .then(() => setIsPlaying(true))
              .catch(err => console.error('Error playing video:', err));
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
              switch(data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error('Network error');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error('Media error');
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });
        } 
        // For browsers that natively support HLS
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = channel.url;
          video.addEventListener('loadedmetadata', () => {
            video.play()
              .then(() => setIsPlaying(true))
              .catch(err => console.error('Error playing video:', err));
          });
        }
      } else {
        // For direct video sources
        video.src = channel.url;
        video.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error('Error playing video:', err));
      }
      
      // Set volume
      video.volume = volume / 100;
    }
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Error playing video:', err));
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="player-container">
      {channel ? (
        <>
          <div className="video-container">
            <video ref={videoRef} className="video-player" controls={true} />
          </div>
          <div className="channel-info">
            <h2>{channel.name}</h2>
            <p>{channel.group}</p>
          </div>
          <div className="controls">
            <div className="playback-controls">
              <button className="control-button play" onClick={handlePlay} disabled={isPlaying}>Play</button>
              <button className="control-button pause" onClick={handlePause} disabled={!isPlaying}>Pause</button>
              <button className="control-button stop" onClick={handleStop}>Stop</button>
              <button className="control-button fullscreen" onClick={handleFullscreen}>Fullscreen</button>
            </div>
            <div className="volume-control">
              <label htmlFor="volume">Volume</label>
              <input 
                type="range" 
                id="volume" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={handleVolumeChange} 
                className="volume-slider"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="no-channel">
          <p>Select a channel to start watching</p>
        </div>
      )}
    </div>
  );
};

export default Player;