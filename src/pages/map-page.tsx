import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, topics, topicById } from '../entities/math-topic/model/graph';
import { MathGraph } from '../widgets/math-graph/math-graph';
import { AppLayout } from '../widgets/layout/app-layout';

export function MapPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('category') ?? 'algebra';
  const category = categories.some(
    (item) => item.id === requested && topics.some((topic) => topic.category === item.id),
  )
    ? requested
    : 'algebra';
  const [selected, setSelected] = useState<string>();
  const [focus, setFocus] = useState<{ id: string; request: number }>();
  const visibleTopics = topics.filter((topic) => topic.category === category);
  const title = categories.find((item) => item.id === category)?.title ?? 'Алгебра';
  useEffect(() => {
    document.title = title + ' — MathGraph';
  }, [title]);
  function changeCategory(id: string) {
    setParams({ category: id });
    setSelected(undefined);
    setFocus(undefined);
  }
  function findTopic(id: string) {
    const topic = topicById.get(id);
    if (!topic) return;
    setParams({ category: topic.category });
    setSelected(id);
    setFocus((current) => ({ id, request: (current?.request ?? 0) + 1 }));
  }
  return (
    <AppLayout
      category={category}
      title={title}
      count={visibleTopics.length}
      onCategory={changeCategory}
      onTopic={findTopic}
    >
      <MathGraph
        ids={visibleTopics.map((topic) => topic.id)}
        selectedId={selected}
        onSelect={setSelected}
        focus={focus}
      />
    </AppLayout>
  );
}
