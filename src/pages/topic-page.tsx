import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Alert, Button, Result, Skeleton } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import {
  categoryById,
  getNextTopics,
  getPrerequisites,
  topicById,
} from '../entities/math-topic/model/graph';
import { loadTopicContent } from '../entities/math-topic/model/repository';
import { AppLayout } from '../widgets/layout/app-layout';
import { Markdown } from '../shared/ui/markdown';
import { GeometryFigure } from '../shared/ui/geometry-figure';

export function TopicPage() {
  const { id = '' } = useParams();
  const topic = topicById.get(id);
  const navigate = useNavigate();
  const [material, setMaterial] = useState<{ id: string; content?: string; error?: string }>({
    id: '',
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    document.title = `${topic?.title ?? 'Тема не найдена'} — MathGraph`;
    if (topic)
      loadTopicContent(id)
        .then((content) => {
          if (!cancelled) setMaterial({ id, content });
        })
        .catch((error: unknown) => {
          if (!cancelled)
            setMaterial({
              id,
              error: error instanceof Error ? error.message : 'Не удалось загрузить материал',
            });
        });
    return () => {
      cancelled = true;
    };
  }, [id, topic, attempt]);
  const category = topic?.category ?? 'algebra';
  return (
    <AppLayout
      category={category}
      title={topic?.title ?? 'Тема не найдена'}
      categoryTitle={categoryById.get(topic?.category ?? 'arithmetic')?.title}
      activeTopic={id || 'missing'}
      onCategory={(selected) => navigate(`/?category=${selected}`)}
      onTopic={(selected) => navigate(`/topics/${selected}`)}
    >
      {!topic ? (
        <Result
          status="404"
          title="Тема не найдена"
          extra={<Button onClick={() => navigate('/')}>К разделам</Button>}
        />
      ) : (
        <article className="topic-article">
          <Link className="back-to-section" to={`/?category=${category}`}>
            <ArrowLeftOutlined aria-hidden />
            {categoryById.get(topic.category)?.title}
          </Link>
          <h1>{topic.title}</h1>
          {topic.figure && (
            <div className="article-figure">
              <GeometryFigure kind={topic.figure} title={topic.title} />
            </div>
          )}
          {material.id !== id ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : material.error ? (
            <Alert
              type="error"
              title={material.error}
              action={
                <Button
                  onClick={() => {
                    setMaterial({ id: '' });
                    setAttempt((current) => current + 1);
                  }}
                >
                  Повторить
                </Button>
              }
            />
          ) : (
            <Markdown content={material.content ?? ''} />
          )}
          <div className="article-relations">
            {getPrerequisites(id).length > 0 && (
              <section>
                <h2>Связанные темы</h2>
                {getPrerequisites(id).map((item) => (
                  <Link to={`/topics/${item.id}`} key={item.id}>
                    {item.title}
                    <ArrowRightOutlined aria-hidden />
                  </Link>
                ))}
              </section>
            )}
            {getNextTopics(id).length > 0 && (
              <section>
                <h2>Далее</h2>
                {getNextTopics(id).map((item) => (
                  <Link to={`/topics/${item.id}`} key={item.id}>
                    {item.title}
                    <ArrowRightOutlined aria-hidden />
                  </Link>
                ))}
              </section>
            )}
          </div>
        </article>
      )}
    </AppLayout>
  );
}
