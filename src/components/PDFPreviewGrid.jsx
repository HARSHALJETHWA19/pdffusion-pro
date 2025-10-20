import React, { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export default function PDFPreviewGrid({file, pages, setPages, allowReorder=true}){
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let cancelled=false
    async function renderPages(){
      if(!file){ setPages([]); return }
      setLoading(true)
      const array = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({data:array})
      const pdf = await loadingTask.promise
      const pgs = []
      for(let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({scale:1.2})
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({canvasContext: ctx, viewport}).promise
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        pgs.push({pageIndex:i-1, img:dataUrl})
        if(cancelled) break
      }
      if(!cancelled) setPages(pgs)
      setLoading(false)
    }
    renderPages()
    return ()=>{ cancelled=true }
  },[file])

  function onDragEnd(result){
    if(!result.destination) return
    const src = result.source.index; const dst = result.destination.index
    const copy = Array.from(pages); const [m]=copy.splice(src,1); copy.splice(dst,0,m); setPages(copy)
  }

  function removeAt(i){ setPages(prev=>prev.filter((_,idx)=>idx!==i)) }

  if(!file) return <div className='text-sm text-slate-500'>No file selected</div>

  return (
    <div>
      {loading && <div className='text-sm text-slate-500 mb-2'>Rendering previews...</div>}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='pages' direction='horizontal'>
          {(provided)=>(
            <div ref={provided.innerRef} {...provided.droppableProps} className='flex gap-3 overflow-x-auto py-2'>
              {pages.map((p,idx)=>(
                <Draggable key={p.pageIndex+'-'+idx} draggableId={String(p.pageIndex)+'-'+idx} index={idx}>
                  {(prov)=>(
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className='relative bg-white rounded shadow p-1'>
                      <img src={p.img} alt={'page-'+(idx+1)} style={{height:140}} />
                      <button onClick={()=>removeAt(idx)} className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs'>×</button>
                      <div className='text-xs text-center mt-1'>Page {idx+1}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
