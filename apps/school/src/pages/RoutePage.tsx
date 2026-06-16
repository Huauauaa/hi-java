import { PlayCircleOutlined, StarFilled } from '@ant-design/icons';
import { Button, Card, Col, Progress, Row, Space, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { SchoolLayout } from '../components/SchoolLayout';
import { chapters } from '../data/chapters';

const { Title, Paragraph, Text } = Typography;

type Props = { navigate: (path: string) => void };

const stageColors: Record<string, string> = {
  入门: 'green',
  面向对象: 'blue',
  '核心 API': 'cyan',
  并发与高级: 'purple',
  底层与架构: 'red',
};

export const RoutePage: FC<Props> = ({ navigate }) => {
  const done = Number(localStorage.getItem('java-route-done') ?? '0');

  return (
    <SchoolLayout onBack={() => navigate('/')} backLabel="返回首页">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Tag color="gold" className="mb-3">
            20 章 · MOBA 闯关
          </Tag>
          <Title level={2} className="!mb-2">
            Java 学习路线
          </Title>
          <Paragraph className="max-w-2xl text-slate-600">
            每章一题，题面以 MOBA 对战场景呈现。LeetCode 式分栏界面：左侧读题，右侧写 Java 代码并提交。
          </Paragraph>
          <div className="mt-4 max-w-md">
            <Text type="secondary" className="text-xs">
              通关进度 {done}/{chapters.length}
            </Text>
            <Progress percent={Math.round((done / chapters.length) * 100)} size="small" />
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            className="mt-4"
            onClick={() => navigate('/java-route/01')}
          >
            从第 1 章开始答题
          </Button>
        </section>

        <Row gutter={[16, 16]}>
          {chapters.map((ch) => (
            <Col xs={24} sm={12} lg={8} key={ch.id}>
              <Card
                hoverable
                className="h-full border-slate-200"
                onClick={() => navigate(`/java-route/${ch.id}`)}
                title={
                  <Space>
                    <Text type="secondary" className="font-mono text-xs">
                      {ch.id}
                    </Text>
                    {ch.title}
                  </Space>
                }
                extra={
                  <Tag color={stageColors[ch.stage] ?? 'default'}>{ch.stage}</Tag>
                }
              >
                <Space size={2}>
                  {Array.from({ length: ch.difficulty }, (_, i) => (
                    <StarFilled key={i} className="text-amber-400 text-xs" />
                  ))}
                </Space>
                <Button type="link" className="mt-2 block px-0" onClick={() => navigate(`/java-route/${ch.id}`)}>
                  开始答题 →
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </SchoolLayout>
  );
};
