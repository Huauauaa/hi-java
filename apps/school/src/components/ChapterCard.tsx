import { CheckCircleOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { FC } from 'react';
import type { Chapter } from '../data/chapters';
import type { QuizStatus } from '../lib/quizProgress';

const stageColors: Record<string, string> = {
  入门: 'green',
  面向对象: 'blue',
  '核心 API': 'cyan',
  并发与高级: 'purple',
  底层与架构: 'red',
  'MOBA 整合': 'gold',
  'MOBA 综合': 'volcano',
};

const statusMeta: Record<QuizStatus, { label: string; color: string; action: string; className: string; icon: FC }> = {
  doing: {
    label: '进行中',
    color: 'processing',
    action: '继续答题',
    className: 'chapter-card--doing',
    icon: EditOutlined,
  },
  done: {
    label: '已完成',
    color: 'success',
    action: '查看代码',
    className: 'chapter-card--done',
    icon: CheckCircleOutlined,
  },
  todo: {
    label: '未开始',
    color: 'default',
    action: '开始答题',
    className: '',
    icon: PlayCircleOutlined,
  },
};

type CardProps = {
  chapter: Chapter;
  status: QuizStatus;
  onOpen: (id: string) => void;
};

export const ChapterCard: FC<CardProps> = ({ chapter, status, onOpen }) => {
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <article
      className={`chapter-card ${meta.className}`}
      onClick={() => onOpen(chapter.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(chapter.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className="chapter-card__watermark" aria-hidden>
        {chapter.num}
      </span>
      <div className="chapter-card__head">
        <div>
          <span className="chapter-card__id">CHAPTER {chapter.id}</span>
          <h3 className="chapter-card__title">{chapter.title}</h3>
        </div>
        <div className="chapter-card__tags">
          <Tag color={meta.color}>{meta.label}</Tag>
          <Tag color={stageColors[chapter.stage] ?? 'default'}>{chapter.stage}</Tag>
        </div>
      </div>
      <div className="chapter-card__foot">
        <span className="inline-flex items-center gap-1.5">
          <Icon />
          {meta.action}
        </span>
        <span className="font-mono text-xs text-[var(--ink-muted)]">Lv.{chapter.difficulty}</span>
      </div>
    </article>
  );
};
