export interface TenseReference {
  id: string;
  name: string;
  time: 'Present' | 'Past' | 'Future';
  form: string;
  use: string;
  signalWords: string[];
  examples: string[];
}

export const tenseReferences: TenseReference[] = [
  { id:'present-simple', name:'Present simple', time:'Present', form:'subject + base verb / verb-s', use:'Routines, repeated actions, facts and permanent situations.', signalWords:['usually','every day','often'], examples:['I walk to work most days.','The library closes at six.'] },
  { id:'present-continuous', name:'Present continuous', time:'Present', form:'subject + am/is/are + verb-ing', use:'Actions happening now, temporary situations and changing trends.', signalWords:['now','at the moment','this week'], examples:['She is talking to a client now.','More people are working from home.'] },
  { id:'present-perfect', name:'Present perfect', time:'Present', form:'subject + have/has + past participle', use:'Past actions connected to now, life experience and unfinished time periods.', signalWords:['already','yet','ever','since'], examples:['I have finished the report.','Have you ever visited Edinburgh?'] },
  { id:'present-perfect-continuous', name:'Present perfect continuous', time:'Present', form:'subject + have/has been + verb-ing', use:'An activity continuing until now or a recent activity with a visible result.', signalWords:['for','since','all morning'], examples:['We have been waiting for an hour.','It has been raining, so the streets are wet.'] },
  { id:'past-simple', name:'Past simple', time:'Past', form:'subject + past form', use:'Completed actions and sequences at a finished time in the past.', signalWords:['yesterday','last week','in 2024'], examples:['They moved here last year.','I opened the door and switched on the light.'] },
  { id:'past-continuous', name:'Past continuous', time:'Past', form:'subject + was/were + verb-ing', use:'An action in progress at a past moment, often the background to another event.', signalWords:['while','at five o’clock','when'], examples:['I was cooking when you called.','At eight, they were still travelling.'] },
  { id:'past-perfect', name:'Past perfect', time:'Past', form:'subject + had + past participle', use:'An action completed before another past action or point.', signalWords:['before','after','by the time'], examples:['The train had left before we arrived.','She was nervous because she had not flown before.'] },
  { id:'past-perfect-continuous', name:'Past perfect continuous', time:'Past', form:'subject + had been + verb-ing', use:'The duration or cause of an activity continuing up to a past point.', signalWords:['for','since','before'], examples:['They had been driving for hours when they stopped.','He was tired because he had been studying.'] },
  { id:'future-simple', name:'Future simple', time:'Future', form:'subject + will + base verb', use:'Predictions, spontaneous decisions, promises and offers.', signalWords:['probably','I think','tomorrow'], examples:['I think the plan will work.','I’ll carry that bag for you.'] },
  { id:'future-continuous', name:'Future continuous', time:'Future', form:'subject + will be + verb-ing', use:'An action that will be in progress at a specific future time.', signalWords:['this time tomorrow','at noon'], examples:['This time tomorrow, we will be flying to Rome.','Will you be using the car tonight?'] },
  { id:'future-perfect', name:'Future perfect', time:'Future', form:'subject + will have + past participle', use:'An action that will be complete before a future point.', signalWords:['by','by the time','before'], examples:['By Friday, I will have completed the course.','They will have left before we get there.'] },
  { id:'future-perfect-continuous', name:'Future perfect continuous', time:'Future', form:'subject + will have been + verb-ing', use:'The duration of an activity continuing up to a future point.', signalWords:['for','by','by the time'], examples:['In June, she will have been teaching here for ten years.','By noon, we will have been travelling for six hours.'] },
];
