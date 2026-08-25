'use client';

import { useCallback, useEffect, useState } from 'react';
import { categoryInfo, categoryOrder, getTopic, topics } from './content';
import { isCorrect } from './content/shared';
import { completionPercent, EMPTY_PROGRESS, loadProgress, recordScore, STORAGE_KEY, toggleBookmark, topicProgress } from './lib/progress';
import { filterTopics, type TopicStatus } from './lib/search';
import type { CategoryId, Exercise, ProgressState, Topic } from './lib/types';
import { GeneralReferencePage, IrregularReferencePage, ReferenceHubPage, ReferenceReviewPage, TensesReferencePage } from './reference-pages';
import { SpeechButton } from './speech-button';

const TENSE_LESSON_IDS=['tense-system','present-perfect','narrative-tenses','future-forms'];
const B1_TOPICS=topics.filter(topic=>topic.level==='B1+');

function useRoute() {
  const [path,setPath]=useState('/');
  useEffect(()=>{ const sync=()=>setPath(new URLSearchParams(window.location.search).get('route')??'/'); sync(); window.addEventListener('popstate',sync); return()=>window.removeEventListener('popstate',sync); },[]);
  const navigate=(to:string)=>{ const url=new URL(window.location.href); if(to==='/')url.searchParams.delete('route');else url.searchParams.set('route',to);url.hash='';window.history.pushState({},'',url);setPath(to);window.scrollTo({top:0,behavior:'smooth'}); };
  return {path,navigate};
}

function useProgress() {
  const [progress,setProgress]=useState<ProgressState>(EMPTY_PROGRESS);
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{setProgress(loadProgress(localStorage.getItem(STORAGE_KEY)));setHydrated(true)},0);return()=>window.clearTimeout(timer)},[]);
  const save=useCallback((next:ProgressState)=>{setProgress(next);localStorage.setItem(STORAGE_KEY,JSON.stringify(next));},[]);
  return {progress,save,hydrated};
}

type Theme='light'|'dark';
function useTheme(){
  const [theme,setTheme]=useState<Theme>('light');
  useEffect(()=>{const current=document.documentElement.dataset.theme==='dark'?'dark':'light';const timer=window.setTimeout(()=>setTheme(current),0);return()=>window.clearTimeout(timer)},[]);
  const toggle=()=>setTheme(current=>{const next=current==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('fluent-path-theme',next);return next});
  return {theme,toggle};
}

