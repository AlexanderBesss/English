import type { Exercise, Topic, TopicSeed } from '../lib/types';

const normalise = (value: string) => value.toLowerCase().trim().replace(/[“”‘’]/g, "'").replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');

export function isCorrect(input: string, answers: string[]) {
  return answers.some((answer) => normalise(answer) === normalise(input));
}

export function createExercises(seed: TopicSeed): Exercise[] {
  const explanation = seed.answerWhy ?? `This checks the central idea: ${seed.focus}`;
  const gapChoices = seed.gapChoices ?? [seed.gapAnswer, seed.answer, seed.correct];
  const correctExplanation = seed.mistakeWhy ?? `“${seed.correct}” applies the target pattern accurately because ${seed.focus.charAt(0).toLowerCase()}${seed.focus.slice(1)}`;
  return [
    { id: `${seed.id}-01`, type: 'multiple-choice', prompt: seed.question, options: seed.choices, answer: { values: [seed.answer], explanation } },
    { id: `${seed.id}-02`, type: 'multiple-choice', prompt: `Which sentence uses ${seed.title.toLowerCase()} accurately?`, options: [seed.wrong,seed.correct,seed.transformAnswer], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-03`, type: 'gap-fill', prompt: `Complete the sentence: ${seed.gap}`, options: gapChoices, answer: { values: [seed.gapAnswer], explanation: seed.gapWhy ?? `The missing language is “${seed.gapAnswer}”. ${explanation}` } },
    { id: `${seed.id}-04`, type: 'error-correction', prompt: `Fix this ${seed.title.toLowerCase()} mistake: ${seed.wrong}`, options: [seed.wrong,seed.correct,seed.transformAnswer], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-05`, type: 'ordering', prompt: `Build the ${seed.title.toLowerCase()} example with the correct word order.`, options: [seed.transformAnswer,seed.wrong,seed.correct], tokens: seed.correct.replace(/[.!?]/g, '').split(' ').sort((a,b) => a.localeCompare(b)), answer: { values: [seed.correct], explanation: 'The word order follows the pattern shown in the lesson.' } },
    { id: `${seed.id}-06`, type: 'transformation', prompt: seed.transform, options: [seed.correct,seed.wrong,seed.transformAnswer], answer: { values: [seed.transformAnswer], explanation: seed.transformWhy ?? `“${seed.transformAnswer}” expresses the requested meaning with the target form.` } },
    { id: `${seed.id}-07`, type: 'short-answer', prompt: `Choose the key missing form: ${seed.gap}`, options: [gapChoices[1],gapChoices[0],gapChoices[2]], answer: { values: [seed.gapAnswer], explanation: seed.gapWhy ?? `“${seed.gapAnswer}” completes the meaning and form.` } },
    { id: `${seed.id}-08`, type: 'multiple-choice', prompt: `Which version should you avoid when using ${seed.title.toLowerCase()}?`, options: [seed.correct, seed.wrong], answer: { values: [seed.wrong], explanation: seed.mistakeWhy ?? `Avoid “${seed.wrong}” because it does not follow the target pattern: ${seed.focus}` } },
    { id: `${seed.id}-09`, type: 'gap-fill', prompt: `Choose the best answer: ${seed.question}`, options: seed.choices, answer: { values: [seed.answer], explanation } },
    { id: `${seed.id}-10`, type: 'matching', prompt: `Choose the example that demonstrates ${seed.title.toLowerCase()}: ${seed.focus}`, options: [seed.wrong,seed.correct,seed.transformAnswer], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-11`, type: 'multiple-choice', prompt: `Choose the most accurate explanation of ${seed.title.toLowerCase()}.`, options: ['The forms are always interchangeable.',seed.focus,'Only the final word determines the meaning.'], answer: { values: [seed.focus], explanation } },
    { id: `${seed.id}-12`, type: 'transformation', prompt: `Choose the accurate ${seed.title.toLowerCase()} rewrite: ${seed.wrong}`, options: [seed.transformAnswer,seed.correct,seed.wrong], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-13`, type: 'multiple-choice', prompt: `Which rule should guide your use of ${seed.title.toLowerCase()}?`, options: [seed.focus,'Translate every word directly.','Choose the longest available form.'], answer: { values: [seed.focus], explanation } },
    { id: `${seed.id}-14`, type: 'multiple-choice', prompt: `Choose the natural ${seed.title.toLowerCase()} example.`, options: [seed.transformAnswer,seed.wrong,seed.correct], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-15`, type: 'error-correction', prompt: `Correct the form in this sentence: ${seed.wrong}`, options: [seed.wrong,seed.correct,seed.transformAnswer], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-16`, type: 'transformation', prompt: `Apply ${seed.title.toLowerCase()}: ${seed.transform}`, options: [seed.correct,seed.wrong,seed.transformAnswer], answer: { values: [seed.transformAnswer], explanation: seed.transformWhy ?? `“${seed.transformAnswer}” expresses the requested meaning with the lesson pattern.` } },
    { id: `${seed.id}-17`, type: 'ordering', prompt: `Rebuild this second ${seed.title.toLowerCase()} model.`, tokens: seed.transformAnswer.replace(/[.!?]/g, '').split(' ').sort((a,b)=>a.localeCompare(b)), answer: { values: [seed.transformAnswer], explanation: `The completed sentence applies ${seed.title.toLowerCase()} with accurate word order.` } },
    { id: `${seed.id}-18`, type: 'gap-fill', prompt: `Recall the missing form without looking back: ${seed.gap}`, options: [...gapChoices].reverse(), answer: { values: [seed.gapAnswer], explanation: seed.gapWhy ?? `“${seed.gapAnswer}” completes the target pattern.` } },
    { id: `${seed.id}-19`, type: 'multiple-choice', prompt: `Answer this ${seed.title.toLowerCase()} check in a new round: ${seed.question}`, options: [...seed.choices].reverse(), answer: { values: [seed.answer], explanation } },
    { id: `${seed.id}-20`, type: 'matching', prompt: `Which sentence matches this meaning and rule? ${seed.summary}`, options: [seed.wrong,seed.transformAnswer,seed.correct], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-21`, type: 'short-answer', prompt: `Choose the missing word or phrase: ${seed.gap}`, options: [gapChoices[1],gapChoices[2],gapChoices[0]], answer: { values: [seed.gapAnswer], explanation: seed.gapWhy ?? `The required form is “${seed.gapAnswer}”.` } },
    { id: `${seed.id}-22`, type: 'multiple-choice', prompt: `Which sentence contains the ${seed.title.toLowerCase()} error?`, options: [seed.transformAnswer,seed.correct,seed.wrong], answer: { values: [seed.wrong], explanation: seed.mistakeWhy ?? `“${seed.wrong}” conflicts with the lesson rule: ${seed.focus}` } },
    { id: `${seed.id}-23`, type: 'transformation', prompt: `Choose the complete corrected sentence: ${seed.wrong}`, options: [seed.wrong,seed.transformAnswer,seed.correct], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-24`, type: 'ordering', prompt: `Build the lesson's main natural example from memory.`, tokens: seed.correct.replace(/[.!?]/g, '').split(' ').reverse(), answer: { values: [seed.correct], explanation: `The sentence uses ${seed.title.toLowerCase()} accurately and naturally.` } },
  ];
}

