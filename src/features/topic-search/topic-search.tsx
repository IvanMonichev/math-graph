import { useEffect, useRef, useState } from 'react';
import { AutoComplete, Input } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { categoryById, searchTopics } from '../../entities/math-topic/model/graph';

export function TopicSearch({ onSelect }: { onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const input = useRef<InputRef>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const options = searchTopics(query)
    .slice(0, 10)
    .map((topic) => ({
      value: topic.id,
      label: (
        <div className="search-result">
          <span>{topic.title}</span>
          <small>{categoryById.get(topic.category)?.title}</small>
        </div>
      ),
    }));
  return (
    <AutoComplete
      className="topic-search"
      value={query}
      options={options}
      onChange={setQuery}
      notFoundContent={query.trim() ? 'Темы не найдены' : null}
      onSelect={(id) => {
        onSelect(id);
        setQuery('');
        input.current?.blur();
      }}
    >
      <Input
        ref={input}
        aria-label="Поиск по темам"
        placeholder="Поиск по темам"
        prefix={<SearchOutlined aria-hidden />}
        suffix={<kbd>Ctrl K</kbd>}
      />
    </AutoComplete>
  );
}
