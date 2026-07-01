import React, { useRef, useState  } from 'react'
import { uploadFile } from '../services/api';
import { useNavigate } from 'react-router-dom';



const Upload = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList && fileList[0]) {
        setSelectedFile(fileList[0]);
      }
    };


    const uploadFileFunction = async () => {
      if (!selectedFile) return;
      const navigate = useNavigate();

      try {
        const res = await uploadFile(selectedFile);
        
        console.log(res)
        if (!res.errcode){
          console.log(res);
          navigate(`/book/${res.document_id}`);
        }
      } catch (err) {
        console.error(err);
      }
    };


  return (
    <>
      <div className='grid gap-4 max-w-md mx-auto'>
        <input ref={fileInputRef} className="block w-full text-md p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={onFileChange}></input>
        <button type='button' className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          uploadFileFunction();
        }}>Upload</button>
      </div>

    </>
  )
}

export default Upload