export function createTopic(seed: TopicSeed): Topic {
  return {
    ...seed,
    level: seed.level ?? 'B1+',
    minutes: seed.minutes ?? 18,
    objectives: [
      { id: `${seed.id}-objective-1`, text: `Understand when to use ${seed.title.toLowerCase()}.` },
      { id: `${seed.id}-objective-2`, text: 'Recognise and correct a frequent B1-level mistake.' },
      { id: `${seed.id}-objective-3`, text: 'Use the target language in a natural, meaningful response.' },
    ],
    sections: [
      { id: `${seed.id}-idea`, title: 'The key idea', body: seed.focus },
      { id: `${seed.id}-meaning`, title: 'Meaning before form', body: seed.summary, examples: [
        { label: 'Natural English', sentence: seed.correct, note: 'Notice how the form supports the intended meaning.' },
        { label: 'Another useful pattern', sentence: seed.transformAnswer, note: 'The same idea appears in a different context.' },
      ] },
    ],
    mistake: { wrong: seed.wrong, right: seed.correct, explanation: `Compare the intended meaning with the form. ${seed.focus}` },
    exercises: createExercises(seed),
    production: {
      prompt: `Create a short real-life response that demonstrates ${seed.title.toLowerCase()}. Use at least two target forms.`,
      model: `${seed.correct} ${seed.transformAnswer}`,
      checklist: ['I expressed a clear meaning.', 'I used at least two target forms.', 'I checked word order and punctuation.', 'My answer sounds natural when read aloud.'],
    },
  };
}

export function validateTopics(topics: Topic[]) {
  const topicIds = new Set<string>();
  const exerciseIds = new Set<string>();
  for (const topic of topics) {
    if (topicIds.has(topic.id)) throw new Error(`Duplicate topic id: ${topic.id}`);
    topicIds.add(topic.id);
    if (!topic.title || !topic.summary || topic.objectives.length < 3) throw new Error(`Incomplete topic: ${topic.id}`);
    if (topic.exercises.length < 24) throw new Error(`Topic ${topic.id} needs at least 24 exercises`);
    for (const exercise of topic.exercises) {
      if (!exercise.id.startsWith(`${topic.id}-`)) throw new Error(`Exercise ${exercise.id} belongs to the wrong topic: ${topic.id}`);
      if (exerciseIds.has(exercise.id)) throw new Error(`Duplicate exercise id: ${exercise.id}`);
      exerciseIds.add(exercise.id);
      if (!exercise.answer.values.length || !exercise.answer.explanation) throw new Error(`Invalid answer: ${exercise.id}`);
      if (exercise.type === 'ordering') {
        if (!exercise.tokens?.length) throw new Error(`Ordering exercise has no tokens: ${exercise.id}`);
      } else if (!exercise.options?.length || !exercise.options.includes(exercise.answer.values[0])) {
        throw new Error(`Selectable answer missing from options: ${exercise.id}`);
      }
    }
  }
  return topics;
}
