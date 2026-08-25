'use client';

import { useEffect, useState } from 'react';

const BRITISH_WOMAN_VOICES=['sonia','hazel','libby','serena','kate','google uk english female','female'];

export function createBritishWomanUtterance(text:string) {
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='en-GB';
  const voices=window.speechSynthesis.getVoices();
  const british=voices.filter(voice=>voice.lang.toLowerCase().replace('_','-').startsWith('en-gb'));
  const preferred=BRITISH_WOMAN_VOICES.map(name=>british.find(voice=>voice.name.toLowerCase().includes(name))).find(Boolean)
    ?? voices.find(voice=>voice.lang.toLowerCase().startsWith('en')&&BRITISH_WOMAN_VOICES.some(name=>voice.name.toLowerCase().includes(name)))
    ?? british[0];
  if(preferred)utterance.voice=preferred;
  return utterance;
}

export function SpeechButton({text,label='Listen',className=''}:{text:string;label?:string;className?:string}) {
  const [playing,setPlaying]=useState(false);
  const [unsupported,setUnsupported]=useState(false);

  useEffect(()=>{
    if('speechSynthesis' in window)window.speechSynthesis.getVoices();
    return()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel()};
  },[]);

  const toggle=()=>{
    if(!('speechSynthesis' in window)){setUnsupported(true);return;}
    if(playing){window.speechSynthesis.cancel();setPlaying(false);return;}
    window.speechSynthesis.cancel();
    const utterance=createBritishWomanUtterance(text);
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
