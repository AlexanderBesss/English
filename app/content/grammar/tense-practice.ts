import type { Exercise, Topic } from '../../lib/types';

type Scenario = readonly [prompt:string, options:readonly string[], answer:string, tense:string];

const lessonLabels:Record<string,string[]> = {
  'tense-system':['present simple','present continuous','present perfect','present perfect continuous','past simple','past continuous','past perfect','will future','future continuous','future perfect'],
  'present-perfect':['past simple','present perfect','present perfect continuous'],
  'narrative-tenses':['past simple','past continuous','past perfect'],
  'future-forms':['will','going to','present continuous for an arrangement','future continuous','future perfect'],
};

const scenarios:Record<string,Scenario[]> = {
  'tense-system':[
    ['Marta usually ___ from home on Fridays.',['works','is working','has worked'],'works','present simple'],
    ['Please be quiet; the baby ___.',['sleeps','is sleeping','slept'],'is sleeping','present continuous'],
    ['I cannot open the door because I ___ my key.',['lose','lost','have lost'],'have lost','present perfect'],
    ['We ___ for the bus for forty minutes.',['wait','have been waiting','waited'],'have been waiting','present perfect continuous'],
    ['They ___ the museum yesterday afternoon.',['visit','have visited','visited'],'visited','past simple'],
    ['At nine last night, I ___ for the exam.',['studied','was studying','had studied'],'was studying','past continuous'],
    ['The film ___ before we reached the cinema.',['started','was starting','had started'],'had started','past perfect'],
    ['The phone is ringing. I ___ it.',['answer','am answering','will answer'],'will answer','will future'],
    ['This time tomorrow, we ___ across Poland.',['drive','will be driving','will have driven'],'will be driving','future continuous'],
    ['By next Monday, she ___ the report.',['will finish','will be finishing','will have finished'],'will have finished','future perfect'],
    ['Water ___ at 100°C.',['is boiling','boils','has boiled'],'boils','present simple'],
    ['My English ___ much better this year.',['gets','is getting','got'],'is getting','present continuous'],
    ['She ___ three emails so far today.',['writes','wrote','has written'],'has written','present perfect'],
    ['He is tired because he ___ all morning.',['runs','ran','has been running'],'has been running','present perfect continuous'],
    ['When the lights went out, we ___ dinner.',['had','were having','had had'],'were having','past continuous'],
    ['After Ana ___ the file, she sent the link.',['finished','was finishing','had finished'],'had finished','past perfect'],
    ['I think people ___ more electric cars in the future.',['buy','are buying','will buy'],'will buy','will future'],
    ['At noon, the team ___ the new system.',['will test','will be testing','will have tested'],'will be testing','future continuous'],
    ['By 2030, the city ___ two new metro lines.',['will build','will be building','will have built'],'will have built','future perfect'],
  ],
  'present-perfect':[
    ['I ___ that film last Saturday.',['have seen','saw','have been seeing'],'saw','past simple'],
    ['I ___ that film three times.',['saw','have seen','have been seeing'],'have seen','present perfect'],
    ['She ___ here since 2021.',['lived','has lived','has been living yesterday'],'has lived','present perfect'],
    ['We ___ all morning, and we need a break.',['worked yesterday','have worked once','have been working'],'have been working','present perfect continuous'],
    ['He ___ the invoice an hour ago.',['has sent','sent','has been sending'],'sent','past simple'],
    ['He ___ the invoice, so you can pay it now.',['sent last week','has sent','has been sending for hours'],'has sent','present perfect'],
    ['How many pages ___ so far?',['did you write yesterday','have you written','have you been writing pages'],'have you written','present perfect'],
    ['How long ___ on this page?',['did you work last night','have you worked it','have you been working'],'have you been working','present perfect continuous'],
    ['I ___ Maya in 2019.',['met','have met','have been meeting'],'met','past simple'],
    ['I ___ Maya for seven years.',['knew','have known','have been knowing'],'have known','present perfect'],
    ['It ___ for hours; the garden is flooded.',['rained yesterday','has rained once','has been raining'],'has been raining','present perfect continuous'],
    ['The rain ___ at six o’clock.',['has stopped','stopped','has been stopping'],'stopped','past simple'],
    ['They ___ five support requests today.',['answered yesterday','have answered','have been answering five'],'have answered','present perfect'],
    ['They ___ support requests since breakfast.',['answered last Monday','have answered three','have been answering'],'have been answering','present perfect continuous'],
    ['We ___ to Lviv twice this year.',['went in 2024','have been','have been going yesterday'],'have been','present perfect'],
    ['We ___ to Lviv during the holidays last year.',['have been','went','have been going'],'went','past simple'],
    ['She is out of breath because she ___.',['ran yesterday','has run three races','has been running'],'has been running','present perfect continuous'],
    ['She ___ three kilometres, so she has reached her goal.',['ran last week','has run','has been running three kilometres'],'has run','present perfect'],
    ['I ___ my coffee yet.',['did not finish yesterday','have not finished','have not been finishing it once'],'have not finished','present perfect'],
  ],
  'narrative-tenses':[
    ['I ___ home when the storm began.',['walked','was walking','had walked'],'was walking','past continuous'],
    ['The storm ___ without warning.',['started','was starting','had started before itself'],'started','past simple'],
    ['By the time we found shelter, our clothes ___.',['got wet','were getting wet','had become soaked'],'had become soaked','past perfect'],
    ['While Leo ___ dinner, the alarm rang.',['made','was making','had made'],'was making','past continuous'],
    ['Leo ___ the oven and ran outside.',['turned off','was turning off','had turned off before cooking'],'turned off','past simple'],
    ['He realised that he ___ his phone inside.',['left','was leaving','had left'],'had left','past perfect'],
    ['The sun ___ and birds were singing.',['shone once','was shining','had shone tomorrow'],'was shining','past continuous'],
    ['Suddenly, a car ___ beside us.',['stopped','was stopping for hours','had stopped before we arrived'],'stopped','past simple'],
    ['The driver was lost because she ___ the wrong exit.',['took','was taking','had taken'],'had taken','past perfect'],
    ['I ___ a book when someone knocked.',['read','was reading','had read it earlier'],'was reading','past continuous'],
    ['I ___ the door and saw my neighbour.',['opened','was opening all evening','had opened before the knock'],'opened','past simple'],
    ['She brought back the umbrella I ___.',['lent her','was lending her','had lent her'],'had lent her','past perfect'],
    ['As we ___ for the train, we heard an announcement.',['waited once','were waiting','had waited before arriving'],'were waiting','past continuous'],
    ['The announcer ___ that our train was cancelled.',['said','was saying for two hours','had said after we left'],'said','past simple'],
    ['We were frustrated because we ___ our tickets online.',['already bought','were buying','had already bought'],'had already bought','past perfect'],
    ['The children ___ while their parents prepared lunch.',['played once','were playing','had played tomorrow'],'were playing','past continuous'],
    ['A ball ___ the kitchen window.',['broke','was breaking repeatedly','had broken before the game'],'broke','past simple'],
    ['Nobody knew who ___ it.',['did','was doing','had done'],'had done','past perfect'],
    ['When I arrived, everyone ___ about the surprise.',['talked once','was talking','had talked next week'],'was talking','past continuous'],
  ],
  'future-forms':[
    ['I forgot my wallet. I ___ you back tomorrow.',['am paying by arrangement','am going to pay from evidence','will pay'],'will pay','will'],
    ['Look at that cyclist! He ___.',['will fall as a neutral guess','is going to fall','is falling every day'],'is going to fall','going to'],
    ['We ___ the tutor at six; it is in the calendar.',['will meet now','are meeting','will have met by six'],'are meeting','present continuous for an arrangement'],
    ['This time tomorrow, I ___ my presentation.',['will give','will be giving','will have given before then'],'will be giving','future continuous'],
    ['By the end of today, I ___ the presentation.',['will finish then','will be finishing','will have finished'],'will have finished','future perfect'],
    ['The doorbell is ringing. I ___ it.',['will answer','am going to answer from evidence','am answering every Monday'],'will answer','will'],
    ['We bought the paint yesterday; we ___ the kitchen.',['will paint spontaneously','are going to paint','will have painted already'],'are going to paint','going to'],
    ['She ___ the dentist on Thursday at ten.',['will see as a sudden decision','is seeing','will have seen before Thursday'],'is seeing','present continuous for an arrangement'],
    ['At eight tonight, they ___ the match.',['will watch once','will be watching','will have watched before eight'],'will be watching','future continuous'],
    ['By eight tonight, they ___ the whole series.',['will watch','will be watching','will have watched'],'will have watched','future perfect'],
    ['I think the new café ___ popular.',['will become','is becoming right now only','will have become yesterday'],'will become','will'],
    ['Those dark clouds mean it ___.',['will rain without evidence','is going to rain','is raining every Friday'],'is going to rain','going to'],
    ['I ___ Ana for lunch tomorrow; we booked a table.',['will meet now','am meeting','will have met yesterday'],'am meeting','present continuous for an arrangement'],
    ['Do not call at three; I ___ with a client.',['will speak','will be speaking','will have spoken before two'],'will be speaking','future continuous'],
    ['By next June, she ___ her degree.',['will complete then','will be completing','will have completed'],'will have completed','future perfect'],
    ['I promise I ___ anyone your secret.',['will not tell','am not telling every day','will not have told yesterday'],'will not tell','will'],
    ['They have saved enough money and ___ a new laptop.',['will buy spontaneously','are going to buy','will have bought last year'],'are going to buy','going to'],
    ['Our flight ___ at 07:30 tomorrow.',['is leaving','will leave as an instant choice','will have left tonight'],'is leaving','present continuous for an arrangement'],
    ['By the time you arrive, we ___ dinner.',['will cook then','will be cooking still','will have cooked'],'will have cooked','future perfect'],
  ],
};

