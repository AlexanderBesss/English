import type { CategoryId, ProgressState, Topic } from './types';
import { topicProgress } from './progress';
export type TopicStatus='all'|'open'|'complete'|'bookmarked';
export function filterTopics(list:Topic[],progress:ProgressState,query:string,category:'all'|CategoryId,level:'all'|'B1+'|'B2',status:TopicStatus){
 const term=query.trim().toLowerCase();
 return list.filter(topic=>{
  const text=[topic.title,topic.summary,...topic.keywords].join(' ').toLowerCase();
  const p=topicProgress(progress,topic.id);
  const statusMatch=status==='all'||(status==='complete'&&p.completed)||(status==='open'&&!p.completed)||(status==='bookmarked'&&p.bookmarked);
  return (!term||text.includes(term))&&(category==='all'||topic.category===category)&&(level==='all'||topic.level===level)&&statusMatch;
 });
}

