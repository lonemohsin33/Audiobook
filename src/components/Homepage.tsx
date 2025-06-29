import  { useEffect, useRef, useState } from 'react'
import Upload from './Upload'
import Content from './Content'
import axios from 'axios'
import Audio from './AudioControls'
import AudioControls from './AudioControls'



const Homepage = () => {
    let [pageData, setpageData] = useState<string | null>(null)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [audioError, setAudioError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [activeButton, setActiveButton] = useState<'stop' | 'pause' | 'play' | null>(null);



  const nextPage = (curr_page: number)=>{
    axios.get(`http://localhost:3000/page/${curr_page+1}`).then((res)=>{
      setpageData(res.data.pages_data)
      setPage(curr_page+1)
      if (audioRef.current){
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }).catch((err)=>{
      console.log(err)
    })
    console.log(curr_page)

  }

  const prevPage = (curr_page:number)=>{
    console.log(curr_page)
      axios.get(`http://localhost:3000/page/${curr_page-1}`).then((res)=>{
      setpageData(res.data.pages_data)
      setPage(curr_page-1)
      if (audioRef.current){
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }).catch((err)=>{
      console.log(err)
    })
    console.log(curr_page)
  }


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

        {!pageData ? (
          <div>
            <h3 className="text-3xl text-center mb-4">
              Make your own Audiobook<br />Upload a PDF and listen.
            </h3>
            <Upload setPageData={setpageData} setTotalPages={setTotalPages}/>
          </div>
        ) : (
          <Content data={pageData}  
           page={page}
           totalPages={totalPages}
           onNext={() => nextPage(page)}
           onPrev={() => prevPage(page)} />
        )}
        
      </div>

    </>
  )
}

export default Homepage