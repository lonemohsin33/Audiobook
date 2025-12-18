import  { useEffect, useRef, useState } from 'react'
import Upload from './Upload'
import Content from './Content'
import axios from 'axios'
import Audio from './AudioControls'
import AudioControls from './AudioControls'



const Homepage = () => {
const [pageData, setpageData] = useState<any[] | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [activeButton, setActiveButton] = useState<'stop' | 'pause' | 'play' | null>(null);





 const nextPage = () => {
  console.log(page, totalPages);
  if (page >= totalPages) return;

  setPage(prev => prev + 1);
  setpageData(JSON.parse(localStorage.getItem("data") || "[]"));

  audioRef.current?.pause();
  setIsPlaying(false);
};

const prevPage = () => {
  if (page <= 1) return;

  setPage(prev => prev - 1);
  setpageData(JSON.parse(localStorage.getItem("data") || "[]"));

  audioRef.current?.pause();
  setIsPlaying(false);
};



  useEffect(() => {
  const stored = localStorage.getItem("data");
  if (stored && pageData === null) {
    setpageData(JSON.parse(stored));
    setTotalPages(Number(JSON.parse(stored).total_pages || 0));
  }
}, [pageData, totalPages]);



  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // audioRef.current.removeEventListener('canplaythrough', handlePlay);
      }
    };
  }, []);

  





  return (
    <>
<div className="flex flex-col items-center mt-6">
  {pageData && <AudioControls page={page} />}

  {pageData === null ? (
    <div>
      <h3 className="text-3xl text-center mb-4">
        Make your own Audiobook<br />Upload a PDF and listen.
      </h3>
      <Upload setPageData={setpageData} setTotalPages={setTotalPages} />
    </div>
  ) : (
    <Content
      data={pageData}
      page={page}
      totalPages={totalPages}
      onNext={nextPage}
      onPrev={prevPage}
    />
  )}
</div>


    </>
  )
}

export default Homepage