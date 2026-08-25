'use client';

import { useEffect, useState } from 'react';
import { tenseComparisons, tenseReferences } from './content/grammar/tenses';
import { irregularVerbs } from './content/verbs/irregulars';
import { getReferenceGuide, referenceGuides, type ReferenceItem } from './content/reference/guides';
import { softwareGuideExamples, softwareTenseComparisonExamples, softwareTenseExamples, softwareVerbExamples } from './content/reference/software-examples';
import { SpeechButton } from './speech-button';

type Navigate=(to:string)=>void;
type Confidence='hard'|'unsure'|'known';
interface ReviewMark { saved:boolean; confidence?:Confidence }
type ReviewState=Record<string,ReviewMark>;
const REVIEW_KEY='fluent-path-reference-review-v1';

function useReferenceReview(){
  const [review,setReview]=useState<ReviewState>({});
  useEffect(()=>{const timer=window.setTimeout(()=>{try{const parsed=JSON.parse(localStorage.getItem(REVIEW_KEY)??'{}');if(parsed&&typeof parsed==='object')setReview(parsed)}catch{/* Ignore invalid device data. */}},0);return()=>window.clearTimeout(timer)},[]);
  const update=(id:string,patch:Partial<ReviewMark>)=>setReview(current=>{const previous=current[id];const mark:ReviewMark={saved:patch.saved??previous?.saved??false,confidence:patch.confidence??previous?.confidence};const next={...current,[id]:mark};localStorage.setItem(REVIEW_KEY,JSON.stringify(next));return next});
  return {review,update};
}

const keyFor=(guide:string,item:string)=>`${guide}:${item}`;
const isReviewItem=(mark?:ReviewMark)=>Boolean(mark?.saved||mark?.confidence==='hard'||mark?.confidence==='unsure');

const referenceVisuals:Record<string,{kicker:string;main:string;detail:string}>={
  tenses:{kicker:'PAST   NOW   FUTURE',main:'12 : 45',detail:'a moment in time'},
  'irregular-verbs':{kicker:'BASE   PAST',main:'go → went',detail:'forms that transform'},
  conditionals:{kicker:'POSSIBILITY',main:'IF → THEN',detail:'cause meets result'},
  modals:{kicker:'CERTAINTY',main:'might / must',detail:'shade the meaning'},
  articles:{kicker:'IDENTITY',main:'a · an · the',detail:'name what you mean'},
  'verb-patterns':{kicker:'WHAT FOLLOWS?',main:'-ing / to',detail:'choose the pattern'},
  passive:{kicker:'CHANGE THE FOCUS',main:'A ← B',detail:'the action comes first'},
  reported:{kicker:'PASS IT ON',main:'“…” → …',detail:'shift the viewpoint'},
  'phrasal-verbs':{kicker:'ONE NEW MEANING',main:'turn + up',detail:'words work together'},
  prepositions:{kicker:'RELATIONSHIPS',main:'in · on · at',detail:'place words precisely'},
  collocations:{kicker:'NATURAL PAIRS',main:'make + sense',detail:'words that belong'},
  'confused-words':{kicker:'SPOT THE DIFFERENCE',main:'affect ≠ effect',detail:'close, but not the same'},
  'word-formation':{kicker:'BUILD A WORD',main:'act → action',detail:'change its job'},
  'phrase-bank':{kicker:'READY TO USE',main:'“In my view…”',detail:'start with confidence'}
};

const tenseTimelineCaptions:Record<string,string>={
  'present-simple':'repeated around now',
  'present-continuous':'in progress around now',
  'present-perfect':'past event connected to now',
  'present-perfect-continuous':'duration continuing to now',
  'past-simple':'completed before now',
  'past-continuous':'in progress at a past point',
  'past-perfect':'completed before another past point',
  'past-perfect-continuous':'duration leading to a past point',
  'future-simple':'a point after now',
  'future-continuous':'in progress at a future point',
  'future-perfect':'complete before a future deadline',
  'future-perfect-continuous':'duration continuing to a future point'
};

function TenseTimeline({id}:{id:string}){
  return <div className="tense-time-visual" data-tense={id} aria-hidden="true"><div className="tense-timeline-labels"><span>Past</span><b>Now</b><span>Future</span></div><div className="tense-timeline-track"><i/><span className="tense-timeline-connector"/><span className="tense-timeline-duration"/><span className="tense-timeline-event primary"/><span className="tense-timeline-event secondary"/><em className="tense-timeline-now"/></div><small>{tenseTimelineCaptions[id]}</small></div>;
}

