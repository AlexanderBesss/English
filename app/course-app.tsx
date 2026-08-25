'use client';

import { useCallback, useEffect, useState } from 'react';
import { categoryInfo, categoryOrder, getTopic, topics } from './content';
import { irregularVerbs } from './content/verbs/irregulars';
import { isCorrect } from './content/shared';
import { completionPercent, EMPTY_PROGRESS, loadProgress, recordScore, STORAGE_KEY, toggleBookmark, topicProgress } from './lib/progress';
import { filterTopics } from './lib/search';
import type { CategoryId, Exercise, ProgressState, Topic } from './lib/types';

function useRoute() {
  const [path,setPath]=useState('/');
  useEffect(()=>{ const sync=()=>setPath(window.location.pathname); sync(); window.addEventListener('popstate',sync); return()=>window.removeEventListener('popstate',sync); },[]);
  const navigate=(to:string)=>{ window.history.pushState({},'',to); setPath(to); window.scrollTo({top:0,behavior:'smooth'}); };
  return {path,navigate};
}

function useProgress() {
  const [progress,setProgress]=useState<ProgressState>(EMPTY_PROGRESS);
  useEffect(()=>{const timer=window.setTimeout(()=>setProgress(loadProgress(localStorage.getItem(STORAGE_KEY))),0);return()=>window.clearTimeout(timer)},[]);
  const save=useCallback((next:ProgressState)=>{setProgress(next);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));},[]);
  return {progress,save};
}

function Header({navigate,progress}:{navigate:(to:string)=>void;progress:ProgressState}) {
  return <header className="app-header">
    <button className="brand" onClick={()=>navigate('/')}><span className="brand-mark">FP</span><span>Fluent Path</span></button>
    <nav aria-label="Main navigation">
      <button onClick={()=>navigate('/')}>Learn</button>
      <button onClick={()=>navigate('/reference/irregular-verbs')}>Reference</button>
      <button onClick={()=>navigate('/progress')}>Progress</button>
    </nav>
    <div className="header-progress" aria-label={`${completionPercent(progress,topics.length)} percent complete`}><span>{completionPercent(progress,topics.length)}%</span><i><b style={{width:`${completionPercent(progress,topics.length)}%`}}/></i></div>
  </header>;
}

function Dashboard({navigate,progress}:{navigate:(to:string)=>void;progress:ProgressState}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState<'all'|CategoryId>('all');
  const [level,setLevel]=useState<'all'|'B1+'|'B2'>('all');
  const [status,setStatus]=useState<'all'|'open'|'complete'|'bookmarked'>('all');
  const filtered=filterTopics(topics,progress,query,category,level,status);
  const last=getTopic(progress.lastOpened??'')??getTopic('present-perfect')!;
  return <main>
    <section className="dash-hero">
      <div><p className="eyebrow">Your B1 → B2 learning path</p><h1>Move beyond<br/><em>good enough.</em></h1><p className="hero-lede">Master the patterns, choices and details that make your English sound clear, flexible and confident.</p>
      <div className="hero-actions"><button className="button primary" onClick={()=>navigate(`/lesson/${last.id}`)}>Continue learning <span>→</span></button><span className="lesson-count"><strong>{topics.length}</strong> focused topics</span></div></div>
      <div className="progress-orbit">
        <div className="orbit-score"><strong>{completionPercent(progress,topics.length)}%</strong><span>course complete</span></div>
        <div className="orbit-label one">B1</div><div className="orbit-label two">B2</div>
        <p>{Object.values(progress.topics).filter(p=>p.completed).length} of {topics.length} topics mastered</p>
      </div>
    </section>

    <section className="curriculum-section">
      <div className="section-heading"><div><p className="eyebrow">The curriculum</p><h2>Choose your focus</h2></div><p>Every topic combines a concise lesson, natural examples, common mistakes and active practice.</p></div>
      <div className="category-strip">{categoryOrder.map((id,index)=>{const count=topics.filter(t=>t.category===id).length;const info=categoryInfo[id];return <button key={id} className={`mini-category ${info.colour}`} onClick={()=>{setCategory(id);document.getElementById('topic-library')?.scrollIntoView({behavior:'smooth'})}}><span>0{index+1}</span><strong>{info.name}</strong><small>{count} {count===1?'topic':'topics'} ↗</small></button>})}</div>
    </section>

    <section className="library-section" id="topic-library">
      <div className="library-title"><div><p className="eyebrow">Explore all lessons</p><h2>Topic library</h2></div><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tenses, conditionals, writing…" aria-label="Search topics"/></label></div>
      <div className="filters">
        <select aria-label="Filter by category" value={category} onChange={e=>setCategory(e.target.value as typeof category)}><option value="all">All categories</option>{categoryOrder.map(id=><option value={id} key={id}>{categoryInfo[id].name}</option>)}</select>
        <select aria-label="Filter by difficulty" value={level} onChange={e=>setLevel(e.target.value as typeof level)}><option value="all">All levels</option><option>B1+</option><option>B2</option></select>
        <select aria-label="Filter by completion" value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">Any status</option><option value="open">Not completed</option><option value="complete">Completed</option><option value="bookmarked">Bookmarked</option></select>
        <button className="clear-filter" onClick={()=>{setQuery('');setCategory('all');setLevel('all');setStatus('all')}}>Clear filters</button>
      </div>
      <p className="results-count">{filtered.length} {filtered.length===1?'topic':'topics'}</p>
      <div className="topic-grid">{filtered.map((topic,index)=><TopicCard key={topic.id} topic={topic} progress={progress} navigate={navigate} index={index}/>)}</div>
      {!filtered.length&&<div className="empty-state"><strong>No lessons found.</strong><p>Try a broader search or clear the filters.</p></div>}
    </section>
  </main>;
}

