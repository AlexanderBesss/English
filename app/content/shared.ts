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
    { id: `${seed.id}-02`, type: 'gap-fill', prompt: `Complete the sentence: ${seed.gap}`, options: gapChoices, answer: { values: [seed.gapAnswer], explanation: seed.gapWhy ?? `The missing language is “${seed.gapAnswer}”. ${explanation}` } },
    { id: `${seed.id}-03`, type: 'error-correction', prompt: `Which option corrects this mistake? ${seed.wrong}`, options: [seed.wrong,seed.correct,seed.transformAnswer], answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-04`, type: 'multiple-choice', prompt: `Which rule should guide your use of ${seed.title.toLowerCase()}?`, options: [seed.focus,'Translate every word directly.','Choose the longest available form.'], answer: { values: [seed.focus], explanation } },
    { id: `${seed.id}-05`, type: 'transformation', prompt: seed.transform, options: [seed.correct,seed.wrong,seed.transformAnswer], answer: { values: [seed.transformAnswer], explanation: seed.transformWhy ?? `“${seed.transformAnswer}” expresses the requested meaning with the target form.` } },
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
  const prompts = new Set<string>();
  for (const topic of topics) {
    if (topicIds.has(topic.id)) throw new Error(`Duplicate topic id: ${topic.id}`);
    topicIds.add(topic.id);
    if (!topic.title || !topic.summary || topic.objectives.length < 3) throw new Error(`Incomplete topic: ${topic.id}`);
    if (topic.exercises.length < 5) throw new Error(`Topic ${topic.id} needs at least 5 exercises`);
    for (const exercise of topic.exercises) {
      if (!exercise.id.startsWith(`${topic.id}-`)) throw new Error(`Exercise ${exercise.id} belongs to the wrong topic: ${topic.id}`);
      if (exerciseIds.has(exercise.id)) throw new Error(`Duplicate exercise id: ${exercise.id}`);
      exerciseIds.add(exercise.id);
      const promptKey = normalise(exercise.prompt);
      if (prompts.has(promptKey)) throw new Error(`Duplicate exercise prompt: ${exercise.prompt}`);
      prompts.add(promptKey);
      if (!exercise.answer.values.length || !exercise.answer.explanation) throw new Error(`Invalid answer: ${exercise.id}`);
      if (!exercise.options?.length || !exercise.options.includes(exercise.answer.values[0])) {
        throw new Error(`Selectable answer missing from options: ${exercise.id}`);
      }
    }
  }
  return topics;
}
