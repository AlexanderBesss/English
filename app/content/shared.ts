import type { Exercise, Topic, TopicSeed } from '../lib/types';

const normalise = (value: string) => value.toLowerCase().trim().replace(/[“”‘’]/g, "'").replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');

export function isCorrect(input: string, answers: string[]) {
  return answers.some((answer) => normalise(answer) === normalise(input));
}

export function createExercises(seed: TopicSeed): Exercise[] {
  const explanation = `This checks the central idea: ${seed.focus}`;
  const shuffled = [seed.correct, seed.wrong, seed.transformAnswer];
  const correctExplanation = `“${seed.correct}” applies the target pattern accurately.`;
  return [
    { id: `${seed.id}-01`, type: 'multiple-choice', prompt: seed.question, options: seed.choices, answer: { values: [seed.answer], explanation } },
    { id: `${seed.id}-02`, type: 'multiple-choice', prompt: 'Which sentence uses the target language accurately?', options: shuffled, answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-03`, type: 'gap-fill', prompt: `Complete the sentence: ${seed.gap}`, answer: { values: [seed.gapAnswer], explanation: `The missing language is “${seed.gapAnswer}”. ${explanation}` } },
    { id: `${seed.id}-04`, type: 'error-correction', prompt: `Correct the sentence: ${seed.wrong}`, answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-05`, type: 'ordering', prompt: 'Put the words in the correct order.', tokens: seed.correct.replace(/[.!?]/g, '').split(' ').sort((a,b) => a.localeCompare(b)), answer: { values: [seed.correct], explanation: 'The word order follows the pattern shown in the lesson.' } },
    { id: `${seed.id}-06`, type: 'transformation', prompt: seed.transform, answer: { values: [seed.transformAnswer], explanation: `A strong transformation is: “${seed.transformAnswer}”` } },
    { id: `${seed.id}-07`, type: 'short-answer', prompt: `Write the key missing form only: ${seed.gap}`, answer: { values: [seed.gapAnswer], explanation: `“${seed.gapAnswer}” completes the meaning and form.` } },
    { id: `${seed.id}-08`, type: 'multiple-choice', prompt: 'Which version should you avoid?', options: [seed.correct, seed.wrong], answer: { values: [seed.wrong], explanation: `Avoid “${seed.wrong}”; it contains the common mistake highlighted in this lesson.` } },
    { id: `${seed.id}-09`, type: 'gap-fill', prompt: `Complete with the best answer: ${seed.question}`, answer: { values: [seed.answer], explanation } },
    { id: `${seed.id}-10`, type: 'matching', prompt: `Match the lesson idea to its best example. Type the complete example for: ${seed.focus}`, options: shuffled, answer: { values: [seed.correct], explanation: correctExplanation } },
    { id: `${seed.id}-11`, type: 'multiple-choice', prompt: 'Choose the most accurate explanation.', options: [seed.focus, 'The forms are always interchangeable.', 'Only the final word determines the meaning.'], answer: { values: [seed.focus], explanation } },
    { id: `${seed.id}-12`, type: 'transformation', prompt: `Rewrite accurately: ${seed.wrong}`, answer: { values: [seed.correct], explanation: correctExplanation } },
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
    if (topic.exercises.length < 12) throw new Error(`Topic ${topic.id} needs at least 12 exercises`);
    for (const exercise of topic.exercises) {
      if (exerciseIds.has(exercise.id)) throw new Error(`Duplicate exercise id: ${exercise.id}`);
      exerciseIds.add(exercise.id);
      if (!exercise.answer.values.length || !exercise.answer.explanation) throw new Error(`Invalid answer: ${exercise.id}`);
      if (exercise.type === 'multiple-choice' && !exercise.options?.includes(exercise.answer.values[0])) throw new Error(`Answer not in options: ${exercise.id}`);
    }
  }
  return topics;
}