function TopicCard({topic,progress,navigate,index}:{topic:Topic;progress:ProgressState;navigate:(to:string)=>void;index:number}) {
  const p=topicProgress(progress,topic.id);
  return <article className="topic-card">
    <div className="topic-meta"><span className={`category-pill ${categoryInfo[topic.category].colour}`}>{categoryInfo[topic.category].name}</span><span>{topic.level} · {topic.minutes} min</span></div>
    <h3>{topic.title}</h3><p>{topic.summary}</p>
    <div className="topic-card-footer"><span>{p.completed?'✓ Completed':p.attempts?`Best score ${p.bestScore}%`:`Lesson ${String(index+1).padStart(2,'0')}`}</span><button aria-label={`Open ${topic.title}`} onClick={()=>navigate(`/lesson/${topic.id}`)}>→</button></div>
  </article>;
}

function Lesson({topic,navigate,progress,save}:{topic:Topic;navigate:(to:string)=>void;progress:ProgressState;save:(p:ProgressState)=>void}) {
  const p=topicProgress(progress,topic.id);
  useEffect(()=>{if(progress.lastOpened!==topic.id){const timer=window.setTimeout(()=>save({...progress,lastOpened:topic.id}),0);return()=>window.clearTimeout(timer)}},[progress,save,topic.id]);
  const [transcriptOpen,setTranscriptOpen]=useState(false);
  const [speechMessage,setSpeechMessage]=useState('');
  const speak=(text:string)=>{
    if(!('speechSynthesis' in window)){setSpeechMessage('Speech playback is not supported in this browser. Use the transcript below.');return;}
    window.speechSynthesis.cancel(); const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-GB';window.speechSynthesis.speak(utterance);setSpeechMessage('Playing with your browser voice.');
  };
  return <main className="lesson-page">
    <div className="lesson-breadcrumb"><button onClick={()=>navigate('/')}>All lessons</button><span>/</span><span>{categoryInfo[topic.category].name}</span></div>
    <section className="lesson-header">
      <div><div className="topic-meta"><span className={`category-pill ${categoryInfo[topic.category].colour}`}>{categoryInfo[topic.category].name}</span><span>{topic.level} · {topic.minutes} min</span></div><h1>{topic.title}</h1><p>{topic.summary}</p>
      <div className="lesson-actions"><button className="button primary" onClick={()=>navigate(`/practice/${topic.id}`)}>{p.attempts?'Practice again':'Start practice'} <span>→</span></button><button className={`bookmark ${p.bookmarked?'saved':''}`} onClick={()=>save(toggleBookmark(progress,topic.id))}>{p.bookmarked?'★ Saved':'☆ Save lesson'}</button></div></div>
      <aside className="objective-card"><p className="eyebrow">By the end, you can</p><ul>{topic.objectives.map(o=><li key={o.id}>{o.text}</li>)}</ul>{topic.prerequisite&&<button onClick={()=>navigate(`/lesson/${topic.prerequisite}`)}>Prerequisite: {getTopic(topic.prerequisite)?.title} →</button>}</aside>
    </section>
    <div className="lesson-layout">
      <article className="lesson-content">
        {topic.sections.map((section,index)=><section className="lesson-section" key={section.id}><div className="section-number">0{index+1}</div><h2>{section.title}</h2><p>{section.body}</p>{section.examples?.map(ex=><div className="example-box" key={ex.sentence}><span>{ex.label}</span><strong>{ex.sentence}</strong><p>{ex.note}</p><button onClick={()=>speak(ex.sentence)} aria-label={`Listen to: ${ex.sentence}`}>🔊 Listen</button></div>)}</section>)}
        {topic.table&&<section className="lesson-section"><div className="section-number">03</div><h2>Compare the forms</h2><div className="table-wrap"><table><thead><tr>{topic.table.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{topic.table.rows.map((row,i)=><tr key={i}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>}
        <section className="mistake-section"><p className="eyebrow">Common mistake</p><div className="wrong-line"><span>×</span>{topic.mistake.wrong}</div><div className="right-line"><span>✓</span>{topic.mistake.right}</div><p>{topic.mistake.explanation}</p></section>
        {topic.transcript&&<section className="listening-section"><p className="eyebrow">Listening practice</p><h2>Listen for the main message</h2><div className="audio-controls"><button className="button primary" onClick={()=>speak(topic.transcript!)}>▶ Play passage</button><button onClick={()=>setTranscriptOpen(!transcriptOpen)}>{transcriptOpen?'Hide':'Show'} transcript</button></div><p className="speech-status" role="status">{speechMessage}</p>{transcriptOpen&&<div className="transcript">{topic.transcript}</div>}</section>}
        <section className="production-card"><p className="eyebrow">Put it into practice</p><h2>Your production task</h2><p>{topic.production.prompt}</p><details><summary>Show model answer and checklist</summary><blockquote>{topic.production.model}</blockquote><ul>{topic.production.checklist.map(item=><li key={item}>{item}</li>)}</ul></details></section>
      </article>
      <aside className="lesson-sidebar"><strong>In this lesson</strong><a href="#key-idea">Key idea</a><span>Meaning and examples</span><span>Common mistake</span><span>Production task</span><div className="sidebar-score"><small>Your best score</small><b>{p.attempts?`${p.bestScore}%`:'Not attempted'}</b></div></aside>
    </div>
    <section className="practice-cta"><div><p className="eyebrow">Ready to check your understanding?</p><h2>12 questions. Instant feedback.</h2></div><button className="button primary" onClick={()=>navigate(`/practice/${topic.id}`)}>Start practice <span>→</span></button></section>
  </main>;
}

function Practice({topic,navigate,progress,save}:{topic:Topic;navigate:(to:string)=>void;progress:ProgressState;save:(p:ProgressState)=>void}) {
  const [index,setIndex]=useState(0),[input,setInput]=useState(''),[selected,setSelected]=useState<string[]>([]),[checked,setChecked]=useState(false),[correctCount,setCorrectCount]=useState(0),[done,setDone]=useState(false);
  const exercise=topic.exercises[index];
  const answerValue=exercise.type==='ordering'?selected.join(' '):input;
  const correct=isCorrect(answerValue,exercise.answer.values);
  const choose=(option:string)=>{if(!checked)setInput(option)};
  const submit=()=>{if(!answerValue.trim())return;setChecked(true);if(isCorrect(answerValue,exercise.answer.values))setCorrectCount(c=>c+1)};
  const next=()=>{if(index===topic.exercises.length-1){const final=Math.round((correctCount+(correct?0:0))/topic.exercises.length*100);save(recordScore(progress,topic.id,final));setDone(true);return;}setIndex(i=>i+1);setInput('');setSelected([]);setChecked(false)};
  if(done){const score=Math.round(correctCount/topic.exercises.length*100);return <main className="result-page"><div className="result-ring"><strong>{score}%</strong><span>{score>=70?'Lesson complete':'Keep practising'}</span></div><p className="eyebrow">Practice result</p><h1>{score>=90?'Excellent control.':score>=70?'Strong progress.':'One more round?'}</h1><p>You answered {correctCount} of {topic.exercises.length} questions correctly. Every attempt strengthens retrieval.</p><div className="result-actions"><button className="button primary" onClick={()=>navigate(`/lesson/${topic.id}`)}>Return to lesson</button><button onClick={()=>{setIndex(0);setInput('');setSelected([]);setChecked(false);setCorrectCount(0);setDone(false)}}>Try again</button></div></main>}
  return <main className="practice-page">
    <div className="practice-top"><button onClick={()=>navigate(`/lesson/${topic.id}`)}>× Exit</button><div><span>{topic.title}</span><div className="practice-bar"><i style={{width:`${(index+1)/topic.exercises.length*100}%`}}/></div></div><strong>{index+1} / {topic.exercises.length}</strong></div>
    <section className="question-card">
      <div className="question-type">{exercise.type.replace('-',' ')}</div><h1>{exercise.prompt}</h1>
      <ExerciseInput exercise={exercise} input={input} setInput={setInput} selected={selected} setSelected={setSelected} checked={checked} choose={choose}/>
      {checked&&<div className={`feedback ${correct?'correct':'incorrect'}`} role="status"><strong>{correct?'✓ Correct':'Not quite yet'}</strong><p>{exercise.answer.explanation}</p>{!correct&&<p className="answer-line">Answer: {exercise.answer.values[0]}</p>}</div>}
      <div className="question-actions">{!checked?<button className="button primary" disabled={!answerValue.trim()} onClick={submit}>Check answer</button>:<button className="button primary" onClick={next}>{index===topic.exercises.length-1?'See result':'Next question'} →</button>}</div>
    </section>
  </main>;
}

function ExerciseInput({exercise,input,setInput,selected,setSelected,checked,choose}:{exercise:Exercise;input:string;setInput:(v:string)=>void;selected:string[];setSelected:(v:string[])=>void;checked:boolean;choose:(v:string)=>void}) {
  if(exercise.type==='multiple-choice'||exercise.type==='matching')return <div className="option-list">{exercise.options?.map((option,i)=><button disabled={checked} className={input===option?'selected':''} onClick={()=>choose(option)} key={option}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>;
  if(exercise.type==='ordering')return <div><div className="order-answer">{selected.length?selected.map((token,i)=><button disabled={checked} key={i} onClick={()=>setSelected(selected.filter((_,j)=>j!==i))}>{token}</button>):<span>Select words to build the sentence</span>}</div><div className="token-list">{exercise.tokens?.map((token,i)=>{const availableOccurrence=exercise.tokens!.slice(0,i+1).filter(t=>t===token).length;const used=selected.filter(t=>t===token).length;return <button disabled={checked||used>=availableOccurrence} key={i} onClick={()=>setSelected([...selected,token])}>{token}</button>})}</div></div>;
  return <label className="answer-input"><span>Your answer</span><input disabled={checked} value={input} onChange={e=>setInput(e.target.value)} placeholder={exercise.type==='gap-fill'||exercise.type==='short-answer'?'Type the missing word or phrase':'Write the complete corrected sentence'}/></label>;
}

function IrregularReference({navigate}:{navigate:(to:string)=>void}) {
  const [query,setQuery]=useState('');
  const filtered=irregularVerbs.filter(v=>Object.values(v).join(' ').toLowerCase().includes(query.toLowerCase()));
  const speak=(text:string)=>{if('speechSynthesis'in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';window.speechSynthesis.speak(u)}};
  return <main className="reference-page">
    <section className="reference-hero"><p className="eyebrow">Foundational reference</p><h1>Irregular verbs,<br/><em>made searchable.</em></h1><p>Review the forms you need most. Search by any form, listen, then notice the verb inside a natural sentence.</p></section>
    <section className="reference-table-section"><div className="library-title"><div><h2>{irregularVerbs.length} essential verbs</h2><p>British pronunciation hints · Natural examples</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search go, went or gone…" aria-label="Search irregular verbs"/></label></div>
    <div className="table-wrap irregular-table"><table><thead><tr><th>Base form</th><th>Past simple</th><th>Past participle</th><th>Pronunciation & use</th><th></th></tr></thead><tbody>{filtered.map(verb=><tr key={verb.base}><td><strong>{verb.base}</strong></td><td>{verb.past}</td><td>{verb.participle}</td><td><span className="pronunciation">{verb.pronunciation}</span><br/>{verb.example}<small>{verb.note}</small></td><td><button onClick={()=>speak(`${verb.base}, ${verb.past}, ${verb.participle}. ${verb.example}`)} aria-label={`Listen to ${verb.base}`}>🔊</button></td></tr>)}</tbody></table></div></section>
    <button className="floating-back" onClick={()=>navigate('/')}>← Back to lessons</button>
  </main>;
}

function ProgressPage({progress,save,navigate}:{progress:ProgressState;save:(p:ProgressState)=>void;navigate:(to:string)=>void}) {
  const completed=Object.values(progress.topics).filter(p=>p.completed).length;
  const attempts=Object.values(progress.topics).reduce((sum,p)=>sum+p.attempts,0);
  const bookmarked=Object.values(progress.topics).filter(p=>p.bookmarked).length;
  return <main className="progress-page"><section className="progress-hero"><p className="eyebrow">Your learning record</p><h1>Small steps.<br/><em>Visible progress.</em></h1><p>Your results stay on this device. Return to any lesson and improve your best score.</p></section>
    <section className="stat-grid"><div><strong>{completionPercent(progress,topics.length)}%</strong><span>course complete</span></div><div><strong>{completed}</strong><span>topics mastered</span></div><div><strong>{attempts}</strong><span>practice attempts</span></div><div><strong>{bookmarked}</strong><span>saved lessons</span></div></section>
    <section className="category-progress"><div className="section-heading"><div><p className="eyebrow">By category</p><h2>Where you are growing</h2></div></div>
    {categoryOrder.map(id=>{const list=topics.filter(t=>t.category===id),done=list.filter(t=>topicProgress(progress,t.id).completed).length,pct=Math.round(done/list.length*100);return <div className="progress-row" key={id}><div><strong>{categoryInfo[id].name}</strong><span>{done} of {list.length}</span></div><div className="wide-progress"><i style={{width:`${pct}%`}}/></div><b>{pct}%</b></div>})}</section>
    <section className="progress-controls"><div><h2>Progress controls</h2><p>Resetting removes scores, completion and bookmarks from this browser.</p></div><button onClick={()=>{if(window.confirm('Reset all Fluent Path progress on this device?'))save(EMPTY_PROGRESS)}}>Reset all progress</button></section>
    <button className="floating-back" onClick={()=>navigate('/')}>← Back to lessons</button>
  </main>;
}

function NotFound({navigate}:{navigate:(to:string)=>void}) {return <main className="not-found"><p className="eyebrow">404</p><h1>That lesson wandered off.</h1><p>The link may be outdated. The complete curriculum is waiting on the dashboard.</p><button className="button primary" onClick={()=>navigate('/')}>Return home</button></main>}

export default function CourseApp() {
  const {path,navigate}=useRoute();
  const {progress,save}=useProgress();
  let content;
  if(path==='/')content=<Dashboard navigate={navigate} progress={progress}/>;
  else if(path==='/reference/irregular-verbs')content=<IrregularReference navigate={navigate}/>;
  else if(path==='/progress')content=<ProgressPage progress={progress} save={save} navigate={navigate}/>;
  else if(path.startsWith('/lesson/')){const topic=getTopic(path.split('/')[2]);content=topic?<Lesson topic={topic} navigate={navigate} progress={progress} save={save}/>:<NotFound navigate={navigate}/>;}
  else if(path.startsWith('/practice/')){const topic=getTopic(path.split('/')[2]);content=topic?<Practice topic={topic} navigate={navigate} progress={progress} save={save}/>:<NotFound navigate={navigate}/>;}
  else content=<NotFound navigate={navigate}/>;
  return <><Header navigate={navigate} progress={progress}/><div id="main-content">{content}</div><footer><span>Fluent Path</span><p>English that takes you somewhere.</p><span>B1 → B2</span></footer></>;
}
