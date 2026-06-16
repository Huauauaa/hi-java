import {
  CaretLeftOutlined,
  CaretRightOutlined,
  CloudUploadOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Space, Tabs, Tag, Typography, message } from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { SchoolLayout } from '../components/SchoolLayout';
import { getChapter } from '../data/chapters';
import { getAdjacentChapter, getQuiz } from '../data/quizzes';

const { Title, Paragraph, Text } = Typography;

type Props = {
  chapterId: string;
  navigate: (path: string) => void;
};

const diffColor = { Easy: 'green', Medium: 'orange', Hard: 'red' } as const;

function markDone(chapterId: string) {
  const key = 'java-route-done-ids';
  const raw = localStorage.getItem(key);
  const ids = new Set<string>(raw ? JSON.parse(raw) : []);
  ids.add(chapterId);
  localStorage.setItem(key, JSON.stringify([...ids]));
  localStorage.setItem('java-route-done', String(ids.size));
}

export const QuizPage: FC<Props> = ({ chapterId, navigate }) => {
  const chapter = getChapter(chapterId);
  const quiz = getQuiz(chapterId);
  const adj = getAdjacentChapter(chapterId);

  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ pass: boolean; message: string } | null>(null);
  const [bottomTab, setBottomTab] = useState('testcase');

  useEffect(() => {
    if (quiz) setCode(quiz.starterCode);
    setResult(null);
    setBottomTab('testcase');
  }, [chapterId, quiz]);

  const runCheck = useCallback(
    (submit: boolean) => {
      if (!quiz) return;
      const r = quiz.validate(code);
      setResult(r);
      setBottomTab('result');
      if (r.pass) {
        markDone(chapterId);
        message.success(submit ? '提交成功！' : '运行通过');
      } else {
        message.error(r.message);
      }
    },
    [code, quiz, chapterId],
  );

  if (!chapter || !quiz) {
    return (
      <SchoolLayout onBack={() => navigate('/java-route')} dark>
        <div className="flex flex-1 items-center justify-center text-[#eff1f6]">
          章节不存在
        </div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout
      dark
      onBack={() => navigate('/java-route')}
      backLabel="题目列表"
      extra={
        <Space>
          <Button
            type="text"
            icon={<CaretLeftOutlined />}
            disabled={!adj.prev}
            onClick={() => adj.prev && navigate(`/java-route/${adj.prev}`)}
            className="!text-[#eff1f6]"
          />
          <Text className="!text-[#8c8c8c]">
            {chapter.num}. {quiz.title}
          </Text>
          <Button
            type="text"
            icon={<CaretRightOutlined />}
            disabled={!adj.next}
            onClick={() => adj.next && navigate(`/java-route/${adj.next}`)}
            className="!text-[#eff1f6]"
          />
        </Space>
      }
    >
      <div className="flex h-[calc(100vh-64px)] flex-col">
        {/* LeetCode-style toolbar */}
        <div className="flex items-center justify-between border-b border-[#3a3a3a] bg-[#282828] px-4 py-2">
          <Space>
            <Tag color={diffColor[quiz.difficulty]}>{quiz.difficulty}</Tag>
            {quiz.tags.map((t) => (
              <Tag key={t} className="!border-[#3a3a3a] !bg-[#1a1a1a] !text-[#b3b3b3]">
                {t}
              </Tag>
            ))}
          </Space>
          <Space>
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => runCheck(false)}
              className="!border-[#3a3a3a] !bg-[#1a1a1a] !text-[#eff1f6]"
            >
              运行
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => runCheck(true)}
              className="!bg-[#2cbb5d] !border-[#2cbb5d]"
            >
              提交
            </Button>
          </Space>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Left: description */}
          <div className="w-[45%] overflow-y-auto border-r border-[#3a3a3a] bg-[#1a1a1a] p-5">
            <Title level={4} className="!text-[#eff1f6] !mb-1">
              {chapter.num}. {quiz.title}
            </Title>
            <Text className="!text-[#8c8c8c] text-sm">{chapter.title}</Text>

            <div className="mt-5 space-y-4 text-[#eff1f6] text-sm leading-relaxed">
              {quiz.story.split('\n\n').map((p, i) => (
                <Paragraph key={i} className="!text-[#eff1f6] !mb-0 whitespace-pre-wrap">
                  {p.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**'))
                      return (
                        <strong key={j} className="text-[#ffa116]">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    if (part.startsWith('`') && part.endsWith('`'))
                      return (
                        <code key={j} className="rounded bg-[#282828] px-1 text-[#ffa116]">
                          {part.slice(1, -1)}
                        </code>
                      );
                    return part;
                  })}
                </Paragraph>
              ))}
            </div>

            {quiz.examples.map((ex, i) => (
              <div key={i} className="mt-5 rounded-lg bg-[#282828] p-4">
                <Text strong className="!text-[#eff1f6]">
                  示例 {i + 1}
                </Text>
                <pre className="mt-2 text-xs text-[#b3b3b3]">
                  <div>
                    <span className="text-[#8c8c8c]">输入：</span>
                    {ex.input}
                  </div>
                  <div>
                    <span className="text-[#8c8c8c]">输出：</span>
                    {ex.output}
                  </div>
                  {ex.explanation && (
                    <div className="mt-1 text-[#8c8c8c]">解释：{ex.explanation}</div>
                  )}
                </pre>
              </div>
            ))}

            <div className="mt-5">
              <Text strong className="!text-[#eff1f6]">
                约束
              </Text>
              <ul className="mt-2 list-disc pl-5 text-[#b3b3b3] text-sm">
                {quiz.constraints.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: editor + bottom panel */}
          <div className="flex min-w-0 flex-1 flex-col bg-[#1a1a1a]">
            <div className="flex items-center justify-between border-b border-[#3a3a3a] bg-[#282828] px-4 py-1.5">
              <Text className="!text-[#b3b3b3] text-xs">Java</Text>
              <Text className="!text-[#6e7681] text-xs">自动保存</Text>
            </div>

            <CodeEditor value={code} onChange={setCode} />

            <div className="h-[180px] border-t border-[#3a3a3a] bg-[#1a1a1a]">
              <Tabs
                activeKey={bottomTab}
                onChange={setBottomTab}
                className="quiz-tabs h-full px-2"
                items={[
                  {
                    key: 'testcase',
                    label: '测试用例',
                    children: (
                      <div className="overflow-y-auto px-2 pb-2 text-sm text-[#b3b3b3]">
                        {quiz.examples.map((ex, i) => (
                          <div key={i} className="mb-2 font-mono text-xs">
                            case {i + 1}: {ex.input} → {ex.output}
                          </div>
                        ))}
                        <Text className="!text-[#6e7681] text-xs">提示：{quiz.hint}</Text>
                      </div>
                    ),
                  },
                  {
                    key: 'result',
                    label: '测试结果',
                    children: (
                      <div className="px-2 pb-2">
                        {!result ? (
                          <Text className="!text-[#6e7681]">点击「运行」或「提交」查看结果</Text>
                        ) : (
                          <div>
                            <Tag color={result.pass ? 'success' : 'error'}>
                              {result.pass ? '通过' : '未通过'}
                            </Tag>
                            <Paragraph
                              className={`!mb-0 mt-2 text-sm ${result.pass ? '!text-[#2cbb5d]' : '!text-[#ff375f]'}`}
                            >
                              {result.message}
                            </Paragraph>
                            {result.pass && adj.next && (
                              <Button
                                type="link"
                                className="mt-2 px-0 !text-[#ffa116]"
                                onClick={() => navigate(`/java-route/${adj.next}`)}
                              >
                                下一章 →
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </SchoolLayout>
  );
};