function rotateOptions(labels:string[],answer:string,index:number) {
  const distractors=labels.filter(label=>label!==answer);
  const options=[answer,distractors[index%distractors.length],distractors[(index+3)%distractors.length]];
  const shift=index%options.length;
  return [...options.slice(shift),...options.slice(0,shift)];
}

export function expandTensePractice(topic:Topic):Topic {
  const bank=scenarios[topic.id];
  if(!bank)return topic;
  const labels=lessonLabels[topic.id];
  const additions:Exercise[]=bank.flatMap(([prompt,options,answer,tense],index)=>{
    const completed=prompt.replace('___',answer);
    const start=13+index*2;
    return [
      {id:`${topic.id}-${String(start).padStart(2,'0')}`,type:'multiple-choice',prompt:`Choose the correct form: ${prompt}`,options:[...options],answer:{values:[answer],explanation:`“${answer}” uses ${tense}, which matches the time signal and viewpoint in this sentence.`}},
      {id:`${topic.id}-${String(start+1).padStart(2,'0')}`,type:'multiple-choice',prompt:`Which tense or future form is used here? “${completed}”`,options:rotateOptions(labels,tense,index),answer:{values:[tense],explanation:`This is ${tense} because the verb phrase “${answer}” follows that form and expresses its time viewpoint.`}},
    ];
  });
  return {...topic,exercises:[...topic.exercises.slice(0,12),...additions]};
}
