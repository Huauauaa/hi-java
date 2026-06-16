import { CaretLeftOutlined, CaretRightOutlined, CloudUploadOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tabs, Tag, Typography, message } from 'antd';
import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { KnowledgeTag } from '../components/KnowledgeTag';
import { SchoolLayout } from '../components/SchoolLayout';
import { getChapter } from '../data/chapters';
import { chapterSiteUrl } from '../data/siteLinks';
import { getAdjacentChapter, getQuiz } from '../data/quizzes';
import { getRecord, addSubmission, saveRecord, type SubmitVersion } from '../lib/quizProgress';

const { Title, Paragraph, Text } = Typography;

type Props = {
  chapterId: string;
  navigate: (path: string) => void;
};

const diffColor = { Easy: 'green', Medium: 'orange', Hard: 'red' } as const;

export const QuizPage: FC<Props> = ({ chapterId, navigate }) => {
  const chapter = getChapter(chapterId);
  const quiz = getQuiz(chapterId);
  const adj = getAdjacentChapter(chapterId);

  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ pass: boolean; message: string } | null>(null);
  const [submissions, setSubmissions] = useState<SubmitVersion[]>([]);
  const [viewSubmit, setViewSubmit] = useState<SubmitVersion | null>(null);
  const [bottomTab, setBottomTab] = useState('testcase');
  const statusRef = useRef<'doing' | 'done' | 'todo'>('todo');
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    let cancelled = false;
    (async () => {
      if (!quiz) return;
      const record = await getRecord(chapterId);
      if (cancelled) return;
      statusRef.current = record?.status ?? 'todo';
      setCode(record?.content || quiz.starterCode);
      setSubmissions(record?.submissions ?? []);
      setResult(null);
      setBottomTab('testcase');
      loadedRef.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterId, quiz]);

  useEffect(() => {
    if (!quiz || !loadedRef.current || statusRef.current === 'done') return;
    if (code === quiz.starterCode && statusRef.current === 'todo') return;
    const t = setTimeout(() => {
      saveRecord(chapterId, code, 'doing');
      statusRef.current = 'doing';
    }, 400);
    return () => clearTimeout(t);
  }, [code, chapterId, quiz]);

  const runCheck = useCallback(
    async (submit: boolean) => {
      if (!quiz) return;
      const r = quiz.validate(code);
      setResult(r);
      setBottomTab('result');
      if (submit) {
        const list = await addSubmission(chapterId, code, r.pass, r.message);
        setSubmissions(list);
        statusRef.current = r.pass ? 'done' : statusRef.current === 'done' ? 'done' : 'doing';
      } else if (r.pass) {
        await saveRecord(chapterId, code, 'done');
        statusRef.current = 'done';
        message.success('运行通过');
      } else {
        message.error(r.message);
        return;
      }
      if (submit) {
        message[r.pass ? 'success' : 'error'](r.pass ? '提交成功！' : r.message);
      }
    },
    [code, quiz, chapterId],
  );

  if (!chapter || !quiz) {
    return (
      <SchoolLayout compact onBack={() => navigate('/java-route')}>
        <div className="flex flex-1 items-center justify-center text-[var(--ink)]">章节不存在</div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout
      compact
      onBack={() => navigate('/java-route')}
      backLabel="题目列表"
      extra={
        <Space>
          <Button
            type="text"
            icon={<CaretLeftOutlined />}
            disabled={!adj.prev}
            onClick={() => adj.prev && navigate(`/java-route/${adj.prev}`)}
            className="!text-[var(--ink)]"
          />
          <Text className="!text-[var(--ink-muted)]">
            {chapter.num}. {quiz.title}
          </Text>
          <Button
            type="text"
            icon={<CaretRightOutlined />}
            disabled={!adj.next}
            onClick={() => adj.next && navigate(`/java-route/${adj.next}`)}
            className="!text-[var(--ink)]"
          />
        </Space>
      }
    >
      <div className="flex h-[calc(100vh-64px)] flex-col">
        <div className="quiz-toolbar flex items-center justify-between border-b px-4 py-2">
          <Space>
            <Tag color={diffColor[quiz.difficulty]}>{quiz.difficulty}</Tag>
            {quiz.tags.map((t) => (
              <KnowledgeTag
                key={t}
                tag={t}
                chapterId={chapterId}
                className="!border-[var(--paper-line)] !bg-[var(--paper)] !text-[var(--ink-muted)]"
              />
            ))}
          </Space>
          <Space>
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => runCheck(false)}
              className="!border-[var(--paper-line)] !bg-[var(--paper)] !text-[var(--ink)]"
            >
              运行
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => runCheck(true)}
              className="!border-[var(--success)] !bg-[var(--success)]"
            >
              提交
            </Button>
          </Space>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="quiz-panel w-[45%] overflow-y-auto border-r p-5">
            <Title level={4} className="!mb-1 !text-[var(--ink)]">
              {chapter.num}. {quiz.title}
            </Title>
            <a
              href={chapterSiteUrl(chapterId)}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-[var(--ink-muted)] hover:text-[var(--amber)]"
            >
              {chapter.title}
            </a>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--ink)]">
              {quiz.story.split('\n\n').map((p, i) => (
                <Paragraph key={i} className="!mb-0 whitespace-pre-wrap !text-[var(--ink)]">
                  {p.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**'))
                      return (
                        <strong key={j} className="text-[var(--amber)]">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    if (part.startsWith('`') && part.endsWith('`'))
                      return (
                        <code key={j} className="quiz-code-block rounded px-1 text-[var(--amber)]">
                          {part.slice(1, -1)}
                        </code>
                      );
                    return part;
                  })}
                </Paragraph>
              ))}
            </div>

            {quiz.examples.map((ex, i) => (
              <div key={i} className="quiz-code-block mt-5 p-4">
                <Text strong className="!text-[var(--ink)]">
                  示例 {i + 1}
                </Text>
                <pre className="mt-2 text-xs text-[var(--ink-muted)]">
                  <div>
                    <span className="text-[var(--ink-faint)]">输入：</span>
                    {ex.input}
                  </div>
                  <div>
                    <span className="text-[var(--ink-faint)]">输出：</span>
                    {ex.output}
                  </div>
                  {ex.explanation && <div className="mt-1 text-[var(--ink-faint)]">解释：{ex.explanation}</div>}
                </pre>
              </div>
            ))}

            <div className="mt-5">
              <Text strong className="!text-[var(--ink)]">
                约束
              </Text>
              <ul className="mt-2 list-disc pl-5 text-sm text-[var(--ink-muted)]">
                {quiz.constraints.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="quiz-panel flex min-w-0 flex-1 flex-col">
            <div className="quiz-editor-bar flex items-center justify-between border-b px-4 py-1.5">
              <Text className="text-xs !text-[var(--ink-muted)]">Java</Text>
              <Text className="text-xs !text-[var(--editor-muted)]">自动保存</Text>
            </div>

            <CodeEditor value={code} onChange={setCode} />

            <div className="quiz-panel h-[180px] border-t">
              <Tabs
                activeKey={bottomTab}
                onChange={setBottomTab}
                className="quiz-tabs h-full px-2"
                items={[
                  {
                    key: 'testcase',
                    label: '测试用例',
                    children: (
                      <div className="overflow-y-auto px-2 pb-2 text-sm text-[var(--ink-muted)]">
                        {quiz.examples.map((ex, i) => (
                          <div key={i} className="mb-2 font-mono text-xs">
                            case {i + 1}: {ex.input} → {ex.output}
                          </div>
                        ))}
                        <Text className="text-xs !text-[var(--editor-muted)]">提示：{quiz.hint}</Text>
                      </div>
                    ),
                  },
                  {
                    key: 'result',
                    label: '测试结果',
                    children: (
                      <div className="px-2 pb-2">
                        {!result ? (
                          <Text className="!text-[var(--editor-muted)]">点击「运行」或「提交」查看结果</Text>
                        ) : (
                          <div>
                            <Tag color={result.pass ? 'success' : 'error'}>{result.pass ? '通过' : '未通过'}</Tag>
                            <Paragraph
                              className={`!mb-0 mt-2 text-sm ${result.pass ? '!text-[var(--success)]' : '!text-[var(--danger)]'}`}
                            >
                              {result.message}
                            </Paragraph>
                            {result.pass && adj.next && (
                              <Button
                                type="link"
                                className="mt-2 px-0 !text-[var(--amber)]"
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
                  {
                    key: 'history',
                    label: '提交记录',
                    children: (
                      <div className="overflow-y-auto px-2 pb-2">
                        {submissions.length === 0 ? (
                          <Text className="text-xs !text-[var(--editor-muted)]">暂无提交记录</Text>
                        ) : (
                          submissions.map((s, i) => (
                            <div
                              key={s.submittedAt}
                              className="quiz-panel--raised mb-2 flex items-center justify-between gap-2 rounded border px-3 py-2"
                            >
                              <Space size="small" wrap>
                                <Text className="text-xs !text-[var(--ink-muted)]">#{submissions.length - i}</Text>
                                <Text className="text-xs !text-[var(--ink-faint)]">
                                  {new Date(s.submittedAt).toLocaleString('zh-CN')}
                                </Text>
                                <Tag color={s.pass ? 'success' : 'error'} className="!mr-0">
                                  {s.pass ? '通过' : '未通过'}
                                </Tag>
                              </Space>
                              <Button
                                type="link"
                                size="small"
                                className="shrink-0 !text-[var(--amber)]"
                                onClick={() => setViewSubmit(s)}
                              >
                                查看
                              </Button>
                            </div>
                          ))
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

      <Modal
        title={viewSubmit ? `提交记录 · ${new Date(viewSubmit.submittedAt).toLocaleString('zh-CN')}` : '提交记录'}
        open={!!viewSubmit}
        onCancel={() => setViewSubmit(null)}
        width={720}
        footer={[
          <Button key="close" onClick={() => setViewSubmit(null)}>
            关闭
          </Button>,
          <Button
            key="restore"
            type="primary"
            onClick={() => {
              if (!viewSubmit) return;
              setCode(viewSubmit.content);
              setResult({ pass: viewSubmit.pass, message: viewSubmit.message });
              setViewSubmit(null);
              setBottomTab('result');
            }}
          >
            恢复到编辑器
          </Button>,
        ]}
      >
        {viewSubmit && (
          <>
            <Space className="mb-3">
              <Tag color={viewSubmit.pass ? 'success' : 'error'}>{viewSubmit.pass ? '通过' : '未通过'}</Tag>
              <Text type="secondary" className="text-sm">
                {viewSubmit.message}
              </Text>
            </Space>
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-[var(--editor-bg)] p-4 font-mono text-sm leading-6 whitespace-pre-wrap text-[var(--editor-text)]">
              {viewSubmit.content}
            </pre>
          </>
        )}
      </Modal>
    </SchoolLayout>
  );
};
