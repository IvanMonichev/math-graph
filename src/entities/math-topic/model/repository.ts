import { topicById } from './graph';

const materials = import.meta.glob<string>('../../../../content/**/*.md', {
  query: '?raw',
  import: 'default',
});

/** Replace this adapter with fetch when a backend is introduced. */
export async function loadTopicContent(id: string): Promise<string> {
  const topic = topicById.get(id);
  if (!topic) throw new Error('Тема не найдена');
  const loader = materials[`../../../../content/${topic.category}/${id}.md`];
  if (!loader) throw new Error('Материал пока недоступен');
  return loader();
}
