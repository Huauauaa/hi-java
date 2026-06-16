import { CheckCircleOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import type { FC } from 'react';
import type { Chapter } from '../data/chapters';
import type { QuizStatus } from '../lib/quizProgress';

const { Text } = Typography;

const stageColors: Record<string, string> = {
  入门: 'green',
  面向对象: 'blue',
  '核心 API': 'cyan',
  并发与高级: 'purple',
  底层与架构: 'red',
};

const statusMeta: Record<
  QuizStatus,
  { label: string; color: string; action: string; border: string }
> = {
  doing: {
    label: '进行中',
    color: 'processing',
    action: '继续答题 →',
    border: 'border-blue-300 ring-1 ring-blue-100',
  },
  done: {
    label: '已完成',
    color: 'success',
    action: '查看代码 →',
    border: 'border-green-200',
  },
  todo: {
    label: '未开始',
    color: 'default',
    action: '开始答题 →',
    border: 'border-slate-200',
  },
};

type CardProps = {
  chapter: Chapter;
  status: QuizStatus;
  onOpen: (id: string) => void;
};

export const ChapterCard: FC<CardProps> = ({ chapter, status, onOpen }) => {
  const meta = statusMeta[status];
  return (
    <Card
      hoverable
      className={`h-full shadow-sm ${meta.border}`}
      onClick={() => onOpen(chapter.id)}
      title={
        <Space>
          <Text type="secondary" className="font-mono text-xs">
            {chapter.id}
          </Text>
          {chapter.title}
        </Space>
      }
      extra={
        <Space size={4}>
          <Tag color={meta.color}>{meta.label}</Tag>
          <Tag color={stageColors[chapter.stage] ?? 'default'}>{chapter.stage}</Tag>
        </Space>
      }
    >
      <Button
        type="link"
        className="mt-1 block px-0"
        icon={
          status === 'done' ? (
            <CheckCircleOutlined />
          ) : status === 'doing' ? (
            <EditOutlined />
          ) : (
            <PlayCircleOutlined />
          )
        }
        onClick={() => onOpen(chapter.id)}
      >
        {meta.action}
      </Button>
    </Card>
  );
};