function ReferenceNav({current,navigate}:{current?:string;navigate:Navigate}){
  const options=[{id:'tenses',label:'Tenses',path:'/reference/tenses'},{id:'irregular-verbs',label:'Irregular verbs',path:'/reference/irregular-verbs'},...referenceGuides.map(g=>({id:g.id,label:g.shortTitle,path:`/reference/guide/${g.id}`}))];
  return <nav className="reference-nav expanded" aria-label="Reference categories">{options.map(option=><button key={option.id} className={current===option.id?'active':''} aria-current={current===option.id?'page':undefined} onClick={()=>navigate(option.path)}>{option.label}</button>)}</nav>;
}

function ReviewControls({id,mark,update}:{id:string;mark?:ReviewMark;update:(id:string,patch:Partial<ReviewMark>)=>void}){
  return <div className="review-controls">
    <button className={mark?.saved?'active':''} aria-pressed={Boolean(mark?.saved)} onClick={()=>update(id,{saved:!mark?.saved})}>{mark?.saved?'★ Saved':'☆ Save'}</button>
    <span>How well do you know it?</span>
    {(['hard','unsure','known'] as const).map(value=><button key={value} className={mark?.confidence===value?`active ${value}`:''} aria-pressed={mark?.confidence===value} onClick={()=>update(id,{confidence:value})}>{value==='hard'?'Hard':value==='unsure'?'Unsure':'Know it'}</button>)}
  </div>;
}

function RecallCheck({prompt,answer}:{prompt:string;answer:string}){
  const [open,setOpen]=useState(false);
  return <div className="recall-check"><p><strong>Check yourself:</strong> {prompt}</p><button onClick={()=>setOpen(!open)} aria-expanded={open}>{open?'Hide answer':'Reveal answer'}</button>{open&&<p className="recall-answer">{answer}</p>}</div>;
}

export function ReferenceHubPage({navigate}:{navigate:Navigate}){
  const {review}=useReferenceReview();
  const reviewCount=Object.values(review).filter(isReviewItem).length;
  const categories=['All','Grammar','Verb systems','Vocabulary','Writing & speaking'] as const;
  const [category,setCategory]=useState<(typeof categories)[number]>('All');
  const core=[
    {id:'tenses',title:'English tenses',category:'Grammar',level:'B1+ → B2',description:'Compare 12 forms, explore meaning and test the contrasts learners confuse most.',path:'/reference/tenses'},
    {id:'irregular-verbs',title:'Irregular verbs',category:'Verb systems',level:'B1+',description:'Search, group, hide and retrieve essential past and participle forms.',path:'/reference/irregular-verbs'},
    ...referenceGuides.map(g=>({id:g.id,title:g.title,category:g.category,level:g.level,description:g.description,path:`/reference/guide/${g.id}`}))
  ];
  const visible=core.filter(card=>category==='All'||card.category===category);
  return <main className="reference-page">
    <section className="reference-hero"><p className="eyebrow">Learning tools</p><h1>Find it. Test it.<br/><em>Use it confidently.</em></h1><p>Clear reference guides now include comparisons, common mistakes, recall checks and a personal review list.</p></section>
    <section className="reference-library"><div className="reference-library-head"><div><p className="eyebrow">Reference library</p><h2>{core.length} focused guides</h2><p>{reviewCount} {reviewCount===1?'item':'items'} waiting in your review list.</p></div>{reviewCount>0&&<button className="button primary" onClick={()=>navigate('/reference/review')}>Review difficult items →</button>}</div>
      <div className="reference-category-filters">{categories.map(value=><button key={value} className={category===value?'active':''} onClick={()=>setCategory(value)}>{value}</button>)}</div>
      <div className="reference-hub expanded-hub">{visible.map((card,index)=>{const visual=referenceVisuals[card.id]??{kicker:'REFERENCE',main:'A → B',detail:'see the pattern'};return <article className="reference-library-card" data-guide={card.id} key={card.id}>
        <div className="reference-card-visual" aria-hidden="true"><span>{visual.kicker}</span><strong>{visual.main}</strong><i>{visual.detail}</i></div>
        <div className="reference-card-body"><div className="reference-card-meta"><p className="eyebrow">{card.category} · {card.level}</p><span>{String(index+1).padStart(2,'0')}</span></div><h2>{card.title}</h2><p>{card.description}</p><button onClick={()=>navigate(card.path)}>Open guide <span aria-hidden="true">→</span></button></div>
      </article>})}</div>
    </section>
    <button className="floating-back" onClick={()=>navigate('/')}>← Back to lessons</button>
  </main>;
}

