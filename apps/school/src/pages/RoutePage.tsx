import { PlayCircleOutlined } from '@ant-design/icons';
import { Button, Col, Progress, Row, Typography } from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChapterCard } from '../components/ChapterCard';
import { SchoolLayout } from '../components/SchoolLayout';
import { chapters } from '../data/chapters';
import { loadProgressMap, statusOf, type QuizRecord } from '../lib/quizProgress';

const { Title, Text } = Typography;

type Props = { navigate: (path: string) => void };

export const RoutePage: FC<Props> = ({ navigate }) => {
  const [progress, setProgress] = useState(() => new Map<string, QuizRecord>());
  const [ready, setReady] = useState(false);

  const reload = useCallback(() => {
    loadProgressMap()
      .then(setProgress)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    reload();
    const onVis = () => document.visibilityState === 'visible' && reload();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [reload]);

  const doneCount = useMemo(
    () => chapters.filter((ch) => statusOf(ch.id, progress) === 'done').length,
    [progress],
  );

  const hasDoing = useMemo(
    () => chapters.some((ch) => statusOf(ch.id, progress) === 'doing'),
    [progress],
  );

  const firstOpen = useMemo(() => {
    const doing = chapters.find((ch) => statusOf(ch.id, progress) === 'doing');
    if (doing) return doing.id;
    const todo = chapters.find((ch) => statusOf(ch.id, progress) === 'todo');
    return todo?.id ?? '01';
  }, [progress]);

  return (
    <SchoolLayout onBack={() => navigate('/')} backLabel="返回首页">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Title level={2} className="!mb-2">
            Java 学习路线
          </Title>
          <div className="mt-4 max-w-md">
            <Text type="secondary" className="text-xs">
              通关进度 {doneCount}/{chapters.length}
            </Text>
            <Progress
              percent={ready ? Math.round((doneCount / chapters.length) * 100) : 0}
              size="small"
            />
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            className="mt-4"
            onClick={() => navigate(`/java-route/${firstOpen}`)}
          >
            {hasDoing ? '继续答题' : '从第 1 章开始答题'}
          </Button>
        </section>

        <Row gutter={[16, 16]}>
          {chapters.map((ch) => (
            <Col xs={24} sm={12} lg={8} key={ch.id}>
              <ChapterCard
                chapter={ch}
                status={statusOf(ch.id, progress)}
                onOpen={(id) => navigate(`/java-route/${id}`)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </SchoolLayout>
  );
};
