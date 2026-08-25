import { describe,expect,it } from 'vitest';
import { topics } from '../content';
import { isCorrect, validateTopics } from '../content/shared';
import { completionPercent, EMPTY_PROGRESS, loadProgress, recordScore, toggleBookmark } from './progress';
import { filterTopics } from './search';
import { referenceGuides } from '../content/reference/guides';
import { tenseComparisons, tenseReferences } from '../content/grammar/tenses';

describe('course content',()=>{
 it('contains the complete 30-topic path',()=>expect(topics).toHaveLength(30));
 it('validates unique and complete exercise banks',()=>{
  expect(()=>validateTopics(topics)).not.toThrow();
  expect(topics.every(topic=>topic.exercises.length>=12)).toBe(true);
  expect(new Set(topics.flatMap(topic=>topic.exercises.map(e=>e.id))).size).toBe(512);
 });
 it('contains every planned category',()=>expect(new Set(topics.map(t=>t.category)).size).toBe(7));
 it('gives every tense-path question selectable options',()=>{
  const tenseIds=['tense-system','present-perfect','narrative-tenses','future-forms'];
  const tenseTopics=topics.filter(topic=>tenseIds.includes(topic.id));
  const tenseExercises=tenseTopics.flatMap(topic=>topic.exercises);
  expect(tenseTopics.every(topic=>topic.exercises.length===50)).toBe(true);
  expect(tenseExercises).toHaveLength(200);
  expect(tenseExercises.every(exercise=>exercise.options?.length&&exercise.options.includes(exercise.answer.values[0]))).toBe(true);
 });
});

describe('scoring and normalisation',()=>{
 it('ignores case and terminal punctuation',()=>{
  expect(isCorrect('  I HAVE LIVED here for six years! ',['I have lived here for six years.'])).toBe(true);
 });
 it('does not accept a different form',()=>expect(isCorrect('wrote',['written'])).toBe(false));
});

describe('progress storage',()=>{
 it('falls back safely for invalid or old data',()=>{
  expect(loadProgress('{broken')).toEqual(EMPTY_PROGRESS);
  expect(loadProgress(JSON.stringify({version:0,topics:{}}))).toEqual(EMPTY_PROGRESS);
 });
 it('records attempts, best score and completion',()=>{
  const first=recordScore(EMPTY_PROGRESS,'present-perfect',65);
  const second=recordScore(first,'present-perfect',80);
  const third=recordScore(second,'present-perfect',70);
  expect(third.topics['present-perfect']).toMatchObject({attempts:3,bestScore:80,completed:true});
  expect(completionPercent(third,30)).toBe(3);
 });
 it('toggles bookmarks without losing scores',()=>{
  const scored=recordScore(EMPTY_PROGRESS,'conditionals',90);
  const saved=toggleBookmark(scored,'conditionals');
  expect(saved.topics.conditionals).toMatchObject({bestScore:90,bookmarked:true});
 });
});

describe('topic filtering',()=>{
 it('searches title, summary and keywords',()=>expect(filterTopics(topics,EMPTY_PROGRESS,'mixed conditionals','all','all','all').map(t=>t.id)).toContain('conditionals'));
 it('combines category and level filters',()=>{
  const result=filterTopics(topics,EMPTY_PROGRESS,'','grammar','B2','all');
  expect(result.length).toBeGreaterThan(0);
  expect(result.every(t=>t.category==='grammar'&&t.level==='B2')).toBe(true);
 });
 it('filters completion and bookmarks',()=>{
  const progress=toggleBookmark(recordScore(EMPTY_PROGRESS,'present-perfect',90),'present-perfect');
  expect(filterTopics(topics,progress,'','all','all','complete').map(t=>t.id)).toEqual(['present-perfect']);
  expect(filterTopics(topics,progress,'','all','all','bookmarked').map(t=>t.id)).toEqual(['present-perfect']);
 });
});

describe('reference learning system',()=>{
 it('covers the planned reference library with unique routes',()=>{
  expect(referenceGuides.length).toBeGreaterThanOrEqual(12);
  expect(new Set(referenceGuides.map(guide=>guide.id)).size).toBe(referenceGuides.length);
  expect(referenceGuides.every(guide=>guide.items.length>=2)).toBe(true);
 });
 it('enriches every tense with contrast, production and error support',()=>{
  expect(tenseReferences).toHaveLength(12);
  expect(tenseReferences.every(tense=>tense.negative&&tense.question&&tense.viewpoint&&tense.contrast&&tense.mistake.right)).toBe(true);
  expect(tenseComparisons).toHaveLength(6);
 });
 it('gives every reference item an active recall prompt',()=>{
  expect(referenceGuides.flatMap(guide=>guide.items).every(item=>item.prompt&&item.answer&&item.examples.length)).toBe(true);
 });
});
