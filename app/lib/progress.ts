import type { ProgressState, TopicProgress } from './types';
export const STORAGE_KEY = 'fluent-path-progress';
export const EMPTY_TOPIC: TopicProgress = { completed:false, bestScore:0, attempts:0, bookmarked:false };
export const EMPTY_PROGRESS: ProgressState = { version:1, topics:{} };

export function loadProgress(raw: string | null): ProgressState {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && parsed.topics && typeof parsed.topics === 'object') return parsed as ProgressState;
  } catch {}
  return EMPTY_PROGRESS;
}
export function topicProgress(state:ProgressState,id:string):TopicProgress {
  return state.topics[id] ?? EMPTY_TOPIC;
}
export function recordScore(state:ProgressState,id:string,score:number):ProgressState {
  const current=topicProgress(state,id);
  return { ...state, lastOpened:id, topics:{...state.topics,[id]:{...current,attempts:current.attempts+1,bestScore:Math.max(current.bestScore,score),completed:score>=70||current.completed}}};
}
export function toggleBookmark(state:ProgressState,id:string):ProgressState {
  const current=topicProgress(state,id);
  return {...state,topics:{...state.topics,[id]:{...current,bookmarked:!current.bookmarked}}};
}
export function completionPercent(state:ProgressState,total:number) {
  if(!total)return 0;
  return Math.round(Object.values(state.topics).filter((p)=>p.completed).length/total*100);
}

