import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import katex from 'katex';
import {
  edges,
  getLearningPath,
  getNextTopics,
  getPrerequisites,
  getRelatedTopics,
  searchTopics,
  topics,
} from '../../src/entities/math-topic/model/graph';

describe('knowledge graph', () => {
  it('has unique ids, valid edges and Markdown for every topic', () => {
    const ids = new Set(topics.map((topic) => topic.id));
    expect(ids.size).toBe(topics.length);
    for (const edge of edges) {
      expect(ids.has(edge.source)).toBe(true);
      expect(ids.has(edge.target)).toBe(true);
      expect(edge.source).not.toBe(edge.target);
    }
    for (const topic of topics) {
      const file = resolve('content', topic.category, `${topic.id}.md`);
      expect(existsSync(file)).toBe(true);
      expect(readFileSync(file, 'utf8')).toContain('## Определение');
      expect(() => katex.renderToString(topic.formula, { throwOnError: true })).not.toThrow();
    }
  });
  it('orders all prerequisites before their dependents, without duplicates', () => {
    for (const target of topics) {
      const path = getLearningPath(target.id);
      const ids = path.map((topic) => topic.id);
      expect(ids.at(-1)).toBe(target.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const topic of path)
        for (const prerequisite of topic.prerequisites) {
          expect(ids.indexOf(prerequisite)).toBeGreaterThanOrEqual(0);
          expect(ids.indexOf(prerequisite)).toBeLessThan(ids.indexOf(topic.id));
        }
    }
  });
  it('includes all branches needed for a quadratic equation', () => {
    expect(getLearningPath('quadratic-equations').map((topic) => topic.id)).toEqual(
      expect.arrayContaining(['fractions', 'roots', 'identities', 'linear-equations']),
    );
    expect(getLearningPath('numbers')).toEqual([topics[0]]);
  });
  it('rejects cycles and missing dependencies', () => {
    expect(() => getLearningPath('missing')).toThrow('Тема не найдена');
    expect(() =>
      getLearningPath('numbers', [{ ...topics[0], prerequisites: ['missing'] }]),
    ).toThrow('Тема не найдена');
    expect(() =>
      getLearningPath('numbers', [{ ...topics[0], prerequisites: ['numbers'] }]),
    ).toThrow('Циклическая зависимость');
  });
  it('separates prerequisites, next topics and related concepts', () => {
    expect(getPrerequisites('polynomial').map((topic) => topic.id)).toEqual(['monomial']);
    expect(getNextTopics('polynomial').map((topic) => topic.id)).toEqual([
      'identities',
      'factorization',
      'equations',
    ]);
    expect(getRelatedTopics('factorization').map((topic) => topic.id)).toEqual([
      'identities',
      'quadratic-equations',
    ]);
    expect(getPrerequisites('unknown')).toEqual([]);
  });
  it('finds Russian titles regardless of case, whitespace and ё', () => {
    expect(searchTopics('  МНОГОЧЛЕНЫ  ')[0].id).toBe('polynomial');
    expect(searchTopics('сокращенного')[0].id).toBe('identities');
    expect(searchTopics('абракадабра')).toEqual([]);
    expect(searchTopics(' ')).toEqual([]);
  });
});
