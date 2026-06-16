import { ArrowLeftOutlined, GithubOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Layout, Space } from 'antd';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';

const { Header } = Layout;

type Props = {
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  extra?: ReactNode;
  compact?: boolean;
};

const docsOrigin = import.meta.env.PROD ? 'https://huauauaa.github.io/hi-java' : 'http://localhost:1313/hi-java';

const docsUrl = `${docsOrigin}/`;

export const SchoolLayout: FC<Props> = ({ children, onBack, backLabel = '返回首页', extra, compact = false }) => {
  const shellRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (compact || prefersReducedMotion()) return;
      gsap.from('.school-header', {
        y: -16,
        opacity: 0,
        duration: 0.55,
        ease: 'power3.out',
      });
    },
    { scope: shellRef, dependencies: [compact] },
  );

  return (
    <Layout ref={shellRef} className="school-shell min-h-screen">
      <Header className="school-header flex items-center justify-between px-4 md:px-6">
        <Space align="center">
          {onBack && (
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} className="!text-[var(--ink)]">
              {backLabel}
            </Button>
          )}
          {!compact && (
            <a
              href="#/"
              className="school-brand-mark flex h-9 w-9 items-center justify-center rounded-xl text-white no-underline"
              aria-label="返回首页"
            >
              <ReadOutlined />
            </a>
          )}
        </Space>
        <Space wrap>
          {extra}
          <Button type="link" href={docsUrl} target="_blank" rel="noreferrer" className="!text-[var(--amber)]">
            Java 文档
          </Button>
          <Button
            type="primary"
            icon={<GithubOutlined />}
            href="https://github.com/Huauauaa/hi-java"
            target="_blank"
            rel="noreferrer"
            className="!shadow-[0_10px_24px_-14px_rgba(255,161,22,0.45)]"
          >
            GitHub
          </Button>
        </Space>
      </Header>
      {children}
    </Layout>
  );
};