function Header({path,navigate,progress,theme,toggleTheme}:{path:string;navigate:(to:string)=>void;progress:ProgressState;theme:Theme;toggleTheme:()=>void}) {
  const active=path.startsWith('/reference')?'reference':'learn';
  const learnerPercent=completionPercent(progress,B1_TOPICS.length);
  return <header className="app-header">
    <button className="brand" onClick={()=>navigate('/')}><span className="brand-mark">FP</span><span>Fluent Path</span></button>
    <nav aria-label="Main navigation">
      <button className={active==='learn'?'active':''} aria-current={active==='learn'?'page':undefined} onClick={()=>navigate('/')}>Learn</button>
      <button className={active==='reference'?'active':''} aria-current={active==='reference'?'page':undefined} onClick={()=>navigate('/reference')}>Reference</button>
    </nav>
    <div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme==='light'?'dark':'light'} mode`} title={`Switch to ${theme==='light'?'dark':'light'} mode`}><span aria-hidden="true">{theme==='light'?'☾':'☀'}</span><small>{theme==='light'?'Dark':'Light'}</small></button><div className="header-progress" aria-label={`${learnerPercent} percent complete`}><span>{learnerPercent}%</span><i><b style={{width:`${learnerPercent}%`}}/></i></div></div>
  </header>;
}

function Dashboard({navigate,progress,save}:{navigate:(to:string)=>void;progress:ProgressState;save:(p:ProgressState)=>void}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState<'all'|CategoryId>('all');
  const [status,setStatus]=useState<TopicStatus>('all');
  const visible=filterTopics(B1_TOPICS,progress,query,category,'B1+',status);
  return <main>
    <section className="library-section course-library"><div className="library-title"><div><h1>B1+ lessons</h1><p>{visible.length} of {B1_TOPICS.length} lessons</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search lessons…" aria-label="Search B1+ lessons"/></label></div><div className="filters"><select value={category} onChange={event=>setCategory(event.target.value as 'all'|CategoryId)} aria-label="Filter by category"><option value="all">All areas</option>{categoryOrder.map(id=><option value={id} key={id}>{categoryInfo[id].name}</option>)}</select><select value={status} onChange={event=>setStatus(event.target.value as TopicStatus)} aria-label="Filter by progress"><option value="all">All progress</option><option value="open">Not completed</option><option value="complete">Completed</option><option value="bookmarked">Bookmarked</option></select>{(query||category!=='all'||status!=='all')&&<button className="clear-filter" onClick={()=>{setQuery('');setCategory('all');setStatus('all')}}>Clear filters</button>}</div><div className="topic-grid">{visible.map(topic=>{const p=topicProgress(progress,topic.id);return <article className="topic-card" key={topic.id}><div className="topic-meta"><span className={`category-pill ${categoryInfo[topic.category].colour}`}>{categoryInfo[topic.category].name}</span><span>{p.completed?'✓ Complete':`${topic.minutes} min`}</span></div><h3>{topic.title}</h3><p>{topic.summary}</p><div className="topic-card-footer"><button className={`bookmark ${p.bookmarked?'saved':''}`} onClick={()=>save(toggleBookmark(progress,topic.id))} aria-label={`${p.bookmarked?'Remove':'Add'} bookmark for ${topic.title}`}>{p.bookmarked?'★':'☆'}</button><span>{topic.exercises.length} questions</span><button onClick={()=>navigate(`/lesson/${topic.id}`)} aria-label={`Open ${topic.title}`}>→</button></div></article>})}</div>{!visible.length&&<div className="empty-state"><strong>No lessons match those filters.</strong><p>Try another area or clear the search.</p></div>}</section>
  </main>;
}

function QuickCheck({exercise,number}:{exercise:Exercise;number:number}) {
  const [selected,setSelected]=useState('');
  const [checked,setChecked]=useState(false);
  const correct=checked&&isCorrect(selected,exercise.answer.values);
  return <aside className="quick-check">
    <div className="quick-check-heading"><div><p className="eyebrow">Quick check {number} of 2</p><h3>Pause and retrieve</h3></div><span>About 30 sec</span></div>
    <p className="quick-check-prompt">{exercise.prompt}</p>
    <div className="quick-options">{exercise.options?.map((option,index)=><button key={option} disabled={checked} className={selected===option?'selected':''} onClick={()=>setSelected(option)}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>
    {!checked?<button className="quick-check-action" disabled={!selected} onClick={()=>setChecked(true)}>Check answer</button>:<div className={`feedback ${correct?'correct':'incorrect'}`} role="status"><strong>{correct?'✓ Correct':'Not quite yet'}</strong><p>{exercise.answer.explanation}</p>{!correct&&<p className="answer-line">Answer: {exercise.answer.values[0]}</p>}<button className="try-again" onClick={()=>{setSelected('');setChecked(false)}}>Try again</button></div>}
  </aside>;
}

function Lesson({topic,progress,save,progressHydrated}:{topic:Topic;progress:ProgressState;save:(p:ProgressState)=>void;progressHydrated:boolean}) {
  useEffect(()=>{if(progressHydrated&&progress.lastOpened!==topic.id){const timer=window.setTimeout(()=>save({...progress,lastOpened:topic.id}),0);return()=>window.clearTimeout(timer)}},[progress,progressHydrated,save,topic.id]);
  const [transcriptOpen,setTranscriptOpen]=useState(false);
  const compareId=`${topic.id}-compare`,mistakeId=`${topic.id}-mistake`,listeningId=`${topic.id}-listening`,productionId=`${topic.id}-production`;
  const outline=[
    ...topic.sections.map((section,index)=>({id:section.id,label:index===0?'Key idea':'Meaning & examples'})),
    ...(topic.table?[{id:compareId,label:'Compare forms'}]:[]),
    {id:mistakeId,label:'Common mistake'},
    ...(topic.transcript?[{id:listeningId,label:'Listening'}]:[]),
    {id:productionId,label:'Use it'},
  ];
  const stepNumber=(id:string)=>String(outline.findIndex(item=>item.id===id)+1).padStart(2,'0');
  return <main className="lesson-page">
    <nav className="lesson-roadmap" aria-label="Lesson sections"><div><p className="eyebrow">Lesson map</p><strong>{outline.length} clear steps</strong></div><div>{outline.map((item,index)=><a href={`#${item.id}`} key={item.id}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.label}</strong></a>)}</div></nav>
    <div className="lesson-layout">
      <article className="lesson-content">
        {topic.sections.map((section,index)=><section className="lesson-section lesson-block" id={section.id} key={section.id}><header className="lesson-block-heading"><div className="section-number">{stepNumber(section.id)}</div><div><p className="eyebrow">{index===0?'Understand':'See it in context'}</p><h2>{section.title}</h2></div></header><p className="lesson-lead">{section.body}</p>{section.examples&&<div className="example-stack">{section.examples.map(ex=><div className="example-box" key={ex.sentence}><span>{ex.label}</span><strong>{ex.sentence}</strong><p>{ex.note}</p><SpeechButton text={ex.sentence}/></div>)}</div>}{topic.exercises[index]?.type==='multiple-choice'&&<QuickCheck exercise={topic.exercises[index]} number={index+1}/>}</section>)}
        {topic.table&&<section className="lesson-section lesson-block" id={compareId}><header className="lesson-block-heading"><div className="section-number">{stepNumber(compareId)}</div><div><p className="eyebrow">Compare</p><h2>Compare the forms</h2></div></header><p className="block-intro">Use this table to choose the viewpoint before you choose the verb form.</p><div className="table-wrap"><table><thead><tr>{topic.table.headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{topic.table.rows.map((row,i)=><tr key={i}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>}
        <section className="mistake-section lesson-block" id={mistakeId}><header className="lesson-block-heading"><div className="section-number">{stepNumber(mistakeId)}</div><div><p className="eyebrow">Notice the difference</p><h2>Fix the common mistake</h2></div></header><div className="mistake-comparison"><div className="wrong-line"><span>×</span><div><small>Avoid</small>{topic.mistake.wrong}</div></div><div className="right-line"><span>✓</span><div><small>Use</small>{topic.mistake.right}</div></div></div><p className="mistake-reason"><strong>Why?</strong> {topic.mistake.explanation}</p></section>
        {topic.transcript&&<section className="listening-section lesson-block" id={listeningId}><header className="lesson-block-heading"><div className="section-number">{stepNumber(listeningId)}</div><div><p className="eyebrow">Listening practice</p><h2>Listen for the main message</h2></div></header><div className="audio-controls"><SpeechButton text={topic.transcript} label="Play passage" className="passage-button"/><button onClick={()=>setTranscriptOpen(!transcriptOpen)} aria-expanded={transcriptOpen}>{transcriptOpen?'Hide':'Show'} transcript</button></div>{transcriptOpen&&<div className="transcript">{topic.transcript}</div>}</section>}
        <section className="production-card lesson-block" id={productionId}><header className="lesson-block-heading"><div className="section-number">{stepNumber(productionId)}</div><div><p className="eyebrow">Put it into practice</p><h2>Your production task</h2></div></header><p>{topic.production.prompt}</p><details><summary>Show model answer and checklist</summary><blockquote>{topic.production.model}</blockquote><ul>{topic.production.checklist.map(item=><li key={item}>{item}</li>)}</ul></details></section>
      </article>
      <aside className="lesson-sidebar"><strong>In this lesson</strong>{outline.map((item,index)=><a href={`#${item.id}`} key={item.id}><span>{String(index+1).padStart(2,'0')}</span>{item.label}</a>)}</aside>
    </div>
  </main>;
}

function Practice({topic,navigate,progress,save}:{topic:Topic;navigate:(to:string)=>void;progress:ProgressState;save:(p:ProgressState)=>void}) {
  const [index,setIndex]=useState(0),[answers,setAnswers]=useState<string[]>(()=>topic.exercises.map(()=>'')),[orders,setOrders]=useState<string[][]>(()=>topic.exercises.map(()=>[])),[checked,setChecked]=useState<boolean[]>(()=>topic.exercises.map(()=>false)),[done,setDone]=useState(false);
  const exercise=topic.exercises[index];
  const selectionOnly=TENSE_LESSON_IDS.includes(topic.id);
  const input=answers[index]??'',selected=orders[index]??[];
  const answerValue=selectionOnly?input:exercise.type==='ordering'?selected.join(' '):input;
  const correct=isCorrect(answerValue,exercise.answer.values);
  const setInput=(value:string)=>setAnswers(current=>current.map((answer,i)=>i===index?value:answer));
  const setSelected=(value:string[])=>setOrders(current=>current.map((answer,i)=>i===index?value:answer));
  const choose=(option:string)=>{if(!checked[index])setInput(option)};
  const scoreCount=topic.exercises.filter((item,i)=>checked[i]&&isCorrect(selectionOnly?answers[i]:item.type==='ordering'?orders[i].join(' '):answers[i],item.answer.values)).length;
  const submit=()=>{if(answerValue.trim())setChecked(current=>current.map((value,i)=>i===index?true:value))};
  const next=()=>{const nextIndex=topic.exercises.findIndex((_,i)=>i>index&&!checked[i]);if(nextIndex>=0){setIndex(nextIndex);return;}const firstOpen=checked.findIndex(value=>!value);if(firstOpen>=0){setIndex(firstOpen);return;}const final=Math.round(scoreCount/topic.exercises.length*100);save(recordScore(progress,topic.id,final));setDone(true)};
  const reset=()=>{setIndex(0);setAnswers(topic.exercises.map(()=>''));setOrders(topic.exercises.map(()=>[]));setChecked(topic.exercises.map(()=>false));setDone(false)};
  if(done){const score=Math.round(scoreCount/topic.exercises.length*100);return <main className="result-page"><div className="result-ring"><strong>{score}%</strong><span>{score>=70?'Lesson complete':'Keep practising'}</span></div><p className="eyebrow">Practice result</p><h1>{score>=90?'Excellent control.':score>=70?'Strong progress.':'One more round?'}</h1><p>You answered {scoreCount} of {topic.exercises.length} questions correctly. Every attempt strengthens retrieval.</p><div className="result-actions"><button className="button primary" onClick={()=>navigate(`/lesson/${topic.id}`)}>Return to lesson</button><button onClick={reset}>Try again</button></div></main>}
  return <main className="practice-page">
    <div className="practice-top"><button onClick={()=>navigate(`/lesson/${topic.id}`)}>× Exit</button><div><span>{topic.title}</span><div className="practice-bar"><i style={{width:`${checked.filter(Boolean).length/topic.exercises.length*100}%`}}/></div></div><strong>{checked.filter(Boolean).length} / {topic.exercises.length} answered</strong></div>
    <div className="practice-workspace">
    <aside className="question-list" aria-label="Question board"><div className="question-list-heading"><p className="eyebrow">Practice set</p><h2>Questions</h2><span>Select a number</span></div><div className="question-grid">{topic.exercises.map((item,i)=>{const answeredCorrectly=checked[i]&&isCorrect(selectionOnly?answers[i]:item.type==='ordering'?orders[i].join(' '):answers[i],item.answer.values);const status=checked[i]?(answeredCorrectly?'correct':'incorrect'):'unanswered';return <button key={item.id} className={`${i===index?'active':''} ${status}`} onClick={()=>setIndex(i)} aria-current={i===index?'step':undefined} aria-label={`Question ${i+1}, ${status}`}><span>{i+1}</span></button>})}</div></aside>
    <section className="question-card">
      <div className="question-context"><span>Question {index+1} of {topic.exercises.length}</span><span>{checked.filter(Boolean).length} answered</span></div>{!selectionOnly&&<div className="question-type">{exercise.type.replace('-',' ')}</div>}<h1>{exercise.prompt}</h1>
      <ExerciseInput exercise={exercise} input={input} setInput={setInput} selected={selected} setSelected={setSelected} checked={checked[index]} choose={choose} forceOptions={selectionOnly}/>
      {checked[index]&&<div className={`feedback ${correct?'correct':'incorrect'}`} role="status"><strong>{correct?'✓ Correct':'Not quite yet'}</strong><p>{exercise.answer.explanation}</p>{!correct&&<p className="answer-line">Answer: {exercise.answer.values[0]}</p>}</div>}
      <div className="question-actions">{!checked[index]?<button className="button primary" disabled={!answerValue.trim()} onClick={submit}>Check answer</button>:<button className="button primary" onClick={next}>{checked.every(Boolean)?'See result':'Next unanswered'} →</button>}</div>
    </section>
    </div>
  </main>;
}

function ExerciseInput({exercise,input,setInput,selected,setSelected,checked,choose,forceOptions=false}:{exercise:Exercise;input:string;setInput:(v:string)=>void;selected:string[];setSelected:(v:string[])=>void;checked:boolean;choose:(v:string)=>void;forceOptions?:boolean}) {
  if(forceOptions||exercise.type==='multiple-choice'||exercise.type==='matching')return <div className="option-list">{exercise.options?.map((option,i)=><button disabled={checked} className={input===option?'selected':''} onClick={()=>choose(option)} key={`${option}-${i}`}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>;
  if(exercise.type==='ordering')return <div><div className="order-answer">{selected.length?selected.map((token,i)=><button disabled={checked} key={i} onClick={()=>setSelected(selected.filter((_,j)=>j!==i))}>{token}</button>):<span>Select words to build the sentence</span>}</div><div className="token-list">{exercise.tokens?.map((token,i)=>{const availableOccurrence=exercise.tokens!.slice(0,i+1).filter(t=>t===token).length;const used=selected.filter(t=>t===token).length;return <button disabled={checked||used>=availableOccurrence} key={i} onClick={()=>setSelected([...selected,token])}>{token}</button>})}</div></div>;
  return <label className="answer-input"><span>Your answer</span><input disabled={checked} value={input} onChange={e=>setInput(e.target.value)} placeholder={exercise.type==='gap-fill'||exercise.type==='short-answer'?'Type the missing word or phrase':'Write the complete corrected sentence'}/></label>;
}

function NotFound({navigate}:{navigate:(to:string)=>void}) {return <main className="not-found"><p className="eyebrow">404</p><h1>That lesson wandered off.</h1><p>The link may be outdated. The complete curriculum is waiting on the dashboard.</p><button className="button primary" onClick={()=>navigate('/')}>Return home</button></main>}

export default function CourseApp() {
  const {path,navigate}=useRoute();
  const {progress,save,hydrated:progressHydrated}=useProgress();
  const {theme,toggle:toggleTheme}=useTheme();
  let content;
  if(path==='/')content=<Dashboard navigate={navigate} progress={progress} save={save}/>;
  else if(path==='/reference')content=<ReferenceHubPage navigate={navigate}/>;
  else if(path==='/reference/tenses')content=<TensesReferencePage navigate={navigate}/>;
  else if(path==='/reference/irregular-verbs')content=<IrregularReferencePage navigate={navigate}/>;
  else if(path==='/reference/review')content=<ReferenceReviewPage navigate={navigate}/>;
  else if(path.startsWith('/reference/guide/'))content=<GeneralReferencePage guideId={path.split('/')[3]} navigate={navigate}/>;
  else if(path.startsWith('/lesson/')){const topic=getTopic(path.split('/')[2]);content=topic?<Lesson topic={topic} progress={progress} save={save} progressHydrated={progressHydrated}/>:<NotFound navigate={navigate}/>;}
  else if(path.startsWith('/practice/')){const topic=getTopic(path.split('/')[2]);content=topic?<Practice topic={topic} navigate={navigate} progress={progress} save={save}/>:<NotFound navigate={navigate}/>;}
  else content=<NotFound navigate={navigate}/>;
  return <><Header path={path} navigate={navigate} progress={progress} theme={theme} toggleTheme={toggleTheme}/><div id="main-content">{content}</div></>;
}
