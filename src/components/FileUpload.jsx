import React, { useRef } from 'react'

export default function FileUpload({onFiles, accept='application/pdf', buttonText='Upload Files'}){
  const ref = useRef()

  function handle(e){
    if(onFiles) onFiles(e.target.files)
  }

  return (
    <div className='mb-3'>
      <input ref={ref} type='file' multiple accept={accept} className='hidden' onChange={handle} />
      <button onClick={()=>ref.current && ref.current.click()} className='px-4 py-2 bg-white rounded shadow large-text'> {buttonText} </button>
    </div>
  )
}
