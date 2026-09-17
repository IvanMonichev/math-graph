import { categories, edges, topics } from '../../../../data/math-graph';
import type { MathTopic } from './types';

export { categories, edges, topics };
export const topicById = new Map(topics.map((topic) => [topic.id, topic]));
export const categoryById = new Map(categories.map((category) => [category.id, category]));

export function getPrerequisites(topicId: string): MathTopic[] {
  return (topicById.get(topicId)?.prerequisites ?? []).flatMap((id) => topicById.get(id) ?? []);
}

export function getNextTopics(topicId: string): MathTopic[] {
  return topics.filter((topic) => topic.prerequisites.includes(topicId));
}

export function getRelatedTopics(topicId: string): MathTopic[] {
  const ids = new Set(
    edges
      .filter(
        (edge) =>
          edge.type !== 'prerequisite' && (edge.source === topicId || edge.target === topicId),
      )
      .map((edge) => (edge.source === topicId ? edge.target : edge.source)),
  );
  return topics.filter((topic) => ids.has(topic.id));
}

/** Topological order of every ancestor, followed by the target. Shared ancestors appear once. */
export function getLearningPath(
  topicId: string,
  source: readonly MathTopic[] = topics,
): MathTopic[] {
  const index = new Map(source.map((topic) => [topic.id, topic]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const result: MathTopic[] = [];
  function visit(id: string) {
    if (visiting.has(id)) throw new Error(`Циклическая зависимость: ${id}`);
    if (visited.has(id)) return;
    const topic = index.get(id);
    if (!topic) throw new Error(`Тема не найдена: ${id}`);
    visiting.add(id);
    topic.prerequisites.forEach(visit);
    visiting.delete(id);
    visited.add(id);
    result.push(topic);
  }
  visit(topicId);
  return result;
}

export function searchTopics(query: string): MathTopic[] {
  const normalized = query.trim().toLocaleLowerCase('ru').replaceAll('ё', 'е');
  if (!normalized) return [];
  return topics
    .filter((topic) =>
      `${topic.title} ${topic.description}`
        .toLocaleLowerCase('ru')
        .replaceAll('ё', 'е')
        .includes(normalized),
    )
    .sort(
      (a, b) =>
        Number(b.title.toLocaleLowerCase('ru').includes(normalized)) -
        Number(a.title.toLocaleLowerCase('ru').includes(normalized)),
    );
}
