import { useRef, useState } from 'react'
import Upload from './Upload'
import Content from './Content'
import AudioControls from '../components/AudioControls'

const Homepage = () => {
  const [pageData, setpageData] = useState<{ pages: any } | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nextPage = () => {
    if (page >= totalPages) return;
    setPage(prev => prev + 1);
    audioRef.current?.pause();
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(prev => prev - 1);
    audioRef.current?.pause();
  };

  if (pageData) {
    return (
      <div className="h-full bg-gray-100">
        <AudioControls page={page} />
        <Content
          data={pageData}
          page={page}
          totalPages={totalPages}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-200 flex items-center justify-center px-4">
      <div className="text-center">
        <h3 className="text-3xl font-semibold text-slate-800 mb-2">
          Make your own Audiobook
        </h3>
        <p className="text-slate-500 mb-6">Upload a PDF and listen.</p>
        <Upload />
      </div>
    </div>
  );
}

export default Homepage
