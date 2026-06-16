import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
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
        token: {
          colorPrimary: '#c8790a',
          colorLink: '#9a5a05',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          borderRadius: 10,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