export function TensesReferencePage({navigate}:{navigate:Navigate}){
  const {review,update}=useReferenceReview();
  const [query,setQuery]=useState('');
  const [time,setTime]=useState<'All'|'Present'|'Past'|'Future'>('All');
  const [mode,setMode]=useState<'browse'|'compare'|'review'>('browse');
  const [expanded,setExpanded]=useState<string[]>([]);
  const examplesFor=(id:string,fallback:string[])=>[...fallback,...(softwareTenseExamples[id]??[])];
  const filtered=tenseReferences.filter(t=>time==='All'||t.time===time).filter(t=>[t.name,t.form,t.use,t.negative,t.question,t.viewpoint,t.contrast,...t.signalWords,...examplesFor(t.id,t.examples)].join(' ').toLowerCase().includes(query.toLowerCase())).filter(t=>mode!=='review'||isReviewItem(review[keyFor('tenses',t.id)]));
  return <main className="reference-page">
    <section className="reference-hero"><p className="eyebrow">Grammar reference + practice</p><h1>English tenses,<br/><em>compared in context.</em></h1><p>Explore form and viewpoint, contrast easily confused choices, then retrieve the pattern from memory.</p></section>
    <section className="tense-reference-section"><ReferenceNav current="tenses" navigate={navigate}/>
      <div className="reference-mode-tabs" role="tablist" aria-label="Tense learning mode">{(['browse','compare','review'] as const).map(value=><button role="tab" aria-selected={mode===value} className={mode===value?'active':''} key={value} onClick={()=>setMode(value)}>{value==='browse'?'Browse 12 tenses':value==='compare'?'Compare confusing forms':'My review list'}</button>)}</div>
      {mode==='compare'?<div className="comparison-grid">{tenseComparisons.map(comparison=><article className="comparison-card" key={comparison.id}><div className="comparison-visual" aria-hidden="true"><span>{comparison.choices[0]?.name}</span><i>versus</i><span>{comparison.choices[1]?.name}</span></div><p className="eyebrow">Meaning contrast</p><h2>{comparison.title}</h2><p>{comparison.situation}</p><div className="comparison-choices">{comparison.choices.map((choice,index)=>{const softwareExample=softwareTenseComparisonExamples[comparison.id]?.[index],examples=[choice.example,...(softwareExample?[softwareExample]:[])];return <div key={choice.name}><strong>{choice.name}</strong>{examples.map(example=><div className="speakable-example" key={example}><p>{example}</p><SpeechButton text={example}/></div>)}<small>{choice.meaning}</small></div>})}</div><RecallCheck prompt={comparison.question} answer={comparison.answer}/></article>)}</div>:<>
        <div className="library-title"><div><h2>{mode==='review'?'Tenses to review':'12 tense forms'}</h2><p>Positive · Negative · Question · Viewpoint · Common mistake</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a form, meaning or example…" aria-label="Search English tenses"/></label></div>
        <div className="tense-filters" aria-label="Filter tenses by time">{(['All','Present','Past','Future'] as const).map(option=><button key={option} className={time===option?'active':''} aria-pressed={time===option} onClick={()=>setTime(option)}>{option}</button>)}</div>
        <p className="results-count">{filtered.length} {filtered.length===1?'tense':'tenses'}</p>
        <div className="tense-grid enriched">{filtered.map(tense=>{const open=expanded.includes(tense.id),key=keyFor('tenses',tense.id),mark=review[key],examples=examplesFor(tense.id,tense.examples);return <article className={`tense-card ${tense.time.toLowerCase()}`} key={tense.id}><TenseTimeline id={tense.id}/><div className="tense-card-top"><span>{tense.time}</span><small>{tense.name.includes('perfect')?'Perfect aspect':'Core form'}</small></div><h2>{tense.name}</h2><div className="tense-form"><small>Positive form</small><strong>{tense.form}</strong></div><p>{tense.use}</p><p className="viewpoint"><strong>Viewpoint:</strong> {tense.viewpoint}</p><div className="signal-list" aria-label="Common clues, not fixed rules">{tense.signalWords.map(word=><span key={word}>{word}</span>)}</div><small className="clue-note">Common clues—not fixed rules</small><div className="tense-examples"><small>Examples</small>{examples.map(example=><div className="speakable-example" key={example}><p>{example}</p><SpeechButton text={example}/></div>)}</div><button className="details-toggle" onClick={()=>setExpanded(open?expanded.filter(id=>id!==tense.id):[...expanded,tense.id])} aria-expanded={open}>{open?'Hide details':'Show questions, negatives & mistakes'}</button>{open&&<div className="tense-details"><p><strong>Negative</strong>{tense.negative}</p><p><strong>Question</strong>{tense.question}</p><p><strong>Compare</strong>{tense.contrast}</p><div className="micro-mistake"><span>× {tense.mistake.wrong}</span><span>✓ {tense.mistake.right}</span></div><RecallCheck prompt={`Say or write the positive pattern for ${tense.name}.`} answer={tense.form}/></div>}<ReviewControls id={key} mark={mark} update={update}/></article>})}</div>
        {!filtered.length&&<div className="empty-state"><strong>Nothing here yet.</strong><p>{mode==='review'?'Mark a tense Hard, Unsure or Saved to add it to review.':'Try a broader search or another time.'}</p></div>}
      </>}
    </section><button className="floating-back" onClick={()=>navigate('/reference')}>← All references</button>
  </main>;
}

