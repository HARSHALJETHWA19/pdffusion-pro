import React, { useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import FileUpload from '../components/FileUpload'
import PDFPreviewGrid from '../components/PDFPreviewGrid'

function saveToHistory(name, blob){
  try{
    const store = JSON.parse(localStorage.getItem('pdffusion:history')||'[]')
    const url = URL.createObjectURL(blob)
    store.unshift({name, url, ts:Date.now()})
    localStorage.setItem('pdffusion:history', JSON.stringify(store.slice(0,20)))
  }catch(e){console.error(e)}
}

export default function Split({setHint}){
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [pages, setPages] = useState([])
  const fromRef = useRef(); const toRef = useRef()
  const [processing, setProcessing] = useState(false)

  function handleFiles(fs){ setFiles(prev=>[...prev, ...Array.from(fs)]); setHint && setHint('Files ready — choose one and preview pages.') }

  async function splitRange(){
    if(!selectedFile) return alert('Select a file')
    const from = parseInt(fromRef.current.value||'1',10)-1
    const to = parseInt(toRef.current.value||'1',10)-1
    if(from<0 || to<from) return alert('Invalid range')
    setProcessing(true)
    try{
      const arr = await selectedFile.arrayBuffer(); const doc = await PDFDocument.load(arr)
      const out = await PDFDocument.create(); const indices = []
      for(let i=from;i<=Math.min(to,doc.getPageCount()-1);i++) indices.push(i)
      const pagesCopied = await out.copyPages(doc, indices); pagesCopied.forEach(p=>out.addPage(p))
      const bytes = await out.save(); const blob = new Blob([bytes],{type:'application/pdf'})
      const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${selectedFile.name.replace(/\.pdf$/i,'')}_part.pdf`; a.click(); a.remove(); URL.revokeObjectURL(url)
      saveToHistory(`${selectedFile.name.replace(/\.pdf$/i,'')}_part.pdf`, blob)
      setHint && setHint('Split complete — saved to history.')
    }catch(err){console.error(err); alert(err.message)}finally{setProcessing(false)}
  }

  return (
    <div className='card p-6 rounded shadow'>
      <h2 className='text-xl font-semibold mb-2'>Split PDF</h2>
      <p className='text-sm text-slate-500 mb-3'>Preview pages, remove unwanted ones, then extract a range.</p>
      <FileUpload onFiles={handleFiles} />
      <div className='mb-3'>
        <ul className='space-y-2'>
          {files.map((f,idx)=>(
            <li key={idx} className='flex items-center justify-between p-2 border rounded'>
              <div>
                <div className='font-medium'>{f.name}</div>
              </div>
              <div className='flex gap-2'>
                <button onClick={()=>{ setSelectedFile(f); setPages([]); setHint && setHint('Rendering previews...') }} className='px-2 py-1 bg-slate-100 rounded'>Preview</button>
                <button onClick={()=>setFiles(prev=>prev.filter((_,i)=>i!==idx))} className='px-2 py-1 bg-red-100 text-red-700 rounded'>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedFile && <div className='mb-3'><PDFPreviewGrid file={selectedFile} pages={pages} setPages={setPages} allowReorder={true} /></div>}

      {selectedFile && <div className='mt-4 flex items-center gap-2'>
        <label>From: <input defaultValue={1} ref={fromRef} className='ml-2 w-20 border rounded px-2 py-1' /></label>
        <label>To: <input defaultValue={pages.length||1} ref={toRef} className='ml-2 w-20 border rounded px-2 py-1' /></label>
        <button onClick={splitRange} disabled={processing} className='px-3 py-1 bg-white text-gray-800 rounded shadow hover:scale-[1.01] ml-2'>{processing?'Processing...':'Extract'}</button>
      </div>}
    </div>
  )
}