import {
  ArrowLeftOutlined,
  GithubOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Button, Layout, Space, Typography } from 'antd';
import type { FC, ReactNode } from 'react';

const { Header } = Layout;
const { Title, Text } = Typography;

type Props = {
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  extra?: ReactNode;
  dark?: boolean;
};

const docsOrigin = import.meta.env.PROD
  ? 'https://huauauaa.github.io/hi-java'
  : 'http://localhost:1313/hi-java';

const docsUrl = `${docsOrigin}/`;

export const SchoolLayout: FC<Props> = ({
  children,
  onBack,
  backLabel = '返回首页',
  extra,
  dark = false,
}) => (
  <Layout className={`min-h-screen ${dark ? 'bg-[#1a1a1a]' : 'bg-slate-50'}`}>
    <Header
      className={`flex items-center justify-between px-4 ${
        dark ? 'border-b border-[#3a3a3a] bg-[#282828]' : 'border-b border-slate-200 bg-white'
      }`}
    >
      <Space align="center">
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className={dark ? '!text-[#eff1f6]' : undefined}
          >
            {backLabel}
          </Button>
        )}
        {!dark && (
          <>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ReadOutlined />
            </div>
            <div>
              <Title level={5} className="!mb-0">
                School
              </Title>
              <Text type="secondary" className="text-xs">
                hi-java 学习门户
              </Text>
            </div>
          </>
        )}
      </Space>
      <Space>
        {extra}
        <Button
          type="link"
          href={docsUrl}
          target="_blank"
          rel="noreferrer"
          className={dark ? '!text-[#ffa116]' : undefined}
        >
          Java 文档
        </Button>
        <Button
          type="primary"
          icon={<GithubOutlined />}
          href="https://github.com/Huauauaa/hi-java"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Button>
      </Space>
    </Header>
    {children}
  </Layout>
);