const verbPattern=(base:string,past:string,participle:string)=>base===past&&past===participle?'AAA':past===participle?'ABB':base===participle?'ABA':'ABC';
const essentialVerbs=new Set(['be','do','have','say','go','get','make','know','think','take','see','come','give','find','tell','become','leave','feel','put','bring']);

export function IrregularReferencePage({navigate}:{navigate:Navigate}){
  const {review,update}=useReferenceReview();
  const [query,setQuery]=useState(''),[pattern,setPattern]=useState('All'),[tier,setTier]=useState('All'),[mode,setMode]=useState<'table'|'test'|'review'>('table');
  const [hidePast,setHidePast]=useState(false),[hideParticiple,setHideParticiple]=useState(false),[testIndex,setTestIndex]=useState(0),[pastInput,setPastInput]=useState(''),[partInput,setPartInput]=useState(''),[checked,setChecked]=useState(false);
  const examplesForVerb=(verb:{base:string;example:string})=>[verb.example,...(softwareVerbExamples[verb.base]?[softwareVerbExamples[verb.base]]:[])];
  const filtered=irregularVerbs.filter(v=>[...Object.values(v),...examplesForVerb(v)].join(' ').toLowerCase().includes(query.toLowerCase())).filter(v=>pattern==='All'||verbPattern(v.base,v.past,v.participle)===pattern).filter(v=>tier==='All'||(tier==='Essential'?essentialVerbs.has(v.base):!essentialVerbs.has(v.base))).filter(v=>mode!=='review'||isReviewItem(review[keyFor('verbs',v.base)]));
  const current=filtered[testIndex%Math.max(filtered.length,1)];
  const next=()=>{setTestIndex(i=>i+1);setPastInput('');setPartInput('');setChecked(false)};
  const speak=(text:string)=>{if('speechSynthesis'in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-GB';window.speechSynthesis.speak(u)}};
  const correct=Boolean(current&&pastInput.trim().toLowerCase()===current.past.toLowerCase()&&partInput.trim().toLowerCase()===current.participle.toLowerCase());
  return <main className="reference-page"><section className="reference-hero"><p className="eyebrow">Verb reference + retrieval</p><h1>Irregular verbs,<br/><em>learned by pattern.</em></h1><p>Group sound and spelling changes, hide forms, test your memory and keep difficult verbs in a personal review list.</p></section>
    <section className="reference-table-section"><ReferenceNav current="irregular-verbs" navigate={navigate}/><div className="reference-mode-tabs" role="tablist">{(['table','test','review'] as const).map(value=><button role="tab" aria-selected={mode===value} className={mode===value?'active':''} key={value} onClick={()=>{setMode(value);setTestIndex(0)}}>{value==='table'?'Browse & hide forms':value==='test'?'Test yourself':'My review list'}</button>)}</div>
      <div className="library-title"><div><h2>{filtered.length} essential verbs</h2><p>AAA: unchanged · ABB: past = participle · ABA: base = participle · ABC: all change</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search go, went or gone…" aria-label="Search irregular verbs"/></label></div>
      <div className="verb-tools"><label>Pattern <select value={pattern} onChange={e=>{setPattern(e.target.value);setTestIndex(0)}}>{['All','AAA','ABB','ABA','ABC'].map(v=><option key={v}>{v}</option>)}</select></label><label>Frequency <select value={tier} onChange={e=>{setTier(e.target.value);setTestIndex(0)}}>{['All','Essential','Extended'].map(v=><option key={v}>{v}</option>)}</select></label>{mode==='table'&&<><button className={hidePast?'active':''} onClick={()=>setHidePast(!hidePast)}>Hide past</button><button className={hideParticiple?'active':''} onClick={()=>setHideParticiple(!hideParticiple)}>Hide participle</button></>}</div>
      {mode==='test'?current?<section className="verb-test-card"><p className="eyebrow">Verb {testIndex%filtered.length+1} of {filtered.length} · Pattern {verbPattern(current.base,current.past,current.participle)}</p><h2>{current.base}</h2><p>Type both missing forms from memory.</p><div className="verb-test-inputs"><label>Past simple<input value={pastInput} disabled={checked} onChange={e=>setPastInput(e.target.value)}/></label><label>Past participle<input value={partInput} disabled={checked} onChange={e=>setPartInput(e.target.value)}/></label></div>{checked&&<div className={`feedback ${correct?'correct':'incorrect'}`} role="status"><strong>{correct?'✓ Correct':'Not quite yet'}</strong><p>{current.base} — {current.past} — {current.participle}</p>{examplesForVerb(current).map(example=><p key={example}>{example}</p>)}</div>}<div className="question-actions">{checked?<button className="button primary" onClick={next}>Next verb →</button>:<button className="button primary" disabled={!pastInput.trim()||!partInput.trim()} onClick={()=>setChecked(true)}>Check forms</button>}</div><ReviewControls id={keyFor('verbs',current.base)} mark={review[keyFor('verbs',current.base)]} update={update}/></section>:<div className="empty-state"><strong>No verbs found.</strong><p>Change the search or filters.</p></div>:<div className="verb-card-list">{filtered.map((v,index)=>{const key=keyFor('verbs',v.base),verbGroup=verbPattern(v.base,v.past,v.participle),examples=examplesForVerb(v);return <article className={`verb-reference-card pattern-${verbGroup.toLowerCase()}`} key={v.base}><div className="verb-card-heading"><div className="verb-identity"><span className="verb-monogram" aria-hidden="true">{v.base.slice(0,1).toUpperCase()}</span><div><span>{verbGroup} · {essentialVerbs.has(v.base)?'Essential 20':'Extended'}</span><h2>{v.base}</h2></div></div><span className="verb-card-number">{String(index+1).padStart(2,'0')}</span><button onClick={()=>speak(`${v.base}, ${v.past}, ${v.participle}. ${examples.join(' ')}`)} aria-label={`Listen to ${v.base}`}>🔊 Listen</button></div><div className="verb-forms"><p><small>Base</small><strong>{v.base}</strong></p><i aria-hidden="true">→</i><p><small>Past simple</small><strong className={hidePast?'covered':''}>{hidePast?'Hidden':v.past}</strong></p><i aria-hidden="true">→</i><p><small>Past participle</small><strong className={hideParticiple?'covered':''}>{hideParticiple?'Hidden':v.participle}</strong></p></div><p className="pronunciation">{v.pronunciation}</p><div className="verb-example-list">{examples.map(example=><blockquote key={example}>{example}</blockquote>)}</div><small>{v.note}</small><ReviewControls id={key} mark={review[key]} update={update}/></article>})}</div>}
      {!filtered.length&&mode!=='test'&&<div className="empty-state"><strong>Nothing here yet.</strong><p>{mode==='review'?'Save a verb or mark it Hard or Unsure.':'Change the search or filters.'}</p></div>}
    </section><button className="floating-back" onClick={()=>navigate('/reference')}>← All references</button></main>;
}

function GuideItemCard({guideId,item,index,mark,update}:{guideId:string;item:ReferenceItem;index:number;mark?:ReviewMark;update:(id:string,patch:Partial<ReviewMark>)=>void}){
  const [open,setOpen]=useState(false);const key=keyFor(guideId,item.id);
  const examples=[...item.examples,...(softwareGuideExamples[guideId]?.[item.id]??[])];
  return <article className="guide-item-card"><div className="guide-card-cover"><span>{String(index+1).padStart(2,'0')}</span><strong>{item.tags[0]??'Key pattern'}</strong><i aria-hidden="true">A → B</i></div><div className="guide-item-heading"><div><div className="signal-list">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div><h2>{item.title}</h2></div><button onClick={()=>setOpen(!open)} aria-expanded={open}>{open?'Collapse':'Study'}</button></div><div className="guide-pattern"><small>Pattern or key distinction</small><strong>{item.pattern}</strong></div><p>{item.explanation}</p><div className="guide-examples">{examples.map(example=><div className="speakable-example" key={example}><blockquote>{example}</blockquote><SpeechButton text={example}/></div>)}</div>{open&&<div className="guide-study">{item.mistake&&<div className="micro-mistake"><span>× {item.mistake.wrong}</span><span>✓ {item.mistake.right}</span></div>}<RecallCheck prompt={item.prompt} answer={item.answer}/></div>}<ReviewControls id={key} mark={mark} update={update}/></article>;
}

export function GeneralReferencePage({guideId,navigate}:{guideId:string;navigate:Navigate}){
  const guide=getReferenceGuide(guideId);const {review,update}=useReferenceReview();const [query,setQuery]=useState(''),[reviewOnly,setReviewOnly]=useState(false);
  if(!guide)return <main className="not-found"><h1>Reference not found.</h1><button onClick={()=>navigate('/reference')}>Return to references</button></main>;
  const filtered=guide.items.filter(item=>{const examples=[...item.examples,...(softwareGuideExamples[guide.id]?.[item.id]??[])];return [item.title,item.pattern,item.explanation,...examples,...item.tags].join(' ').toLowerCase().includes(query.toLowerCase())}).filter(item=>!reviewOnly||isReviewItem(review[keyFor(guide.id,item.id)]));
  return <main className="reference-page"><section className="reference-hero"><p className="eyebrow">{guide.category} · {guide.level}</p><h1>{guide.title},<br/><em>ready to use.</em></h1><p>{guide.description}</p></section><section className="guide-section"><ReferenceNav current={guide.id} navigate={navigate}/><div className="library-title"><div><h2>{guide.items.length} key patterns</h2><p>Meaning · Form · Natural examples · Common mistakes · Recall</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${guide.shortTitle.toLowerCase()}…`} aria-label={`Search ${guide.title}`}/></label></div><div className="guide-actions"><button className={reviewOnly?'active':''} onClick={()=>setReviewOnly(!reviewOnly)}>★ {reviewOnly?'Showing review list':'Only my review items'}</button><button onClick={()=>navigate(`/lesson/${guide.lessonId}`)}>Open related lesson →</button></div><div className="guide-grid">{filtered.map((item,index)=><GuideItemCard key={item.id} guideId={guide.id} item={item} index={index} mark={review[keyFor(guide.id,item.id)]} update={update}/>)}</div>{!filtered.length&&<div className="empty-state"><strong>Nothing here yet.</strong><p>{reviewOnly?'Save an item or mark it Hard or Unsure.':'Try a broader search.'}</p></div>}</section><button className="floating-back" onClick={()=>navigate('/reference')}>← All references</button></main>;
}

export function ReferenceReviewPage({navigate}:{navigate:Navigate}){
  const {review}=useReferenceReview();
  const entries=Object.entries(review).filter(([,mark])=>isReviewItem(mark));
  const labelFor=(key:string)=>{const [guide,item]=key.split(':');if(guide==='tenses')return tenseReferences.find(t=>t.id===item)?.name??item;if(guide==='verbs')return item;return getReferenceGuide(guide)?.items.find(i=>i.id===item)?.title??item};
  const pathFor=(key:string)=>{const guide=key.split(':')[0];return guide==='tenses'?'/reference/tenses':guide==='verbs'?'/reference/irregular-verbs':`/reference/guide/${guide}`};
  return <main className="reference-page"><section className="reference-hero"><p className="eyebrow">Personal review</p><h1>Your difficult items,<br/><em>in one focused list.</em></h1><p>Return to saved, hard and unsure language until retrieval feels easy.</p></section><section className="review-page-section"><h2>{entries.length} items to review</h2><div className="review-list">{entries.map(([key,mark])=><button key={key} onClick={()=>navigate(pathFor(key))}><span><strong>{labelFor(key)}</strong><small>{key.split(':')[0].replaceAll('-',' ')} · {mark.confidence??'saved'}</small></span><b>Review →</b></button>)}</div>{!entries.length&&<div className="empty-state"><strong>Your review list is empty.</strong><p>Save an item or mark it Hard or Unsure in any guide.</p></div>}</section><button className="floating-back" onClick={()=>navigate('/reference')}>← All references</button></main>;
}
