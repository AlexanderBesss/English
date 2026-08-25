export type ReferenceLevel = 'B1+' | 'B2';

export interface ReferenceItem {
  id: string;
  title: string;
  pattern: string;
  explanation: string;
  examples: string[];
  mistake?: { wrong: string; right: string };
  tags: string[];
  prompt: string;
  answer: string;
}

export interface ReferenceGuide {
  id: string;
  title: string;
  shortTitle: string;
  category: 'Grammar' | 'Verb systems' | 'Vocabulary' | 'Writing & speaking';
  level: ReferenceLevel;
  description: string;
  lessonId: string;
  items: ReferenceItem[];
}

const item=(id:string,title:string,pattern:string,explanation:string,examples:string[],tags:string[],prompt:string,answer:string,wrong?:string,right?:string):ReferenceItem=>({
  id,title,pattern,explanation,examples,tags,prompt,answer,...(wrong&&right?{mistake:{wrong,right}}:{})
});

export const referenceGuides: ReferenceGuide[] = [
  { id:'conditionals',title:'Conditionals and wishes',shortTitle:'Conditionals',category:'Grammar',level:'B2',lessonId:'conditionals',description:'Connect real and imagined situations with their results, then express wishes and regrets accurately.',items:[
    item('zero-first','Zero and first conditional','if + present, present / will + base','Use zero for general results and first for a realistic future possibility.',['If you heat ice, it melts.','If it rains tomorrow, we’ll stay inside.'],['real','future','if'], 'Complete: If she calls, I ___ her the news.','will tell','If she will call, I tell her.','If she calls, I’ll tell her.'),
    item('second','Second conditional','if + past, would + base','Use it for an unreal or unlikely present or future situation.',['If I had more time, I would learn Italian.'],['unreal','present','future'],'Complete: If I ___ you, I would apologise.','were','If I would be you, I apologised.','If I were you, I would apologise.'),
    item('third','Third conditional','if + past perfect, would have + participle','Use it to imagine a different result of an unreal past event.',['If we had left earlier, we would have caught the train.'],['unreal','past','regret'],'Complete: She would have passed if she ___ harder.','had studied','If she would have studied, she passed.','If she had studied, she would have passed.'),
    item('mixed','Mixed conditional','if + past perfect, would + base','Connect an unreal past cause with its present result.',['If I had taken that job, I would live abroad now.'],['mixed','past','present'],'Complete: If he had slept, he ___ so tired now.','would not be'),
    item('wishes','Wishes and regrets','wish + past / past perfect','Use a past form for a present wish and past perfect for a past regret.',['I wish I knew the answer.','I wish I had asked more questions.'],['wish','regret'],'Complete: I wish I ___ that message yesterday.','had not sent','I wish I did not send it yesterday.','I wish I had not sent it yesterday.')
  ]},
  { id:'modals',title:'Modal verbs',shortTitle:'Modals',category:'Grammar',level:'B1+',lessonId:'modal-verbs',description:'Express probability, deduction, advice, permission and different kinds of obligation.',items:[
    item('deduction-now','Present deduction','must / might / can’t + base','Use must for a strong conclusion, might for possibility and can’t for an impossible conclusion.',['She must be at work.','They might know the answer.','That can’t be true.'],['deduction','probability'],'Complete: The lights are off. They ___ be home.','can’t'),
    item('deduction-past','Past deduction','modal + have + participle','Look back and judge what probably, possibly or impossibly happened.',['He must have forgotten.','She might have taken the earlier train.'],['past','deduction'],'Complete: I’m not sure, but Lee ___ have missed the bus.','might'),
    item('obligation','Obligation and necessity','must / have to / don’t have to / mustn’t','Mustn’t means prohibited; don’t have to means unnecessary.',['You mustn’t park here.','You don’t have to come early.'],['rules','obligation'],'Which phrase means “it is not necessary”?','don’t have to','You mustn’t attend if you are busy.','You don’t have to attend if you are busy.'),
    item('advice','Advice and criticism','should + base / should have + participle','Use should have for a better past action that did not happen.',['You should rest.','You should have called me.'],['advice','past'],'Complete: We ___ have booked earlier.','should')
  ]},
  { id:'articles',title:'Articles, quantifiers and countability',shortTitle:'Articles & quantity',category:'Grammar',level:'B1+',lessonId:'articles-quantifiers',description:'Choose noun markers by identifiability, countability and amount.',items:[
    item('a-the-zero','A, the and zero article','a/an = one new item · the = identifiable · Ø = general','First decide whether the listener can identify the noun, then decide whether you mean one example or a whole class.',['I saw a film. The film was excellent.','Life is unpredictable.'],['articles','nouns'],'Complete: I bought ___ book you recommended.','the'),
    item('countability','Countable and uncountable nouns','a few / many + countable · a little / much + uncountable','Learn nouns such as advice, information and research as uncountable.',['a few suggestions','a little advice','some useful information'],['countability','quantifiers'],'Complete: She gave me some useful ___.','advice','She gave me an advice.','She gave me some advice.'),
    item('few-little','Few versus a few','few/little = almost none · a few/a little = some','The article changes the speaker’s attitude to the amount.',['We have few options left.','We still have a few options.'],['quantity','meaning'],'Which means “some, enough to be useful”?','a few')
  ]},
  { id:'verb-patterns',title:'Gerunds, infinitives and verb patterns',shortTitle:'Verb patterns',category:'Grammar',level:'B1+',lessonId:'gerunds-infinitives',description:'Learn which form follows a verb and how a change of pattern can change meaning.',items:[
    item('ing','Verbs followed by -ing','avoid / admit / consider / enjoy + -ing','Store the verb together with its complement pattern.',['She admitted deleting the message.','We considered moving abroad.'],['gerund','-ing'],'Complete: He avoided ___ the question.','answering'),
    item('to','Verbs followed by to-infinitive','agree / decide / hope / manage + to + verb','The to-infinitive commonly points to an intended or managed action.',['They decided to wait.','She managed to finish.'],['infinitive','to'],'Complete: We agreed ___ at six.','to meet'),
    item('meaning-change','Patterns that change meaning','remember/stop/try + -ing or to-infinitive','Compare remember doing (memory) with remember to do (required action), and stop doing with stop to do.',['I remembered locking the door.','I remembered to lock the door.'],['meaning','contrast'],'Complete: He paused his walk to answer: He stopped ___.','to answer')
  ]},
  { id:'passive',title:'Passive and causative forms',shortTitle:'Passive & causative',category:'Grammar',level:'B1+',lessonId:'passive-causative',description:'Control information focus and describe services performed by another person.',items:[
    item('passive','Passive voice','be + past participle','Choose the tense on be; keep the main verb as a past participle.',['The bridge will be opened next spring.','The email has been sent.'],['passive','focus'],'Change to passive: Someone has stolen my bike.','My bike has been stolen.'),
    item('causative','Have or get something done','have/get + object + past participle','Use this when you arrange for another person to perform a service.',['We had the kitchen painted.','I’m getting my phone repaired.'],['causative','services'],'Rewrite: A technician repaired my laptop for me.','I had my laptop repaired.','I repaired my laptop by a technician.','I had my laptop repaired.')
  ]},
  { id:'reported',title:'Reported speech',shortTitle:'Reported speech',category:'Grammar',level:'B1+',lessonId:'reported-speech',description:'Shift tense, person, place and time from the reporter’s current viewpoint.',items:[
    item('statements','Reported statements','say (that) … / tell someone (that) …','Backshift when the reporting viewpoint changes; keep a tense when a fact remains clearly current.',['Maya said that she had finished.','He told me that the shop was closed.'],['backshift','say','tell'],'Report: “I finished yesterday,” Maya said.','Maya said that she had finished the day before.'),
    item('questions','Reported questions','ask + if/whether or question word + statement order','Remove do/does/did and use statement word order.',['She asked where I lived.','He asked whether I was ready.'],['questions','word order'],'Report: “Where do you live?”','She asked where I lived.','She asked where did I live.','She asked where I lived.'),
    item('commands','Reported commands','tell/ask + object + (not) to-infinitive','Use an object after tell and ask.',['Leo told me not to wait.','She asked us to sit down.'],['commands','infinitive'],'Report: “Please don’t leave.”','She asked me not to leave.')
  ]},
  { id:'phrasal-verbs',title:'Core phrasal verbs',shortTitle:'Phrasal verbs',category:'Verb systems',level:'B1+',lessonId:'phrasal-verbs',description:'Learn meaning, separability and a natural object as one reusable chunk.',items:[
    item('put-off','put off','postpone · separable','A pronoun must go between the verb and particle.',['We put the meeting off.','We put it off until Friday.'],['separable','plans'],'Replace “postponed”: They postponed the launch.','They put the launch off.','They put off it.','They put it off.'),
    item('work-out','work out','solve, calculate or understand · separable','Context determines whether it means exercise or reach a solution.',['I finally worked out the answer.','We need to work out the total cost.'],['separable','solution'],'Complete: Can you ___ out why it failed?','work'),
    item('look-after','look after','take care of · inseparable','Keep the object after the whole phrasal verb.',['Could you look after my cat?'],['inseparable','care'],'Replace “take care of”: She takes care of her nephew.','She looks after her nephew.'),
    item('turn-up','turn up','arrive or increase · inseparable when it means arrive','Learn the meaning together with a typical subject or object.',['He turned up twenty minutes late.','Could you turn the music up?'],['arrival','separable'],'Complete: Nobody expected Ana, but she ___ up.','turned')
  ]},
  { id:'prepositions',title:'Dependent prepositions',shortTitle:'Prepositions',category:'Verb systems',level:'B1+',lessonId:'dependent-prepositions',description:'Store verbs and adjectives with the preposition they select.',items:[
    item('verb-on','Verb + on','depend on · insist on · concentrate on','Learn the entire chunk rather than translating the preposition.',['The result depends on several factors.','He insisted on paying.'],['verb','on'],'Complete: Success depends ___ preparation.','on'),
    item('verb-for','Verb + for','apply for · apologise for · pay for','Some verbs take a person before the preposition: apologise to someone for something.',['She applied for the role.','He apologised to us for arriving late.'],['verb','for'],'Complete: Who paid ___ dinner?','for'),
    item('adjectives','Adjective + preposition','interested in · responsible for · proud of','Record adjective-preposition combinations with a following noun or -ing form.',['She is responsible for training new staff.','I’m interested in learning more.'],['adjective','chunks'],'Complete: They are proud ___ their progress.','of')
  ]},
  { id:'collocations',title:'Collocations that sound natural',shortTitle:'Collocations',category:'Vocabulary',level:'B1+',lessonId:'collocations',description:'Build fluency through conventional word partnerships rather than isolated synonyms.',items:[
    item('adjective-noun','Adjective + noun','heavy rain · strong coffee · serious problem','A synonym can be grammatically correct but still sound unnatural with a particular noun.',['Heavy rain caused delays.','We face a serious problem.'],['adjectives','nouns'],'Complete: ___ rain is expected tonight.','Heavy'),
    item('verb-noun','Verb + noun','make a decision · take responsibility · raise awareness','Treat the whole partnership as one vocabulary item.',['We need to make a decision.','The campaign raised awareness.'],['verbs','nouns'],'Complete: Who will ___ responsibility?','take'),
    item('adverb-adjective','Adverb + adjective','highly unlikely · deeply concerned · closely related','Degree adverbs have preferred adjective partners.',['The two issues are closely related.','That outcome is highly unlikely.'],['adverbs','adjectives'],'Make natural: very unlikely','highly unlikely')
  ]},
  { id:'confused-words',title:'Commonly confused words',shortTitle:'Confused words',category:'Vocabulary',level:'B1+',lessonId:'confusing-words',description:'Compare near-synonyms by grammar, register and viewpoint.',items:[
    item('say-tell','say vs tell','say something · tell someone something','Tell normally needs a person; say does not take the person directly.',['She said that she was tired.','She told me the truth.'],['reporting','grammar'],'Correct: I said her the truth.','I told her the truth.'),
    item('remember-remind','remember vs remind','remember something · remind someone to do','Remember happens in your own mind; remind causes another person to remember.',['I remembered the appointment.','Please remind me to call.'],['memory','verbs'],'Complete: Please ___ me to send the invoice.','remind'),
    item('affect-effect','affect vs effect','affect = verb · effect = noun','In common usage, affect is the action and effect is its result.',['The delay affected everyone.','The change had a positive effect.'],['word class','meaning'],'Complete: What effect did the policy ___?','have'),
    item('job-work','job vs work','job = countable role · work = uncountable activity','Use a job/jobs with an article or number; do not normally say a work.',['She found a new job.','I have a lot of work today.'],['countability','work'],'Complete: I’m looking for ___ new job.','a')
  ]},
  { id:'word-formation',title:'Word formation',shortTitle:'Word formation',category:'Vocabulary',level:'B1+',lessonId:'word-formation',description:'Use sentence grammar to select a word class, then build the correct member of a word family.',items:[
    item('noun-suffixes','Noun suffixes','-tion · -ment · -ity · -ness','Check whether the gap needs a person, thing, process or quality.',['decide → decision','reliable → reliability','develop → development'],['suffixes','nouns'],'Form the noun: reliable','reliability'),
    item('adjective-suffixes','Adjective suffixes','-able · -ive · -al · -ful/-less','Adjectives describe nouns or follow linking verbs such as be and seem.',['convince → convincing','use → useful/useless','environment → environmental'],['suffixes','adjectives'],'Form an adjective: benefit','beneficial'),
    item('prefixes','Negative and reversing prefixes','un- · in-/im- · dis- · mis-','Prefixes usually change meaning without changing word class.',['likely → unlikely','possible → impossible','understand → misunderstand'],['prefixes','opposites'],'Form the opposite: accurate','inaccurate')
  ]},
  { id:'phrase-bank',title:'Writing and speaking phrase bank',shortTitle:'Phrase bank',category:'Writing & speaking',level:'B2',lessonId:'speaking-purpose',description:'Reusable, register-aware language for emails, essays and thoughtful discussion.',items:[
    item('formal-email','Formal email moves','I am writing to… · I would be grateful if… · I look forward to…','State the purpose early, make one specific polite request and end with the next step.',['I am writing to enquire about the course.','I would be grateful if you could confirm the date.'],['formal','email'],'Make polite: Send me the details.','Could you please send me the details?'),
    item('argument','Developing an argument','One reason is… · For example… · This suggests that…','Move from claim to reason, evidence and consequence.',['One reason is that the change would reduce costs.','This suggests that a trial period would be useful.'],['essay','argument'],'Introduce an example formally.','For example, …'),
    item('contrast','Contrast and concession','while · whereas · although · despite','Although takes a clause; despite takes a noun phrase or -ing form.',['Although it is expensive, it is reliable.','Despite the cost, it is popular.'],['linking','contrast'],'Complete: ___ the high cost, demand increased.','Despite'),
    item('discussion','Polite discussion','I see your point, but… · From my point of view… · What I mean is…','Acknowledge another view before disagreeing and use repair phrases to keep your turn clear.',['I see your point, but I’m not sure it would work.','What I mean is that we need more evidence.'],['speaking','polite','repair'],'Disagree politely: That idea will not work.','I see your point, but I’m not sure that idea would work.'),
    item('comparison','Comparing options','Compared with… · while X…, Y… · the main advantage is…','Compare options on the same criterion, such as cost, speed or flexibility.',['While the train is faster, cycling is cheaper.','Compared with option A, option B is more flexible.'],['speaking','comparison'],'Compare a fast train with cheap cycling.','While the train is faster, cycling is cheaper.')
  ]}
];

export const getReferenceGuide=(id:string)=>referenceGuides.find(guide=>guide.id===id);

