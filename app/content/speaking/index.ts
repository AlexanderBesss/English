import { createTopic } from '../shared';

export const speakingTopics = [
  createTopic({ id:'speaking-purpose', title:'Comparing and defending opinions', category:'speaking', summary:'Strong B2 speaking compares ideas directly, develops reasons and responds to another view without sounding aggressive.', keywords:['speaking','comparison','opinions'], focus:'Compare on shared criteria, qualify strong claims and support your position with a reason or example.', correct:'While the train is faster, cycling would be cheaper and more flexible.', wrong:'The train is best and everyone who disagrees is wrong.', question:'Which phrase introduces a respectful counterargument?', choices:['I see your point, but…','You clearly do not understand.','Anyway, I am right.'], answer:'I see your point, but…', gap:'From my point of ___, flexibility matters most.', gapAnswer:'view', transform:'Disagree politely: That idea will not work.', transformAnswer:'I see your point, but I am not sure that idea would work.' }),
];

