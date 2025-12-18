import { useState, useRef } from 'react';
import { FaVolumeUp, FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { HiSpeakerWave } from 'react-icons/hi2';

const AudioControls = ({ page }: { page: number }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState<'stop' | 'pause-play' | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadAndPlay = () => {
    setIsAudioLoading(true);
    setAudioError('');

    const audio = new Audio(`http://localhost:3000/page/audio/${page}`);

    audio.addEventListener('canplaythrough', () => {
      setIsAudioLoading(false);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setActiveButton('pause-play');
        })
        .catch(err => {
          setAudioError('Could not play audio');
          console.error(err);
        });
    });

    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.load();

    audioRef.current = audio;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          setAudioError('Could not resume audio');
          console.error(err);
        });
    }

    setActiveButton('pause-play');
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setActiveButton('stop');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <button
        onClick={loadAndPlay}
        disabled={isAudioLoading || isPlaying}
        className={`flex items-center gap-2 text-lg ${isAudioLoading ? 'opacity-50' : 'hover:opacity-80'}`}
      >
        {isAudioLoading ? (
          <>
            <HiSpeakerWave size={22} className="animate-pulse" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <FaVolumeUp size={22} />
            <span>Listen</span>
          </>
        )}
      </button>

      {audioRef.current && (
        <div className="flex gap-3 mt-2">
          {/* ⏯ Play/Pause Toggle */}
          <button
            onClick={togglePlayPause}
            className={`rounded-full p-2 ${
              activeButton === 'pause-play' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          {/* ⏹ Stop */}
          <button
            onClick={handleStop}
            className={`rounded-full p-2 ${
              activeButton === 'stop' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaStop />
          </button>
        </div>
      )}

      {audioError && (
        <p className="text-red-500 text-sm mt-1">{audioError}</p>
      )}
    </div>
  );
};

export default AudioControls;
