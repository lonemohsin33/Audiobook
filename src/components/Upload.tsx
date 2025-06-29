import React, { useState  } from 'react'
import type { Dispatch, SetStateAction } from 'react';

import axios from "axios";


interface Props {
  setPageData: Dispatch<SetStateAction<any>>;
  setTotalPages: Dispatch<SetStateAction<any>>;
}


const Upload: React.FC<Props> = ({setPageData, setTotalPages}) => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const onFileChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        event.preventDefault()
        const fileList = event.target.files;

        if (fileList && fileList[0]){
            setSelectedFile(fileList[0])
        }
    }

    const uploadFile = ()=>{
        const data = new FormData()
        if (selectedFile){
            data.append("upload_file", selectedFile, selectedFile.name)
            console.log(selectedFile)
            axios.post("http://localhost:3000/file/upload", data).then((res)=>{
                console.log(res)
                if(res.status == 200 || res.status == 409){
                    setPageData(res.data.pages_data)
                    setTotalPages(res.data.total_pages)
                }
            }).catch((err)=>{
                console.log(err)
            })
        }

    }

  return (
    <>
    <div className='mt-6 grid gap-4'>
        <input className="block w-full text-md p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" onChange={onFileChange}></input>
        <button type='button' className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' onClick={uploadFile}>Upload</button>
    </div>

    </>
  )
}

export default Upload