import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import ruRU from 'antd/locale/ru_RU';
const MapPage = lazy(() =>
  import('../pages/map-page').then((module) => ({ default: module.MapPage })),
);
const TopicPage = lazy(() =>
  import('../pages/topic-page').then((module) => ({ default: module.TopicPage })),
);

export function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#262626',
          colorInfo: '#262626',
          colorSuccess: '#454545',
          colorText: '#262626',
          colorTextSecondary: '#828282',
          colorBorder: '#e2e2e2',
          borderRadius: 7,
          controlHeight: 36,
          fontSize: 14,
          fontFamily: "'YS Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          boxShadow: '0 4px 20px rgba(0,0,0,.05)',
        },
        components: {
          Button: { primaryShadow: 'none', fontWeight: 500 },
          Select: { optionSelectedBg: '#f0f0f0' },
          Breadcrumb: { fontSize: 12 },
        },
      }}
    >
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="app-loading">
              <Spin size="large" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="topics/:id" element={<TopicPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}
