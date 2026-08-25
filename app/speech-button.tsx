'use client';

import { useEffect, useState } from 'react';

export function SpeechButton({text,label='Listen',className=''}:{text:string;label?:string;className?:string}) {
  const [playing,setPlaying]=useState(false);
  const [unsupported,setUnsupported]=useState(false);

  useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel()},[]);

  const toggle=()=>{
    if(!('speechSynthesis' in window)){setUnsupported(true);return;}
    if(playing){window.speechSynthesis.cancel();setPlaying(false);return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='en-GB';
    utterance.rate=.9;
    utterance.onend=()=>setPlaying(false);
    utterance.onerror=()=>setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  return <>
    <button type="button" className={`listen-button ${playing?'playing':''} ${className}`.trim()} onClick={toggle} aria-label={`${playing?'Stop':'Listen to'}: ${text}`} aria-pressed={playing}>
      <span className="listen-icon" aria-hidden="true">{playing?'■':'▶'}</span>
      <span>{playing?'Stop':label}</span>
    </button>
    {unsupported&&<span className="sr-only" role="status">Speech playback is not supported in this browser.</span>}
  </>;
}
