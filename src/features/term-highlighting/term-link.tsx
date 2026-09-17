import type { ReactNode } from 'react';
import { Popover } from 'antd';
import { Link } from 'react-router-dom';
import { topicById } from '../../entities/math-topic/model/graph';

export function TermLink({ href, children }: { href?: string; children: ReactNode }) {
  const topic = href?.startsWith('/topics/')
    ? topicById.get(href.slice('/topics/'.length))
    : undefined;
  if (!topic)
    return href?.startsWith('/') ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href}>{children}</a>
    );
  return (
    <Popover
      title={topic.title}
      content={<p className="term-definition">{topic.description}</p>}
      trigger={['hover', 'focus']}
      mouseEnterDelay={0.2}
    >
      <Link className="term-link" to={`/topics/${topic.id}`}>
        {children}
      </Link>
    </Popover>
  );
}
