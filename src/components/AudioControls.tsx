import { useEffect, useRef, useState } from 'react';
import { FaVolumeUp, FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { HiSpeakerWave } from 'react-icons/hi2';
import { getBookAudioUrl, getPageAudioUrl } from '../services/api';

type Props = {
  page: number;
  bookId?: string;
};

const AudioControls = ({ page, bookId }: Props) => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
    setHasAudio(false);
    setAudioError('');
  }, [page, bookId]);

  const audioUrl = bookId ? getBookAudioUrl(bookId, page) : getPageAudioUrl(page);

  const loadAndPlay = async () => {
    setIsAudioLoading(true);
    setAudioError('');

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Audio not available');
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));

      audio.addEventListener('canplaythrough', () => {
        setIsAudioLoading(false);
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => setAudioError('Could not play audio'));
      });

      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.load();
      audioRef.current = audio;
      setHasAudio(true);
    } catch {
      setIsAudioLoading(false);
      setAudioError('Audio not available for this page');
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setAudioError('Could not resume audio'));
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 py-2 border-t border-slate-600">
      <button
        onClick={loadAndPlay}
        disabled={isAudioLoading || isPlaying}
        className="flex items-center gap-2 text-sm text-slate-200 hover:text-white disabled:opacity-50"
      >
        {isAudioLoading ? (
          <>
            <HiSpeakerWave size={18} className="animate-pulse" />
            Loading...
          </>
        ) : (
          <>
            <FaVolumeUp size={18} />
            Listen
          </>
        )}
      </button>

      {hasAudio && (
        <div className="flex gap-2">
          <button onClick={togglePlayPause} className="rounded-full p-2 bg-slate-600 hover:bg-slate-500 text-white">
            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
          </button>
          <button onClick={handleStop} className="rounded-full p-2 bg-slate-600 hover:bg-slate-500 text-white">
            <FaStop size={14} />
          </button>
        </div>
      )}

      {audioError && <p className="text-red-300 text-xs">{audioError}</p>}
    </div>
  );
};

export default AudioControls;
