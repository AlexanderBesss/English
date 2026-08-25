import { grammarTopics } from './grammar';
import { verbTopics } from './verbs';
import { vocabularyTopics } from './vocabulary';
import { readingTopics } from './reading';
import { writingTopics } from './writing';
import { listeningTopics } from './listening';
import { speakingTopics } from './speaking';
import { validateTopics } from './shared';
import type { CategoryId } from '../lib/types';

export const topics = validateTopics([
  ...grammarTopics, ...verbTopics, ...vocabularyTopics, ...readingTopics,
  ...writingTopics, ...listeningTopics, ...speakingTopics,
]);

export const categoryInfo: Record<CategoryId, { name:string; note:string; colour:string }> = {
  grammar:{ name:'Grammar & tenses', note:'Build precision', colour:'coral' },
  verbs:{ name:'Verb systems', note:'Sound natural', colour:'blue' },
  vocabulary:{ name:'Vocabulary', note:'Say more', colour:'green' },
  reading:{ name:'Reading', note:'Read strategically', colour:'gold' },
  writing:{ name:'Writing', note:'Shape ideas', colour:'coral' },
  listening:{ name:'Listening', note:'Hear intention', colour:'blue' },
  speaking:{ name:'Speaking', note:'Speak with purpose', colour:'green' },
};

export const categoryOrder = Object.keys(categoryInfo) as CategoryId[];
export const getTopic = (id:string) => topics.find((topic) => topic.id === id);

