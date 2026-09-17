import { useEffect, useState } from 'react';
import { Tree } from 'antd';
import type { Key } from 'react';
import { categories, topics, topicById } from '../../entities/math-topic/model/graph';

interface Props {
  category: string;
  activeTopic?: string;
  onCategory: (id: string) => void;
  onTopic: (id: string) => void;
}

export function Sidebar({ category, activeTopic, onCategory, onTopic }: Props) {
  const [expanded, setExpanded] = useState<Key[]>(['section:' + category]);
  useEffect(() => {
    if (category !== 'all')
      setExpanded((current) =>
        current.includes('section:' + category) ? current : [...current, 'section:' + category],
      );
  }, [category, activeTopic]);
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onCategory('algebra')} aria-label="MathGraph">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
        <span>MathGraph</span>
      </button>
      <div className="sidebar-label">Разделы</div>
      <nav aria-label="Разделы математики">
        <Tree
          className="section-tree"
          blockNode
          showIcon
          switcherIcon={() => null}
          expandedKeys={expanded}
          selectedKeys={[activeTopic ?? 'section:' + category]}
          onExpand={(keys) => setExpanded(keys)}
          onSelect={(_, info) => {
            const key = String(info.node.key);
            if (topicById.has(key)) onTopic(key);
            else if (key.startsWith('section:')) {
              setExpanded((current) =>
                current.includes(key) && key === 'section:' + category
                  ? current.filter((item) => item !== key)
                  : [...new Set([...current, key])],
              );
              if (activeTopic || key !== 'section:' + category) onCategory(key.slice(8));
            }
          }}
          treeData={categories.map((item) => {
            const members = topics.filter((topic) => topic.category === item.id);
            return {
              key: 'section:' + item.id,
              disabled: !members.length,
              icon: (
                <span className="category-symbol" aria-hidden>
                  {item.symbol}
                </span>
              ),
              title: (
                <span className="menu-label">
                  {item.title}
                  <span>{members.length || '—'}</span>
                </span>
              ),
              children: members.map((topic) => ({
                key: topic.id,
                title: topic.title,
                isLeaf: true,
              })),
            };
          })}
        />
      </nav>
      <div className="sidebar-footer">
        <span>MathGraph</span>
        <span>v{__APP_VERSION__}</span>
      </div>
    </aside>
  );
}
