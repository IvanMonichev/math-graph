import { useState } from 'react';
import type { ReactNode } from 'react';
import { Breadcrumb, Button, Drawer } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { TopicSearch } from '../../features/topic-search/topic-search';
import { Sidebar } from '../sidebar/sidebar';

interface Props {
  category: string;
  title: string;
  count?: number;
  activeTopic?: string;
  categoryTitle?: string;
  onCategory: (id: string) => void;
  onTopic: (id: string) => void;
  children: ReactNode;
}

export function AppLayout({
  category,
  title,
  count,
  activeTopic,
  categoryTitle,
  onCategory,
  onTopic,
  children,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const openTopic = (id: string) => {
    navigate(`/topics/${id}`);
    setMobileOpen(false);
  };
  return (
    <div className="app-shell">
      <div className="desktop-sidebar">
        <Sidebar
          category={category}
          activeTopic={activeTopic}
          onCategory={onCategory}
          onTopic={openTopic}
        />
      </div>
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        size={260}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <Sidebar
          category={category}
          activeTopic={activeTopic}
          onTopic={openTopic}
          onCategory={(id) => {
            onCategory(id);
            setMobileOpen(false);
          }}
        />
      </Drawer>
      <main className="workspace">
        <header className="topbar">
          <Button
            className="mobile-menu"
            type="text"
            icon={<MenuOutlined aria-hidden />}
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть разделы"
          />
          {activeTopic ? (
            <Breadcrumb
              className="topic-breadcrumbs"
              items={[
                { title: <Link to="/">Математика</Link> },
                { title: <Link to={`/?category=${category}`}>{categoryTitle}</Link> },
                { title },
              ]}
            />
          ) : (
            <div className="map-heading">
              <h1>{title}</h1>
              <span>{count} тем</span>
            </div>
          )}
          <TopicSearch onSelect={onTopic} />
        </header>
        <div className={activeTopic ? 'article-workspace' : 'graph-workspace'} key={activeTopic}>
          {children}
        </div>
      </main>
    </div>
  );
}
