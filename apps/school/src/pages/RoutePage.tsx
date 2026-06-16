import { PlayCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChapterCard } from '../components/ChapterCard';
import { SchoolLayout } from '../components/SchoolLayout';
import { chapters } from '../data/chapters';
import { loadProgressMap, statusOf, type QuizRecord } from '../lib/quizProgress';

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

  const doneCount = useMemo(() => chapters.filter((ch) => statusOf(ch.id, progress) === 'done').length, [progress]);

  const doingCount = useMemo(() => chapters.filter((ch) => statusOf(ch.id, progress) === 'doing').length, [progress]);

  const hasDoing = doingCount > 0;

  const firstOpen = useMemo(() => {
    const doing = chapters.find((ch) => statusOf(ch.id, progress) === 'doing');
    if (doing) return doing.id;
    const todo = chapters.find((ch) => statusOf(ch.id, progress) === 'todo');
    return todo?.id ?? '01';
  }, [progress]);

  const percent = ready ? Math.round((doneCount / chapters.length) * 100) : 0;

  return (
    <SchoolLayout onBack={() => navigate('/')} backLabel="返回首页">
      <div className="school-page mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="route-hero mb-10">
          <p className="hero-eyebrow !mb-2">Java Route · 20 Chapters</p>
          <h1 className="section-heading">Java 学习路线</h1>
          <p className="section-sub mt-2 max-w-2xl">
            按章节推进 MOBA 场景练习。完成一关解锁下一关，进度保存在本地浏览器。
          </p>

          <div className="route-hero__stats">
            <div className="route-stat">
              <span className="route-stat__label">已通关</span>
              <span className="route-stat__value">{ready ? doneCount : '—'}</span>
            </div>
            <div className="route-stat">
              <span className="route-stat__label">进行中</span>
              <span className="route-stat__value">{ready ? doingCount : '—'}</span>
            </div>
            <div className="route-stat">
              <span className="route-stat__label">总章节</span>
              <span className="route-stat__value">{chapters.length}</span>
            </div>
          </div>

          <div className="route-progress">
            <div className="route-progress__track" aria-hidden>
              <div className="route-progress__fill" style={{ width: `${percent}%` }} />
            </div>
            <div className="route-progress__meta">
              <span>通关进度</span>
              <span>
                {ready ? `${doneCount}/${chapters.length}` : '加载中…'} · {percent}%
              </span>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            className="mt-5 !shadow-[0_10px_24px_-14px_rgba(200,121,10,0.9)]"
            onClick={() => navigate(`/java-route/${firstOpen}`)}
          >
            {hasDoing ? '继续答题' : '从第 1 章开始答题'}
          </Button>
        </section>

        <div className="mb-5">
          <h2 className="section-heading text-[1.35rem]">章节列表</h2>
          <p className="section-sub">点击卡片进入对应练习</p>
        </div>

        <div className="chapter-grid">
          {chapters.map((ch) => (
            <ChapterCard
              key={ch.id}
              chapter={ch}
              status={statusOf(ch.id, progress)}
              onOpen={(id) => navigate(`/java-route/${id}`)}
            />
          ))}
        </div>
      </div>
    </SchoolLayout>
  );
};
