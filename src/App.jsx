import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { FiSun, FiMoon } from 'react-icons/fi'
import Merge from './pages/Merge'
import Split from './pages/Split'
import Rotate from './pages/Rotate'
import Compress from './pages/Compress'
import HowTo from './pages/HowTo'
import Protect from './pages/Protect'
import Unlock from './pages/Unlock'
import PDFtoImg from './pages/PDFtoImg'
import ImgToPDF from './pages/ImgToPDF'
import Watermark from './pages/Watermark'
import Sign from './pages/Sign'



export default function App(){
  const [dark, setDark] = useState(false)
  const [hint, setHint] = useState('Welcome — upload a PDF to get started.')
  const location = useLocation()

  useEffect(()=>{
    const saved = localStorage.getItem('pdffusion:dark')
    if(saved) setDark(saved==='1')
  },[])

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('pdffusion:dark', dark ? '1' : '0')
  },[dark])

  useEffect(()=>{
    window.scrollTo(0,0)
  },[location.pathname])

  const tools = [
    {to:'/merge', name:'Merge'},
    {to:'/split', name:'Split'},
    {to:'/rotate', name:'Rotate'},
    {to:'/compress', name:'Compress'},
    {to:'/howto', name:'How To'},
    {to:'/protect', name:'Protect'},
    {to:'/unlock', name:'Unlock'},
    {to:'/pdf-to-img', name:'PDF→IMG'},
    {to:'/img-to-pdf', name:'IMG→PDF'},
    {to:'/Watermark', name:'Watermark'},
    {to:'/sign', name:'Sign'},

  ]

  return (
    <div className='min-h-screen'>
      <header className={'header-grad text-white p-4 flex items-center justify-between shadow-md'}>
        <div className='flex items-center gap-3'>
          <div className='bg-white/20 rounded-full p-2'><strong>PP</strong></div>
          <div>
            <div className='font-bold text-lg'>PaperPal</div>
            <div className='text-xs opacity-90'>Friendly PDF toolkit — privacy-first</div>
          </div>
        </div>

        <nav className='flex items-center gap-4'>
          {tools.map(t=>(<Link key={t.to} to={t.to} className='text-sm hover:underline'>{t.name}</Link>))}
          <button onClick={()=>setDark(d=>!d)} className='ml-3 p-2 rounded bg-white/20'>
            {dark ? <FiSun/> : <FiMoon/>}
          </button>
        </nav>
      </header>

      <main className='p-6 max-w-5xl mx-auto'>
        <div className='mb-4 text-sm text-slate-600 large-text'>{hint}</div>
        <Routes>
          <Route path='/' element={<Merge setHint={setHint} />} />
          <Route path='/merge' element={<Merge setHint={setHint} />} />
          <Route path='/split' element={<Split setHint={setHint} />} />
          <Route path='/rotate' element={<Rotate setHint={setHint} />} />
          <Route path='/compress' element={<Compress setHint={setHint} />} />
          <Route path='/howto' element={<HowTo />} />
          <Route path="/protect" element={<Protect/>} />
          <Route path="/unlock" element={<Unlock/>} />
          <Route path="/pdf-to-img" element={<PDFtoImg/>} />
          <Route path="/img-to-pdf" element={<ImgToPDF/>} />
          <Route path="/watermark" element={<Watermark/>} />
          <Route path="/sign" element={<Sign/>} />
        </Routes>
      </main>

      <footer className='max-w-5xl mx-auto p-4 text-sm text-slate-500'>PaperPal • Privacy-first, no login • Built with ❤️</footer>
    </div>
  )
}
