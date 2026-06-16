import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import App from './App';
import './index.css';

gsap.registerPlugin(useGSAP);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ffa116',
          colorLink: '#ffb84d',
          colorBgBase: '#0d1017',
          colorBgContainer: '#1a2030',
          colorBorder: '#2a3140',
          colorText: '#e8eaed',
          colorTextSecondary: '#8b929a',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          borderRadius: 10,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
