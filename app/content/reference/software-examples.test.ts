import { describe, expect, it } from 'vitest';
import { tenseComparisons, tenseReferences } from '../grammar/tenses';
import { irregularVerbs } from '../verbs/irregulars';
import { referenceGuides } from './guides';
import { softwareGuideExamples, softwareTenseComparisonExamples, softwareTenseExamples, softwareVerbExamples } from './software-examples';

describe('software engineering reference examples', () => {
  it('covers every tense and comparison choice', () => {
    for (const tense of tenseReferences) {
      expect(softwareTenseExamples[tense.id]?.length, tense.name).toBeGreaterThan(0);
    }

    for (const comparison of tenseComparisons) {
      expect(softwareTenseComparisonExamples[comparison.id]?.length, comparison.title).toBe(comparison.choices.length);
    }
  });

  it('covers every item in every general reference guide', () => {
    for (const guide of referenceGuides) {
      for (const item of guide.items) {
        expect(softwareGuideExamples[guide.id]?.[item.id]?.length, `${guide.id}:${item.id}`).toBeGreaterThan(0);
      }
    }
  });

  it('covers every irregular verb', () => {
    for (const verb of irregularVerbs) {
      expect(softwareVerbExamples[verb.base]?.length, verb.base).toBeGreaterThan(0);
    }
  });
});
